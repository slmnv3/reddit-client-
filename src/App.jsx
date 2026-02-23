import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Posts from './features/posts/Posts';
import PostDetail from './features/postDetail/PostDetail';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/post/:subreddit/:postId" element={<PostDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;