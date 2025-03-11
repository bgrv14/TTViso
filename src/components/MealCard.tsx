import { Link } from 'react-router-dom';
import { MealWithIngredients } from '../types';
import { useSelectedMeals } from '../context/SelectedMealsContext';

interface MealCardProps {
  meal: MealWithIngredients;
}

export function MealCard({ meal }: MealCardProps) {
  const { add, remove, isSelected } = useSelectedMeals();
  const isInSelectedMeals = isSelected(meal.idMeal);

  const handleToggleSelect = () => {
    if (isInSelectedMeals) {
      remove(meal.idMeal);
    } else {
      add(meal);
    }
  };

  return (
    <div className="card group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <Link to={`/meal/${meal.idMeal}`}>
          <img 
            src={meal.strMealThumb} 
            alt={meal.strMeal} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <button 
            onClick={handleToggleSelect}
            className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors ${
              isInSelectedMeals 
                ? 'bg-coffee-light text-coffee-dark hover:bg-coffee-accent hover:text-white' 
                : 'bg-white/80 text-coffee-dark hover:bg-coffee-light'
            }`}
            title={isInSelectedMeals ? 'Видалити з вибраних' : 'Додати до вибраних'}
          >
            {isInSelectedMeals ? '♥' : '♡'}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-coffee-dark/80 to-transparent p-3 text-white">
          <div className="text-xs font-medium">
            {meal.strCategory} · {meal.strArea}
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/meal/${meal.idMeal}`} className="no-underline">
          <h3 className="text-lg font-semibold mb-2 text-coffee-dark group-hover:text-coffee-medium transition-colors">
            {meal.strMeal}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex justify-between items-center">
          <span className="text-sm text-coffee-accent">
            {/* Тут можна додати час приготування, якщо є */}
            {meal.strTags ? meal.strTags.split(',')[0] : 'Рецепт'}
          </span>
          <Link 
            to={`/meal/${meal.idMeal}`} 
            className="btn-secondary text-sm py-1 no-underline inline-block"
          >
            Детальніше
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MealCard; 