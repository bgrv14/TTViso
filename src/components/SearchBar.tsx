import { useState, ChangeEvent, KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isNavigation?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Пошук рецептів...',
  isNavigation = false
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  if (isNavigation) {
    return (
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full h-8 pl-3 pr-3 text-sm text-coffee-dark bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-medium"
        />
      </div>
    );
  }

  return (
    <div className="relative mb-6 max-w-2xl mx-auto">
      <div className="flex">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="input-field pl-12 py-4 text-coffee-dark bg-white/80 focus:bg-white w-full"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg className="w-4 h-4 text-coffee-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button 
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-coffee-medium hover:text-coffee-dark"
              aria-label="Очистити пошук"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="ml-2 px-6 py-4 bg-coffee-medium text-white rounded-lg hover:bg-coffee-dark transition-colors"
          aria-label="Пошук"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
} 