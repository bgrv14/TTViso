import React from 'react';
import { usePagination } from '../context/PaginationContext';

export default function SimplePagination() {
  const { currentPage, totalPages, setCurrentPage } = usePagination();

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const buttonClasses = `
    px-3 py-2 rounded-md text-sm font-medium
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `;

  const activeButtonClasses = `
    bg-coffee-medium text-white
    hover:bg-coffee-dark
  `;

  const inactiveButtonClasses = `
    bg-white text-coffee-dark border border-coffee-light
    hover:bg-coffee-light/30
  `;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      pages.push(...Array.from({ length: 7 }, (_, i) => i + 1));
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      pages.push(...Array.from({ length: 7 }, (_, i) => totalPages - 6 + i));
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(currentPage - 2);
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push(currentPage + 2);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`${buttonClasses} ${inactiveButtonClasses}`}
      >
        ←
      </button>

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            className={`${buttonClasses} ${
              currentPage === page ? activeButtonClasses : inactiveButtonClasses
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`${buttonClasses} ${inactiveButtonClasses}`}
      >
        →
      </button>
    </div>
  );
} 