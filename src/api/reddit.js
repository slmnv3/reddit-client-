// Use proxy in production, direct in development
const BASE_URL = import.meta.env.PROD
  ? '/api'
  : 'https://www.reddit.com';

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
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.status === 403) {
      throw new Error('Access denied by Reddit. Please try again later.');
    }

    if (response.status === 429) {
      console.warn('Rate limited. Waiting 60 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 60000));
      const retryResponse = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!retryResponse.ok) {
        throw new Error('Still rate limited. Please wait and try again.');
      }
      return retryResponse.json();
    }

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

const cache = {};
const CACHE_DURATION = 60000;

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