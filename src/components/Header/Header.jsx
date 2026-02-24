import SearchBar from '../SearchBar/SearchBar';
import styles from './Header.module.css';

export default function Header({ searchTerm, onSearchSubmit }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🟣</span>
          <h1 className={styles.logoText}>RedditLite</h1>
        </div>
        <SearchBar
          searchTerm={searchTerm}
          onSearchSubmit={onSearchSubmit}
        />
      </div>
    </header>
  );
}