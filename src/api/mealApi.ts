import axios from 'axios';
import { CategoriesResponse, Ingredient, Meal, MealWithIngredients, MealsResponse } from '../types';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const transformMealToWithIngredients = (meal: Meal): MealWithIngredients => {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredientName = meal[`strIngredient${i}` as keyof Meal];
    const measure = meal[`strMeasure${i}` as keyof Meal];

    if (ingredientName && ingredientName.trim() !== '') {
      ingredients.push({
        name: ingredientName,
        measure: measure || ''
      });
    }
  }

  const {
    idMeal,
    strMeal,
    strDrinkAlternate,
    strCategory,
    strArea,
    strInstructions,
    strMealThumb,
    strTags,
    strYoutube,
    strSource,
    strImageSource,
    strCreativeCommonsConfirmed,
    dateModified
  } = meal;

  return {
    idMeal,
    strMeal,
    strDrinkAlternate,
    strCategory,
    strArea,
    strInstructions,
    strMealThumb,
    strTags,
    strYoutube,
    strSource,
    strImageSource,
    strCreativeCommonsConfirmed,
    dateModified,
    ingredients
  };
};

export const getRandomMeals = async (): Promise<MealWithIngredients[]> => {
  try {
    const promises = Array(10).fill(null).map(() => 
      axios.get<MealsResponse>(`${API_BASE_URL}/random.php`)
    );
    
    const responses = await Promise.all(promises);
    const uniqueMeals = new Map<string, Meal>();
    
    responses.forEach(response => {
      if (response.data.meals && response.data.meals.length > 0) {
        const meal = response.data.meals[0];
        uniqueMeals.set(meal.idMeal, meal);
      }
    });
    
    return Array.from(uniqueMeals.values()).map(transformMealToWithIngredients);
  } catch (error) {
    console.error('Error fetching random meals:', error);
    return [];
  }
};

export const getMealById = async (id: string): Promise<MealWithIngredients | null> => {
  try {
    const response = await axios.get<MealsResponse>(`${API_BASE_URL}/lookup.php?i=${id}`);
    
    if (response.data.meals && response.data.meals.length > 0) {
      return transformMealToWithIngredients(response.data.meals[0]);
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching meal with id ${id}:`, error);
    return null;
  }
};

export const searchMeals = async (query: string): Promise<MealWithIngredients[]> => {
  try {
    const response = await axios.get<MealsResponse>(`${API_BASE_URL}/search.php?s=${query}`);
    
    if (response.data.meals) {
      return response.data.meals.map(transformMealToWithIngredients);
    }
    
    return [];
  } catch (error) {
    console.error(`Error searching meals with query ${query}:`, error);
    return [];
  }
};

export const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await axios.get<CategoriesResponse>(`${API_BASE_URL}/categories.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [] };
  }
};

export const getMealsByCategory = async (category: string): Promise<MealWithIngredients[]> => {
  try {
    const response = await axios.get<MealsResponse>(`${API_BASE_URL}/filter.php?c=${category}`);
    
    if (response.data.meals) {
      const mealPromises = response.data.meals.map(meal => getMealById(meal.idMeal));
      const meals = await Promise.all(mealPromises);
      
      return meals.filter((meal): meal is MealWithIngredients => meal !== null);
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching meals for category ${category}:`, error);
    return [];
  }
};

export default {
  getRandomMeals,
  getMealById,
  searchMeals,
  getCategories,
  getMealsByCategory
}; 