import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface PaginationContextType {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
}

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      const page = parseInt(savedPage, 10);
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    }
  }, [totalPages]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (currentPage >= 1 && currentPage <= totalPages) {
      setTimeout(() => {
        localStorage.setItem('currentPage', currentPage.toString());
      }, 0);
    }
  }, [currentPage, totalPages]);

  const value = {
    currentPage,
    totalPages,
    setCurrentPage,
    setTotalPages
  };

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
}; 