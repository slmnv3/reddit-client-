import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ searchTerm, onSearchSubmit }) {
  const [localSearch, setLocalSearch] = useState(searchTerm || '');
  const debounceTimer = useRef(null);

  // Debounce search - wait 800ms after user stops typing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearchSubmit(localSearch);
      }
    }, 800);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [localSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    onSearchSubmit(localSearch);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <span className={styles.searchIcon}>🔍</span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search Reddit..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </form>
  );
}