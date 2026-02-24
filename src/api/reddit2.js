const BASE_URL = 'https://www.reddit.com';

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 7000;

const rateLimitedFetch = async (url) => {
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

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const text = await response.text();

    if (text.startsWith('<!') || text.startsWith('<')) {
      throw new Error('Reddit is temporarily unavailable. Please try again.');
    }

    return JSON.parse(text);
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
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
    const data = await cachedFetch(`${BASE_URL}/r/${subreddit}.json`);
    return data.data.children.map((post) => post.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch posts');
  }
};

export const searchPosts = async (searchTerm) => {
  try {
    const data = await cachedFetch(
      `${BASE_URL}/search.json?q=${encodeURIComponent(searchTerm)}`
    );
    return data.data.children.map((post) => post.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to search posts');
  }
};

export const fetchPostComments = async (permalink) => {
  try {
    const data = await cachedFetch(`${BASE_URL}${permalink}.json`);
    return data[1].data.children
      .filter((comment) => comment.kind === 't1')
      .map((comment) => comment.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch comments');
  }
};

export const fetchSubreddits = async () => {
  try {
    const data = await cachedFetch(
      `${BASE_URL}/subreddits/popular.json?limit=20`
    );
    return data.data.children.map((sub) => sub.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch subreddits');
  }
};