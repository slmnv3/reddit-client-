const REDDIT_URLS = [
  'https://old.reddit.com',
  'https://www.reddit.com',
  'https://api.reddit.com',
];

export default async (req) => {
  const url = new URL(req.url);
  const path = url.searchParams.get('path');

  if (!path) {
    return new Response(
      JSON.stringify({ error: 'Missing path parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let lastError = null;

  // Try each Reddit URL until one works
  for (const baseUrl of REDDIT_URLS) {
    try {
      const redditUrl = `${baseUrl}${path}`;

      const response = await fetch(redditUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RedditLite/1.0)',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        lastError = `${baseUrl} returned ${response.status}`;
        continue;
      }

      const text = await response.text();

      if (text.startsWith('<!') || text.startsWith('<html')) {
        lastError = `${baseUrl} returned HTML`;
        continue;
      }

      // Success!
      return new Response(text, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      lastError = error.message;
      continue;
    }
  }

  // All URLs failed
  return new Response(
    JSON.stringify({ error: `All Reddit endpoints failed. Last error: ${lastError}` }),
    {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const config = {
  path: '/api/reddit-proxy',
};