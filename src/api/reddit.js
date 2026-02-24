const BASE_URL = 'https://www.reddit.com';

// Rate limiting: Reddit allows 10 requests per minute
const RATE_LIMIT_DELAY = 6000; // 6 seconds between requests (safe buffer)
let lastRequestTime = 0;

const rateLimitedFetch = async (url) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();

  const response = await fetch(url);

  // Handle rate limiting (HTTP 429)
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After') || 60;
    throw new Error(
      `Rate limited by Reddit. Please wait ${retryAfter} seconds and try again.`
    );
  }

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchPosts = async (subreddit = 'popular') => {
  try {
    const data = await rateLimitedFetch(`${BASE_URL}/r/${subreddit}.json`);
    return data.data.children.map((post) => post.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch posts');
  }
};

export const searchPosts = async (searchTerm) => {
  try {
    const data = await rateLimitedFetch(
      `${BASE_URL}/search.json?q=${encodeURIComponent(searchTerm)}`
    );
    return data.data.children.map((post) => post.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to search posts');
  }
};

export const fetchPostComments = async (permalink) => {
  try {
    const data = await rateLimitedFetch(`${BASE_URL}${permalink}.json`);
    // First element is the post, second is the comments
    return data[1].data.children
      .filter((comment) => comment.kind === 't1') // Filter only actual comments
      .map((comment) => comment.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch comments');
  }
};

export const fetchSubreddits = async () => {
  try {
    const data = await rateLimitedFetch(`${BASE_URL}/subreddits/popular.json?limit=20`);
    return data.data.children.map((sub) => sub.data);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch subreddits');
  }
};