const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
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

  const redditUrl = `https://www.reddit.com${path}`;
  let lastError = null;

  // Try direct fetch first
  try {
    const response = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RedditLite/1.0)',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const text = await response.text();
      if (!text.startsWith('<!')) {
        return new Response(text, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=60',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
    lastError = `Direct fetch failed: ${response.status}`;
  } catch (error) {
    lastError = error.message;
  }

  // Try CORS proxies as fallback
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(redditUrl)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        lastError = `${proxy} returned ${response.status}`;
        continue;
      }

      const text = await response.text();

      if (text.startsWith('<!') || text.startsWith('<html')) {
        lastError = `${proxy} returned HTML`;
        continue;
      }

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

  return new Response(
    JSON.stringify({ error: `All endpoints failed. Last error: ${lastError}` }),
    {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const config = {
  path: '/api/reddit-proxy',
};