import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  onCategoryChange: (category: string | null) => void;
  selectedCategory: string | null;
}

export default function CategoryFilter({
  categories,
  onCategoryChange,
  selectedCategory
}: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 text-coffee-dark">Фільтр за категоріями</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-full text-sm transition-colors border ${
            selectedCategory === null 
              ? 'bg-coffee-medium text-white border-coffee-medium hover:bg-coffee-dark' 
              : 'bg-white text-coffee-dark border-coffee-light hover:bg-coffee-light/30'
          }`}
          onClick={() => onCategoryChange(null)}
        >
          Всі
        </button>
        
        {categories.map((category) => (
          <button
            key={category.idCategory}
            className={`px-4 py-2 rounded-full text-sm transition-colors border ${
              selectedCategory === category.strCategory 
                ? 'bg-coffee-medium text-white border-coffee-medium hover:bg-coffee-dark' 
                : 'bg-white text-coffee-dark border-coffee-light hover:bg-coffee-light/30'
            }`}
            onClick={() => onCategoryChange(category.strCategory)}
          >
            {category.strCategory}
          </button>
        ))}
      </div>
    </div>
  );
} 