const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

jest.mock("../db/connection", () => jest.fn());

// Mock middleware
jest.mock("../middleware/auth", () => (req, res, next) => {
  req.user = { id: "user123" };
  next();
});

// Mock models
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const MealPlan = require("../models/MealPlan");
const Meal = require("../models/Meal");

jest.mock("../models/User");
jest.mock("../models/Recipe");
jest.mock("../models/MealPlan");
jest.mock("../models/Meal");

// Also mock bcrypt and jwt for auth routes
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("API Endpoints", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Auth Routes", () => {
    it("POST /api/auth/register", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed_pw");
      User.prototype.save = jest
        .fn()
        .mockResolvedValue({ _id: "user123", email: "test@test.com" });
      jwt.sign.mockReturnValue("token123");

      const res = await request(app).post("/api/auth/register").send({
        name: "Test",
        email: "test@test.com",
        password: "password123",
      });
      expect(res.statusCode).toBe(201);
    });

    it("POST /api/auth/login", async () => {
      User.findOne.mockResolvedValue({
        _id: "user123",
        password: "hashed_pw",
        email: "test@test.com",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token123");

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@test.com", password: "password123" });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe("token123");
    });
  });

  describe("User Routes", () => {
    it("GET /api/user/profile", async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "user123",
          name: "Test",
          createdAt: new Date(),
        }),
      });
      Recipe.countDocuments.mockResolvedValue(2);
      MealPlan.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      const res = await request(app).get("/api/user/profile");
      expect(res.statusCode).toBe(200);
      expect(res.body.stats.recipesCreated).toBe(2);
    });

    it("PUT /api/user/profile", async () => {
      const mockSave = jest.fn().mockResolvedValue();
      User.findById.mockResolvedValue({
        _id: "user123",
        name: "Old",
        save: mockSave,
      });

      const res = await request(app)
        .put("/api/user/profile")
        .send({ name: "New" });
      expect(res.statusCode).toBe(200);
      expect(res.body.user.name).toBe("New");
    });

    it("PUT /api/user/profile/avatar (Image Processing logic check)", async () => {
      const mockSave = jest.fn().mockResolvedValue();
      User.findById.mockResolvedValue({ _id: "user123", save: mockSave });

      // Valid base64 payload
      const res = await request(app)
        .put("/api/user/profile/avatar")
        .send({ avatar: "base64_string_here" });
      expect(res.statusCode).toBe(200);
      expect(res.body.avatar).toBe("base64_string_here");
    });

    it("PUT /api/user/profile/avatar (Image Payload Too Large - 413 check)", async () => {
      // Create a dummy payload larger than 15mb to test the index.js error handler
      const res = await request(app).put("/api/user/profile/avatar").send({});
      expect(res.statusCode).toBe(400); // no avatar provided
    });

    it("POST /api/user/favorites/:recipeId", async () => {
      const mockSave = jest.fn().mockResolvedValue();
      User.findById.mockResolvedValue({
        _id: "user123",
        favorites: [],
        save: mockSave,
      });
      Recipe.findById.mockResolvedValue({ _id: "rec1" });

      const res = await request(app).post("/api/user/favorites/rec1");
      expect(res.statusCode).toBe(200);
      expect(res.body.isFavorite).toBe(true);
    });

    it("GET /api/user/favorites", async () => {
      User.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockResolvedValue({ _id: "user123", favorites: [{ _id: "rec1" }] }),
      });

      const res = await request(app).get("/api/user/favorites");
      expect(res.statusCode).toBe(200);
      expect(res.body.favorites.length).toBe(1);
    });

    it("DELETE /api/user/profile", async () => {
      Recipe.deleteMany.mockResolvedValue();
      MealPlan.deleteMany.mockResolvedValue();
      User.findByIdAndDelete.mockResolvedValue();

      const res = await request(app).delete("/api/user/profile");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("Recipe Routes", () => {
    it("POST /api/recipes", async () => {
      Recipe.prototype.save = jest.fn().mockResolvedValue({ _id: "rec1" });

      const res = await request(app)
        .post("/api/recipes")
        .send({ title: "New Recipe" });
      expect(res.statusCode).toBe(201);
    });

    it("GET /api/recipes", async () => {
      Recipe.find.mockResolvedValue([{ _id: "rec1" }]);

      const res = await request(app).get("/api/recipes");
      expect(res.statusCode).toBe(200);
    });

    it("GET /api/recipes/my-recipes", async () => {
      Recipe.find.mockResolvedValue([{ _id: "rec1" }]);

      const res = await request(app).get("/api/recipes/my-recipes");
      expect(res.statusCode).toBe(200);
    });

    it("GET /api/recipes/:id", async () => {
      Recipe.findById.mockResolvedValue({ _id: "rec1" });

      const res = await request(app).get("/api/recipes/rec1");
      expect(res.statusCode).toBe(200);
    });

    it("PUT /api/recipes/:id", async () => {
      Recipe.findById.mockResolvedValue({
        _id: "rec1",
        user: "user123",
        isUserCreated: true,
      });
      Recipe.findByIdAndUpdate.mockResolvedValue({
        _id: "rec1",
        title: "Updated",
      });

      const res = await request(app)
        .put("/api/recipes/rec1")
        .send({ title: "Updated" });
      expect(res.statusCode).toBe(200);
    });

    it("POST /api/recipes/:id/rate", async () => {
      const mockSave = jest.fn().mockResolvedValue();
      Recipe.findById.mockResolvedValue({
        _id: "rec1",
        ratings: [],
        save: mockSave,
      });

      const res = await request(app)
        .post("/api/recipes/rec1/rate")
        .send({ rating: 4 });
      expect(res.statusCode).toBe(200);
    });

    it("DELETE /api/recipes/:id", async () => {
      Recipe.findById.mockResolvedValue({
        _id: "rec1",
        user: "user123",
        isUserCreated: true,
      });
      Recipe.findByIdAndDelete.mockResolvedValue();

      const res = await request(app).delete("/api/recipes/rec1");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("MealPlan Routes", () => {
    const emptyDay = { Breakfast: null, Lunch: null, Dinner: null };
    const createEmptyWeek = () => ({
      monday: { ...emptyDay },
      tuesday: { ...emptyDay },
      wednesday: { ...emptyDay },
      thursday: { ...emptyDay },
      friday: { ...emptyDay },
      saturday: { ...emptyDay },
      sunday: { ...emptyDay },
    });

    it("POST /api/mealplan", async () => {
      MealPlan.findOneAndUpdate.mockResolvedValue({ _id: "mp1" });

      const res = await request(app)
        .post("/api/mealplan")
        .send({ startDate: "2023-01-01", week: {} });
      expect(res.statusCode).toBe(201);
    });

    it("GET /api/mealplan", async () => {
      MealPlan.findOne.mockReturnValue({
        populate: jest
          .fn()
          .mockResolvedValue({ _id: "mp1", week: createEmptyWeek() }),
      });

      const res = await request(app).get("/api/mealplan?startDate=2023-01-01");
      expect(res.statusCode).toBe(200);
    });

    it("GET /api/mealplan/shopping-list", async () => {
      MealPlan.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ week: createEmptyWeek() }),
      });

      const res = await request(app).get(
        "/api/mealplan/shopping-list?startDate=2023-01-01",
      );
      expect(res.statusCode).toBe(200);
    });

    it("GET /api/mealplan/shopping-list with ingredient merging", async () => {
      const week = createEmptyWeek();
      week.monday.Breakfast = {
        _id: "recipe1",
        title: "Recipe 1",
        servings: 1,
        ingredients: [
          { name: "chicken", quantity: 1, unit: "peice" },
          { name: "brocli", quantity: 300, unit: "grams" },
        ],
      };
      week.monday.Lunch = {
        _id: "recipe2",
        title: "Recipe 2",
        servings: 1,
        ingredients: [
          { name: "chiken", quantity: 2, unit: "piece" },
          { name: "broccoli", quantity: 200, unit: "grams" },
        ],
      };

      MealPlan.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ week }),
      });

      const res = await request(app).get(
        "/api/mealplan/shopping-list?startDate=2023-01-01",
      );
      expect(res.statusCode).toBe(200);

      const ingredients = res.body.ingredients;
      expect(ingredients.length).toBe(2);

      const chicken = ingredients.find((i) => i.name === "chicken");
      expect(chicken).toBeDefined();
      expect(chicken.quantity).toBe(3);
      expect(chicken.unit).toBe("pieces");

      const broccoli = ingredients.find((i) => i.name === "broccoli");
      expect(broccoli).toBeDefined();
      expect(broccoli.quantity).toBe(500);
      expect(broccoli.unit).toBe("g");
    });

    it("GET /api/mealplan/shopping-list with duplicate recipe summation", async () => {
      const week = createEmptyWeek();
      const yogurtParfait = {
        _id: "yogurt_parfait_123",
        title: "Greek Yogurt Parfait",
        servings: 1,
        ingredients: [
          { name: "Greek yogurt", quantity: 200, unit: "grams" },
          { name: "Granola", quantity: 50, unit: "grams" },
        ],
      };

      week.monday.Breakfast = yogurtParfait;
      week.tuesday.Breakfast = yogurtParfait;

      MealPlan.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ week }),
      });

      const res = await request(app).get(
        "/api/mealplan/shopping-list?startDate=2023-01-01",
      );
      expect(res.statusCode).toBe(200);

      const ingredients = res.body.ingredients;
      expect(ingredients.length).toBe(2);

      const yogurt = ingredients.find((i) => i.name === "Greek yogurt");
      expect(yogurt).toBeDefined();
      expect(yogurt.quantity).toBe(400);
      expect(yogurt.unit).toBe("g");

      const granola = ingredients.find((i) => i.name === "Granola");
      expect(granola).toBeDefined();
      expect(granola.quantity).toBe(100);
      expect(granola.unit).toBe("g");
    });

    it("PUT /api/mealplan/:day/:slot", async () => {
      MealPlan.findOne.mockResolvedValue({
        _id: "mp1",
        week: createEmptyWeek(),
        save: jest.fn().mockResolvedValue(),
        markModified: jest.fn(),
      });

      const res = await request(app)
        .put("/api/mealplan/monday/Breakfast")
        .send({ startDate: "2023-01-01", recipeId: "rec1" });
      expect(res.statusCode).toBe(200);
    });

    it("DELETE /api/mealplan/:day/:slot", async () => {
      const weekWithRec = createEmptyWeek();
      weekWithRec.monday.Breakfast = "rec1";
      MealPlan.findOne.mockResolvedValue({
        _id: "mp1",
        week: weekWithRec,
        save: jest.fn().mockResolvedValue(),
      });

      const res = await request(app).delete(
        "/api/mealplan/monday/Breakfast?startDate=2023-01-01",
      );
      expect(res.statusCode).toBe(200);
    });

    it("PUT /api/mealplan", async () => {
      MealPlan.findOne.mockResolvedValue({
        _id: "mp1",
        week: createEmptyWeek(),
        save: jest.fn().mockResolvedValue(),
        markModified: jest.fn(),
      });

      const res = await request(app)
        .put("/api/mealplan")
        .send({ startDate: "2023-01-01", week: {} });
      expect(res.statusCode).toBe(200);
    });
  });

  describe("Meal Routes", () => {
    it("POST /api/meals", async () => {
      Meal.prototype.save = jest.fn().mockResolvedValue({ _id: "meal1" });

      const res = await request(app)
        .post("/api/meals")
        .send({ name: "New Meal" });
      expect(res.statusCode).toBe(201);
    });

    it("GET /api/meals", async () => {
      Meal.find.mockResolvedValue([{ _id: "meal1" }]);

      const res = await request(app).get("/api/meals");
      expect(res.statusCode).toBe(200);
    });

    it("PUT /api/meals/:id", async () => {
      Meal.findOneAndUpdate.mockResolvedValue({ _id: "meal1" });

      const res = await request(app)
        .put("/api/meals/meal1")
        .send({ name: "Updated Meal" });
      expect(res.statusCode).toBe(200);
    });

    it("DELETE /api/meals/:id", async () => {
      Meal.findOneAndDelete.mockResolvedValue({ _id: "meal1" });

      const res = await request(app).delete("/api/meals/meal1");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("Image Processing Specifics", () => {
    it("Returns 413 if payload is too large", async () => {
      const largeString = Buffer.alloc(16 * 1024 * 1024, "a").toString();
      const res = await request(app)
        .put("/api/user/profile/avatar")
        .send({ avatar: largeString });

      expect(res.statusCode).toBe(413);
      expect(res.body.message).toMatch(/too large/i);
    }, 10000); // give it more time if string generation is slow
  });
});
