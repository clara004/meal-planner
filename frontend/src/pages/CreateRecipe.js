import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

const estimateDataUrlBytes = (dataUrl) => {
  const base64 = dataUrl.split(',')[1] || '';
  return Math.ceil((base64.length * 3) / 4);
};

const buildImageDataUrl = (img, maxSide, quality) => {
  const canvas = document.createElement('canvas');
  let w = img.width;
  let h = img.height;

  if (w > maxSide || h > maxSide) {
    if (w > h) {
      h = Math.round((h * maxSide) / w);
      w = maxSide;
    } else {
      w = Math.round((w * maxSide) / h);
      h = maxSide;
    }
  }

  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', quality);
};

const emptyRecipeForm = {
  title: '',
  category: '',
  cuisine: '',
  cookTime: '',
  servings: '',
  ingredients: [{ name: '', quantity: '', unit: '', calories: '' }],
  instructions: '',
  dietaryTags: [],
};

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [fallingItems, setFallingItems] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [loadingRecipe, setLoadingRecipe] = useState(Boolean(id));
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState('');
  const fileInputRef = React.useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let maxSide = 720;
        let quality = 0.7;
        let compressed = buildImageDataUrl(img, maxSide, quality);

        while (estimateDataUrlBytes(compressed) > MAX_IMAGE_BYTES && maxSide > 360) {
          maxSide = Math.round(maxSide * 0.8);
          quality = Math.max(0.5, quality - 0.08);
          compressed = buildImageDataUrl(img, maxSide, quality);
        }

        if (estimateDataUrlBytes(compressed) > MAX_IMAGE_BYTES) {
          setSubmitError('That image is too large to save. Please choose a smaller photo.');
          setImagePreview(null);
          setImageData('');
          return;
        }

        setSubmitError('');
        setImagePreview(compressed);
        setImageData(compressed);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const triggerBurst = () => {
    const veggieImages = [
      "https://img.icons8.com/plasticine/200/tomato.png",
      "https://img.icons8.com/plasticine/200/carrot.png",
      "https://img.icons8.com/plasticine/200/broccoli.png",
      "https://img.icons8.com/plasticine/200/avocado.png",
      "https://img.icons8.com/plasticine/200/bell-pepper.png",
      "https://img.icons8.com/plasticine/200/onion.png",
      "https://img.icons8.com/plasticine/200/corn.png"
    ];
    const newItems = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      img: veggieImages[Math.floor(Math.random() * veggieImages.length)],
      left: Math.random() * 100,
      size: Math.random() * 40 + 50,
      duration: Math.random() * 1.5 + 1.5,
      delay: Math.random() * 0.5,
    }));
    setFallingItems(newItems);
    setTimeout(() => setFallingItems([]), 4000);
  };

  const formik = useFormik({
    initialValues: emptyRecipeForm,
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      category: Yup.string().required('Category is required'),
      cuisine: Yup.string().required('Cuisine is required'),
      instructions: Yup.string().required('Instructions are required'),
      servings: Yup.number().min(1).required('Servings is required'),
      ingredients: Yup.array()
        .of(Yup.object({
          name: Yup.string().required('Ingredient name is required'),
          quantity: Yup.number()
            .typeError('Quantity must be a number')
            .min(0, 'Quantity cannot be negative')
            .required('Qty is required'),
          unit: Yup.string().required('Unit is required'),
          calories: Yup.number()
            .typeError('Kcal must be a number')
            .min(0, 'Kcal cannot be negative')
            .required('Kcal is required'),
        }))
        .min(1, 'Add at least one ingredient'),
    }),
    onSubmit: async (values) => {
      setSubmitError('');
      try {
        const payload = {
          title: values.title,
          category: values.category,
          cuisine: values.cuisine,
          prepTime: Number(values.cookTime) || 0,
          servings: Number(values.servings) || 1,
          dietaryTags: values.dietaryTags,
          steps: values.instructions
            .split('\n')
            .filter(s => s.trim()),
          ingredients: values.ingredients
            .filter(ingredient => ingredient.name.trim())
            .map(ingredient => ({
              name: ingredient.name.trim(),
              quantity: Number(ingredient.quantity) || 0,
              unit: ingredient.unit.trim(),
              calories: Number(ingredient.calories) || 0,
            })),
          image: imageData || '',
        };

        if (isEditMode) {
          await api.put(`/recipes/${id}`, payload);
        } else {
          await api.post('/recipes', payload);
        }
        triggerBurst();
        setTimeout(() => { navigate(isEditMode ? '/profile' : '/recipes'); }, 2500);
      } catch (err) {
        if (err.response?.status === 401) {
          setSubmitError('Your session expired. Please log in again before saving.');
        } else if (err.response?.data?.message) {
          setSubmitError(err.response.data.message);
        } else if (err.response?.status) {
          setSubmitError(`Failed to save recipe. Server returned ${err.response.status}.`);
        } else if (err.request) {
          setSubmitError('Failed to save recipe. The app could not reach the backend server.');
        } else {
          setSubmitError(err.message || 'Failed to save recipe. Please check the form and try again.');
        }
        console.error('Failed:', err);
      }
    },
  });
  const { setValues } = formik;

  useEffect(() => {
    if (!id) {
      setLoadingRecipe(false);
      return;
    }

    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        const recipe = res.data.recipe;
        const ingredients = recipe.ingredients?.length
          ? recipe.ingredients.map(ingredient => ({
              name: ingredient.name || '',
              quantity: ingredient.quantity ?? '',
              unit: ingredient.unit || '',
              calories: ingredient.calories ?? '',
            }))
          : [{ name: '', quantity: '', unit: '', calories: '' }];

        setValues({
          title: recipe.title || '',
          category: recipe.category || '',
          cuisine: recipe.cuisine || '',
          cookTime: recipe.prepTime ?? recipe.cookTime ?? '',
          servings: recipe.servings ?? '',
          ingredients,
          instructions: (recipe.steps || []).join('\n'),
          dietaryTags: recipe.dietaryTags || [],
        });
        setImagePreview(recipe.image || null);
        setImageData(recipe.image || '');
      } catch (err) {
        if (err.response?.status === 401) {
          setSubmitError('Your session expired. Please log in again before editing.');
        } else {
          setSubmitError(err.response?.data?.message || 'Could not load this recipe for editing.');
        }
      } finally {
        setLoadingRecipe(false);
      }
    };

    fetchRecipe();
  }, [id, setValues]);

  const totalIngredientCalories = formik.values.ingredients.reduce(
    (sum, ingredient) => sum + (Number(ingredient.calories) || 0),
    0
  );

  const addIngredient = () => {
    formik.setFieldValue('ingredients', [
      ...formik.values.ingredients,
      { name: '', quantity: '', unit: '', calories: '' },
    ]);
  };

  const removeIngredient = (index) => {
    const nextIngredients = formik.values.ingredients.filter((_, i) => i !== index);
    formik.setFieldValue(
      'ingredients',
      nextIngredients.length ? nextIngredients : [{ name: '', quantity: '', unit: '', calories: '' }]
    );
  };

  if (loadingRecipe) {
    return (
      <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#0f5238] min-h-screen flex items-center justify-center">
        <p className="font-['Lexend'] text-xl font-bold">Loading recipe...</p>
      </div>
    );
  }

  return (
    <FormikProvider value={formik}>
      <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#191c1d] min-h-screen relative overflow-x-hidden">
        <style>{`
          .pill-button { border-radius: 9999px !important; }
          .glass-card { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.5); }
          @keyframes veggie-drop {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .falling-veggie { position: fixed; top: -10vh; z-index: 9999; pointer-events: none; animation: veggie-drop forwards linear; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); }
        `}</style>

        {fallingItems.map((item) => (
          <img key={item.id} src={item.img} className="falling-veggie" alt="veggie"
            style={{ left: `${item.left}%`, width: `${item.size}px`, animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s` }} />
        ))}



        <main className="pt-20">
          <div className="relative h-[380px] w-full overflow-hidden">
            <img alt="banner" className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 px-6">
              <h1 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-white tracking-tighter leading-tight">{isEditMode ? 'Edit Your Recipe' : 'Create Your Masterpiece'}</h1>
              <p className="text-white/90 text-lg mt-4 font-medium max-w-2xl">{isEditMode ? 'Update the details, ingredients, and instructions for this recipe.' : 'Share your nutritional wisdom and culinary creativity with the Vitality community.'}</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto -mt-20 pb-20 px-6 relative z-10">
            <div className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
              <form onSubmit={formik.handleSubmit} className="p-8 md:p-12 space-y-10">

                {submitError && (
                  <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-medium text-sm">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Recipe Photo</label>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-200 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center bg-white/50 hover:bg-emerald-50 transition-all cursor-pointer group overflow-hidden relative"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="group-hover:!opacity-100">
                            <span className="material-symbols-outlined text-4xl text-white">edit</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-5xl text-[#0f5238] group-hover:scale-110 transition-transform">add_a_photo</span>
                          <p className="font-['Lexend'] font-bold text-[#0f5238] mt-4">Upload Image</p>
                          <p className="text-stone-400 text-xs mt-1">Click to browse</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-6 py-2">
                    <div>
                      <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Recipe Title *</label>
                      <input name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] text-lg font-medium"
                        placeholder="e.g. Tropical Mango Power Bowl" />
                      {formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Category *</label>
                        <select name="category" value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] text-lg font-medium bg-white appearance-none cursor-pointer">
                          <option value="" disabled>Select category</option>
                          <option value="Breakfast">Breakfast</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Dinner">Dinner</option>
                          <option value="Snack">Snack</option>
                        </select>
                        {formik.touched.category && formik.errors.category && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Cuisine *</label>
                        <select name="cuisine" value={formik.values.cuisine} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] text-lg font-medium bg-white appearance-none cursor-pointer">
                          <option value="" disabled>Select cuisine</option>
                          <option value="American">American</option>
                          <option value="Asian">Asian</option>
                          <option value="Mediterranean">Mediterranean</option>
                          <option value="Mexican">Mexican</option>
                          <option value="Italian">Italian</option>
                          <option value="Indian">Indian</option>
                          <option value="Middle Eastern">Middle Eastern</option>
                          <option value="French">French</option>
                          <option value="General">General</option>
                        </select>
                        {formik.touched.cuisine && formik.errors.cuisine && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.cuisine}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Cook Time (min)</label>
                        <input name="cookTime" type="number" value={formik.values.cookTime} onChange={formik.handleChange}
                          className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238]" placeholder="e.g. 30" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Servings *</label>
                        <input name="servings" type="number" value={formik.values.servings} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238]" placeholder="e.g. 2" />
                        {formik.touched.servings && formik.errors.servings && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.servings}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Dietary Tags</label>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo", "High-Protein", "Dairy-Free", "Nut-Free", "Low-Carb"].map(tag => (
                          <label key={tag} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm hover:bg-emerald-50 transition-all">
                            <input
                              type="checkbox"
                              value={tag}
                              checked={formik.values.dietaryTags?.includes(tag)}
                              onChange={(e) => {
                                const current = formik.values.dietaryTags || [];
                                if (e.target.checked) {
                                  formik.setFieldValue('dietaryTags', [...current, tag]);
                                } else {
                                  formik.setFieldValue('dietaryTags', current.filter(t => t !== tag));
                                }
                              }}
                              className="w-4 h-4 accent-[#0f5238]"
                            />
                            <span className="text-sm font-medium text-stone-600">{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <section>
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
                    <div>
                      <h3 className="font-['Lexend'] text-[24px] font-[800] text-[#064e3b] mb-2">Ingredients & Calories *</h3>
                      <p className="text-stone-400 text-sm">Add each ingredient and its kcal amount. The recipe total is calculated automatically.</p>
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-emerald-50 min-w-[170px]">
                      <p className="text-[10px] font-[800] text-stone-400 uppercase tracking-[0.16em]">Total kcal</p>
                      <p className="font-['Lexend'] text-2xl font-[800] text-[#0f5238] leading-tight">{totalIngredientCalories.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {formik.values.ingredients.map((ingredient, index) => {
                      const nameError = formik.touched.ingredients?.[index]?.name && formik.errors.ingredients?.[index]?.name;
                      const caloriesError = formik.touched.ingredients?.[index]?.calories && formik.errors.ingredients?.[index]?.calories;

                      return (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_120px_44px] gap-3 items-start">
                          <div>
                            <label className="sr-only" htmlFor={`ingredients.${index}.name`}>Ingredient name</label>
                            <input
                              id={`ingredients.${index}.name`}
                              name={`ingredients.${index}.name`}
                              value={ingredient.name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] font-medium"
                              placeholder="Ingredient"
                            />
                            {nameError && <p className="text-red-500 text-xs mt-2 ml-3">{nameError}</p>}
                          </div>

                          <div>
                            <label className="sr-only" htmlFor={`ingredients.${index}.quantity`}>Qty</label>
                            <input
                              id={`ingredients.${index}.quantity`}
                              name={`ingredients.${index}.quantity`}
                              type="number"
                              min="0"
                              value={ingredient.quantity}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] font-medium"
                              placeholder="Qty"
                            />
                            {formik.touched.ingredients?.[index]?.quantity && formik.errors.ingredients?.[index]?.quantity && (
                              <p className="text-red-500 text-[10px] mt-1 ml-2">{formik.errors.ingredients[index].quantity}</p>
                            )}
                          </div>

                          <div>
                            <label className="sr-only" htmlFor={`ingredients.${index}.unit`}>Unit</label>
                            <input
                              id={`ingredients.${index}.unit`}
                              name={`ingredients.${index}.unit`}
                              value={ingredient.unit}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] font-medium"
                              placeholder="Unit (g, ml...)"
                            />
                            {formik.touched.ingredients?.[index]?.unit && formik.errors.ingredients?.[index]?.unit && (
                              <p className="text-red-500 text-[10px] mt-1 ml-2">{formik.errors.ingredients[index].unit}</p>
                            )}
                          </div>

                          <div>
                            <label className="sr-only" htmlFor={`ingredients.${index}.calories`}>kcal</label>
                            <input
                              id={`ingredients.${index}.calories`}
                              name={`ingredients.${index}.calories`}
                              type="number"
                              min="0"
                              value={ingredient.calories}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] font-medium"
                              placeholder="kcal"
                            />
                            {caloriesError && <p className="text-red-500 text-[10px] mt-1 ml-2">{caloriesError}</p>}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="w-11 h-11 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center md:mt-1"
                            aria-label="Remove ingredient"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {typeof formik.errors.ingredients === 'string' && (
                    <p className="text-red-500 text-xs mt-3 ml-4">{formik.errors.ingredients}</p>
                  )}

                  <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-5 bg-white text-[#0f5238] px-6 py-3 rounded-full font-bold text-sm shadow-sm hover:bg-emerald-50 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add Ingredient
                  </button>
                </section>

                <section>
                  <h3 className="font-['Lexend'] text-[24px] font-[800] text-[#064e3b] mb-3">Cooking Instructions *</h3>
                  <p className="text-stone-400 text-sm mb-4">Write each step on a new line.</p>
                  <textarea name="instructions" value={formik.values.instructions} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full p-8 rounded-[2.5rem] border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] resize-none text-gray-700 leading-relaxed"
                    rows="6" placeholder={"Step 1: Prep your ingredients\nStep 2: Mix everything together\nStep 3: Cook for 20 minutes"}></textarea>
                  {formik.touched.instructions && formik.errors.instructions && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.instructions}</p>}
                </section>

                <div className="pt-6 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <button type="button" onClick={() => navigate(isEditMode ? '/profile' : '/recipes')} className="text-stone-400 font-bold hover:text-stone-600 transition-colors px-6">Discard Changes</button>
                  <button type="submit" disabled={formik.isSubmitting}
                    className="bg-[#0f5238] text-white px-14 py-5 pill-button font-[800] text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
                    style={{ opacity: formik.isSubmitting ? 0.7 : 1 }}>
                    {formik.isSubmitting ? 'Saving...' : isEditMode ? 'Update Recipe' : 'Save Recipe'}
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>


      </div>
    </FormikProvider>
  );
};

export default CreateRecipe;
