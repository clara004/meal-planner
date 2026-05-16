const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MealPlanner API',
      version: '1.0.0',
      description: 'API documentation for the MealPlanner web application',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:            { type: 'string', example: '664a1f2e8c1b2a3d4e5f6a7b' },
            name:          { type: 'string', example: 'Sara Ahmed' },
            email:         { type: 'string', example: 'sara@example.com' },
            calorie_goal:  { type: 'number', example: 2000 },
            dietary_prefs: { type: 'string', example: 'vegetarian' },
          },
        },
        Meal: {
          type: 'object',
          properties: {
            _id:         { type: 'string', example: '664a1f2e8c1b2a3d4e5f6a7b' },
            name:        { type: 'string', example: 'Grilled Chicken' },
            description: { type: 'string', example: 'Healthy grilled chicken breast' },
            ingredients: { type: 'array', items: { type: 'string' }, example: ['chicken', 'olive oil'] },
            calories:    { type: 'number', example: 350 },
            user:        { type: 'string', example: '664a1f2e8c1b2a3d4e5f6a7b' },
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            _id:      { type: 'string', example: '664a1f2e8c1b2a3d4e5f6a7b' },
            title:    { type: 'string', example: 'Pasta Primavera' },
            cuisine:  { type: 'string', example: 'Italian' },
            servings: { type: 'number', example: 4 },
            ingredients: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name:     { type: 'string', example: 'pasta' },
                  calories: { type: 'number', example: 200 },
                  protein:  { type: 'number', example: 7 },
                  carbs:    { type: 'number', example: 40 },
                  fat:      { type: 'number', example: 1 },
                },
              },
            },
            totalNutrition: {
              type: 'object',
              properties: {
                calories: { type: 'number' },
                protein:  { type: 'number' },
                carbs:    { type: 'number' },
                fat:      { type: 'number' },
              },
            },
            perServing: {
              type: 'object',
              properties: {
                calories: { type: 'number' },
                protein:  { type: 'number' },
                carbs:    { type: 'number' },
                fat:      { type: 'number' },
              },
            },
          },
        },
        MealPlan: {
          type: 'object',
          properties: {
            _id:  { type: 'string' },
            user: { type: 'string' },
            week: {
              type: 'object',
              properties: {
                monday:    { type: 'array', items: { type: 'string' } },
                tuesday:   { type: 'array', items: { type: 'string' } },
                wednesday: { type: 'array', items: { type: 'string' } },
                thursday:  { type: 'array', items: { type: 'string' } },
                friday:    { type: 'array', items: { type: 'string' } },
                saturday:  { type: 'array', items: { type: 'string' } },
                sunday:    { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],

    paths: {
      // ─── AUTH ────────────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name:          { type: 'string',  example: 'Sara Ahmed' },
                    email:         { type: 'string',  example: 'sara@example.com' },
                    password:      { type: 'string',  example: 'secret123' },
                    calorie_goal:  { type: 'number',  example: 2000 },
                    dietary_prefs: { type: 'string',  example: 'vegetarian' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user:  { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            400: { description: 'Email already exists' },
            500: { description: 'Server error' },
          },
        },
      },

      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and receive a JWT token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email:    { type: 'string', example: 'sara@example.com' },
                    password: { type: 'string', example: 'secret123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user:  { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            400: { description: 'User not found or wrong password' },
            500: { description: 'Server error' },
          },
        },
      },

      // ─── USER ────────────────────────────────────────────────
      '/user/profile': {
        get: {
          tags: ['User'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User profile returned',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      user:    { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized — JWT missing or invalid' },
          },
        },
      },

      // ─── MEALS ───────────────────────────────────────────────
      '/meals': {
        post: {
          tags: ['Meals'],
          summary: 'Create a new meal',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'calories'],
                  properties: {
                    name:        { type: 'string',  example: 'Grilled Chicken' },
                    description: { type: 'string',  example: 'High protein meal' },
                    ingredients: { type: 'array', items: { type: 'string' }, example: ['chicken', 'lemon'] },
                    calories:    { type: 'number',  example: 350 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Meal created', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, meal: { $ref: '#/components/schemas/Meal' } } } } } },
            401: { description: 'Unauthorized' },
            500: { description: 'Server error' },
          },
        },
        get: {
          tags: ['Meals'],
          summary: 'Get all meals for the logged-in user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of meals', content: { 'application/json': { schema: { type: 'object', properties: { meals: { type: 'array', items: { $ref: '#/components/schemas/Meal' } } } } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/meals/{id}': {
        put: {
          tags: ['Meals'],
          summary: 'Update a meal by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Meal' },
              },
            },
          },
          responses: {
            200: { description: 'Meal updated' },
            401: { description: 'Unauthorized' },
            500: { description: 'Server error' },
          },
        },
        delete: {
          tags: ['Meals'],
          summary: 'Delete a meal by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Meal deleted' },
            401: { description: 'Unauthorized' },
            500: { description: 'Server error' },
          },
        },
      },

      // ─── RECIPES ─────────────────────────────────────────────
      '/recipes': {
        post: {
          tags: ['Recipes'],
          summary: 'Create a new recipe (auto-calculates nutrition)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'ingredients', 'servings'],
                  properties: {
                    title:    { type: 'string',  example: 'Pasta Primavera' },
                    cuisine:  { type: 'string',  example: 'Italian' },
                    servings: { type: 'number',  example: 4 },
                    ingredients: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name:     { type: 'string',  example: 'pasta' },
                          calories: { type: 'number',  example: 200 },
                          protein:  { type: 'number',  example: 7 },
                          carbs:    { type: 'number',  example: 40 },
                          fat:      { type: 'number',  example: 1 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Recipe created with nutrition calculated', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, recipe: { $ref: '#/components/schemas/Recipe' } } } } } },
            401: { description: 'Unauthorized' },
            500: { description: 'Server error' },
          },
        },
        get: {
          tags: ['Recipes'],
          summary: 'Get all recipes (with optional search & filter)',
          security: [],
          parameters: [
            { name: 'search',      in: 'query', schema: { type: 'string' },  description: 'Search by title (case-insensitive)' },
            { name: 'cuisine',     in: 'query', schema: { type: 'string' },  description: 'Filter by cuisine type' },
            { name: 'maxCalories', in: 'query', schema: { type: 'number' },  description: 'Filter by max calories per serving' },
          ],
          responses: {
            200: { description: 'List of recipes', content: { 'application/json': { schema: { type: 'object', properties: { recipes: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } } } } } } },
            500: { description: 'Server error' },
          },
        },
      },

      '/recipes/{id}': {
        get: {
          tags: ['Recipes'],
          summary: 'Get a single recipe by ID',
          security: [],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Recipe found', content: { 'application/json': { schema: { type: 'object', properties: { recipe: { $ref: '#/components/schemas/Recipe' } } } } } },
            404: { description: 'Recipe not found' },
            500: { description: 'Server error' },
          },
        },
        put: {
          tags: ['Recipes'],
          summary: 'Update a recipe (recalculates nutrition)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Recipe' },
              },
            },
          },
          responses: {
            200: { description: 'Recipe updated' },
            403: { description: 'Not authorized' },
            404: { description: 'Recipe not found' },
            500: { description: 'Server error' },
          },
        },
        delete: {
          tags: ['Recipes'],
          summary: 'Delete a recipe by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Recipe deleted' },
            403: { description: 'Not authorized' },
            404: { description: 'Recipe not found' },
            500: { description: 'Server error' },
          },
        },
      },

      // ─── MEAL PLAN ───────────────────────────────────────────
      '/mealplan': {
        post: {
          tags: ['Meal Plan'],
          summary: 'Create a new empty weekly meal plan',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Meal plan created', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, plan: { $ref: '#/components/schemas/MealPlan' } } } } } },
            401: { description: 'Unauthorized' },
          },
        },
        get: {
          tags: ['Meal Plan'],
          summary: "Get the logged-in user's weekly meal plan",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Meal plan returned', content: { 'application/json': { schema: { type: 'object', properties: { plan: { $ref: '#/components/schemas/MealPlan' } } } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/mealplan/{day}': {
        put: {
          tags: ['Meal Plan'],
          summary: 'Add a recipe to a specific day',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'day', in: 'path', required: true, schema: { type: 'string', enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['recipeId'],
                  properties: {
                    recipeId: { type: 'string', example: '664a1f2e8c1b2a3d4e5f6a7b' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Recipe added to day' },
            400: { description: 'Invalid day' },
            404: { description: 'Meal plan not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          tags: ['Meal Plan'],
          summary: 'Clear all recipes from a specific day',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'day', in: 'path', required: true, schema: { type: 'string', enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] } }],
          responses: {
            200: { description: 'Day cleared' },
            404: { description: 'Meal plan not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;