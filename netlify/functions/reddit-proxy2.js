export default async (req) => {
  const url = new URL(req.url);
  const path = url.searchParams.get('path');

  if (!path) {
    return new Response(
      JSON.stringify({ error: 'Missing path parameter' }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }

  const redditUrl = `https://old.reddit.com${path}`;

  try {
    const response = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RedditLite/1.0; +https://lighthearted-dusk-f64ad9.netlify.app)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const text = await response.text();

    // Check if Reddit returned HTML instead of JSON
    if (text.startsWith('<!') || text.startsWith('<html')) {
      return new Response(
        JSON.stringify({ error: 'Reddit returned HTML instead of JSON' }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const config = {
  path: '/api/reddit-proxy',
};