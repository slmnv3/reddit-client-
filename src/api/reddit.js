const PROXY_URL = 'https://YOUR-RENDER-URL.onrender.com';
const isDev = import.meta.env.DEV;

const buildUrl = (path) => {
  if (isDev) {
    return `https://www.reddit.com${path}`;
  }
  return `${PROXY_URL}/api/reddit?path=${encodeURIComponent(path)}`;
};

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000;

const rateLimitedFetch = async (url, retries = 2) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();

  try {
    const response = await fetch(url);

    if (response.status === 429) {
      throw new Error('Rate limited. Please wait a minute and try again.');
    }

    // Retry on 500/502/503 (Render waking up)
    if (response.status >= 500 && retries > 0) {
      console.log(`Server error ${response.status}, retrying in 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return rateLimitedFetch(url, retries - 1);
    }

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch') && retries > 0) {
      console.log('Network error, retrying in 5 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return rateLimitedFetch(url, retries - 1);
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Server is starting up. Please wait a moment and refresh.');
    }
    throw error;
  }
};

const cache = {};
const CACHE_DURATION = 120000;

const cachedFetch = async (url) => {
  const now = Date.now();

  if (cache[url] && now - cache[url].timestamp < CACHE_DURATION) {
    return cache[url].data;
  }

  const data = await rateLimitedFetch(url);
  cache[url] = { data, timestamp: now };
  return data;
};

export const fetchPosts = async (subreddit = 'popular') => {
  try {
    const url = buildUrl(`/r/${subreddit}.json`);
    const data = await cachedFetch(url);
    return data.data.children.map((post) => post.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch posts');
  }
};

export const searchPosts = async (searchTerm) => {
  try {
    const url = buildUrl(`/search.json?q=${encodeURIComponent(searchTerm)}`);
    const data = await cachedFetch(url);
    return data.data.children.map((post) => post.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to search posts');
  }
};

export const fetchPostComments = async (permalink) => {
  try {
    const url = buildUrl(`${permalink}.json`);
    const data = await cachedFetch(url);
    return data[1].data.children
      .filter((comment) => comment.kind === 't1')
      .map((comment) => comment.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch comments');
  }
};

export const fetchSubreddits = async () => {
  try {
    const url = buildUrl('/subreddits/popular.json?limit=20');
    const data = await cachedFetch(url);
    return data.data.children.map((sub) => sub.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch subreddits');
  }
};