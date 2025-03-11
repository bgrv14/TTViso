import { useState, useEffect } from 'react';

/**
 * Хук, який створює debounced значення
 * @param value Значення, яке потрібно "дебаунсити"
 * @param delay Затримка в мілісекундах
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Створюємо таймер для оновлення значення після затримки
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаємо таймер, якщо значення змінилося до закінчення затримки
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 