import { Routes, Route, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import HomePage from './pages/HomePage';
import MealDetailPage from './pages/MealDetailPage';
import SelectedMealsPage from './pages/SelectedMealsPage';
import { useSelectedMeals } from './context/SelectedMealsContext';
import SearchBar from './components/SearchBar';

function App() {
  const { meals } = useSelectedMeals();
  const [showSearch, setShowSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-coffee-cream">
      <header className="bg-coffee-dark text-white shadow-md sticky top-0 z-50 rounded-b-[40px]">
        <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-coffee-cream no-underline cursor-pointer"
            onClick={() => window.location.reload()}
          >
            МолодийКухар
          </Link>
          <div className="flex gap-5 items-center justify-end" ref={searchContainerRef}>
            <Link 
              to="/" 
              className="text-white no-underline px-4 py-2 rounded-lg hover:bg-coffee-medium active:bg-coffee-light transition-colors flex items-center order-1"
              onClick={() => window.location.reload()}
            >
              Головна
            </Link>
            <Link 
              to="/selected" 
              className="text-white no-underline px-4 py-2 rounded-lg hover:bg-coffee-medium active:bg-coffee-light transition-colors flex items-center relative order-2"
            >
              Вибрані рецепти
              {meals.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-coffee-light text-coffee-dark rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {meals.length}
                </span>
              )}
            </Link>
            <div className="flex items-center order-3">
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSearch ? 'w-72 mr-2' : 'w-0'}`}>
                <SearchBar 
                  onSearch={(query) => {
                    window.location.href = `/?search=${encodeURIComponent(query)}`;
                    setShowSearch(false);
                  }}
                  isNavigation={true}
                />
              </div>
              <button
                onClick={() => {
                  if (showSearch) {
                    const searchInput = searchContainerRef.current?.querySelector('input') as HTMLInputElement;
                    if (searchInput && searchInput.value) {
                      window.location.href = `/?search=${encodeURIComponent(searchInput.value)}`;
                      setShowSearch(false);
                    }
                  } else {
                    setShowSearch(true);
                  }
                }}
                className="text-white p-2 rounded-lg hover:bg-coffee-medium active:bg-coffee-light transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-6 pb-12 bg-coffee-cream">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meal/:id" element={<MealDetailPage />} />
          <Route path="/selected" element={<SelectedMealsPage />} />
        </Routes>
      </main>

      <footer className="bg-coffee-dark text-coffee-light p-6 text-center mt-auto rounded-t-[40px]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <Link 
              to="/" 
              className="text-xl font-bold text-coffee-cream no-underline cursor-pointer"
              onClick={() => window.location.reload()}
            >
              МолодийКухар
            </Link>
          </div>
          <p className="text-sm mb-2">Знаходьте найкращі рецепти та створюйте кулінарні шедеври</p>
          <p className="text-xs opacity-75">
            &copy; {new Date().getFullYear()} МолодийКухар • Усі права захищено
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
