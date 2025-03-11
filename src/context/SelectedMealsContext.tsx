import { createContext, useContext, useState, ReactNode } from 'react';
import { MealWithIngredients, SelectedMealsState } from '../types';

const SelectedMealsContext = createContext<SelectedMealsState | undefined>(undefined);

export const useSelectedMeals = () => {
  const context = useContext(SelectedMealsContext);
  if (!context) {
    throw new Error('useSelectedMeals must be used within a SelectedMealsProvider');
  }
  return context;
};

export const SelectedMealsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMeals, setSelectedMeals] = useState<MealWithIngredients[]>([]);

  const addMeal = (meal: MealWithIngredients) => {
    setSelectedMeals(prev => {
      if (prev.some(m => m.idMeal === meal.idMeal)) {
        return prev;
      }
      return [...prev, meal];
    });
  };

  const removeMeal = (id: string) => {
    setSelectedMeals(prev => prev.filter(meal => meal.idMeal !== id));
  };

  const clearMeals = () => {
    setSelectedMeals([]);
  };

  const isSelectedMeal = (id: string) => {
    return selectedMeals.some(meal => meal.idMeal === id);
  };

  const value = {
    meals: selectedMeals,
    add: addMeal,
    remove: removeMeal,
    clear: clearMeals,
    isSelected: isSelectedMeal
  };

  return (
    <SelectedMealsContext.Provider value={value}>
      {children}
    </SelectedMealsContext.Provider>
  );
}; 