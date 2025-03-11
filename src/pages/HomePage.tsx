import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getRandomMeals, searchMeals } from '../api/mealApi';
import MealCard from '../components/MealCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SimplePagination from '../components/SimplePagination';
import { MealWithIngredients, Ingredient } from '../types';
import { usePagination } from '../context/PaginationContext';

const generateTestMeals = (count: number): MealWithIngredients[] => {
  return Array.from({ length: count }, (_, i) => ({
    idMeal: `test-${i + 1}`,
    strMeal: `Тестовий рецепт ${i + 1}`,
    strDrinkAlternate: null,
    strCategory: i % 5 === 0 ? 'Десерт' : i % 4 === 0 ? 'Суп' : i % 3 === 0 ? 'Салат' : i % 2 === 0 ? 'Основна страва' : 'Закуска',
    strArea: i % 3 === 0 ? 'Українська' : i % 2 === 0 ? 'Італійська' : 'Французька',
    strMealThumb: `https://picsum.photos/seed/${i + 1}/300/200`,
    strTags: i % 2 === 0 ? 'Вегетаріанське' : 'М\'ясне',
    strInstructions: `Інструкції для приготування тестового рецепту ${i + 1}`,
    strYoutube: '',
    strSource: '',
    strImageSource: null,
    strCreativeCommonsConfirmed: null,
    dateModified: null,
    ingredients: Array.from({ length: 5 }, (_, j) => ({
      name: `Інгредієнт ${j + 1}`,
      measure: `${j + 1} ст. л.`
    })) as Ingredient[]
  }));
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { currentPage, setCurrentPage, setTotalPages } = usePagination();
  const pageSize = 8;
  const [testMeals, setTestMeals] = useState<MealWithIngredients[]>([]);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { 
    data: mealsData, 
    isLoading: mealsLoading, 
    error: mealsError 
  } = useQuery({
    queryKey: ['meals', searchQuery],
    queryFn: () => searchQuery ? searchMeals(searchQuery) : getRandomMeals(),
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (!mealsLoading) {
      if (mealsError || (!mealsData || mealsData.length === 0)) {
        setTestMeals(generateTestMeals(24));
      } else {
        setTestMeals([]);
      }
    }
  }, [mealsLoading, mealsData, mealsError]);

  const meals = !mealsLoading && mealsData && mealsData.length > 0 ? mealsData : testMeals;

  const filteredMeals = useMemo(() => {
    return meals && selectedCategory
      ? meals.filter(meal => meal.strCategory === selectedCategory)
      : meals || [];
  }, [meals, selectedCategory]);

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(filteredMeals.length / pageSize));
    setTotalPages(newTotalPages);
  }, [filteredMeals.length, pageSize, setTotalPages]);

  const currentMeals = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredMeals.slice(startIndex, endIndex);
  }, [filteredMeals, currentPage, pageSize]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, [setCurrentPage]);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, [setCurrentPage]);

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="bg-coffee-cream/50 rounded-lg p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-coffee-dark">Смачні рецепти</h1>
        <p className="text-coffee-medium max-w-2xl mx-auto">Знайдіть натхнення для приготування найсмачніших страв</p>
      </div>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
        
        {!categoriesLoading && categoriesData && (
          <CategoryFilter
            categories={categoriesData.categories}
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
          />
        )}
      </div>

      {currentMeals.length === 0 ? (
        <div className="text-center py-16 bg-white/70 rounded-lg">
          <svg className="w-16 h-16 text-coffee-light mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-lg text-coffee-medium">
            {searchQuery 
              ? `Не знайдено рецептів за запитом "${searchQuery}"`
              : 'Не знайдено рецептів'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentMeals.map((meal: MealWithIngredients) => (
              <MealCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
          
          <SimplePagination />
        </>
      )}
    </div>
  );
} 