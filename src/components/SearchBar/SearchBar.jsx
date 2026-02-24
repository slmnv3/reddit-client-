import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ searchTerm, onSearchSubmit }) {
  const [localSearch, setLocalSearch] = useState(searchTerm || '');

  const handleSubmit = (e) => {
    e.preventDefault();
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