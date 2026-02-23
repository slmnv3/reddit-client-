const BASE_URL = 'https://www.reddit.com';

export const fetchPosts = async (subreddit = 'popular') => {
  const response = await fetch(`${BASE_URL}/r/${subreddit}.json`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  const data = await response.json();
  return data.data.children.map((post) => post.data);
};

export const searchPosts = async (searchTerm) => {
  const response = await fetch(`${BASE_URL}/search.json?q=${searchTerm}`);
  if (!response.ok) throw new Error('Failed to search posts');
  const data = await response.json();
  return data.data.children.map((post) => post.data);
};

export const fetchPostComments = async (permalink) => {
  const response = await fetch(`${BASE_URL}${permalink}.json`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  const data = await response.json();
  return data[1].data.children.map((comment) => comment.data);
};

export const fetchSubreddits = async () => {
  const response = await fetch(`${BASE_URL}/subreddits/popular.json`);
  if (!response.ok) throw new Error('Failed to fetch subreddits');
  const data = await response.json();
  return data.data.children.map((sub) => sub.data);
};