// caching-proxy.js
const express = require('express');
const axios = require('axios');
const { Command } = require('commander');
const NodeCache = require('node-cache');

const program = new Command();
const cache = new NodeCache();

program
  .option('--port <number>', 'Port on which the caching proxy will run', parseInt)
  .option('--origin <url>', 'URL of the server to which requests will be forwarded')
  .option('--clear-cache', 'Clear the cache on startup');

program.parse(process.argv);

const options = program.opts();

if (options.clearCache) {
  cache.flushAll();
  console.log('Cache cleared on startup');
}

if (!options.port || !options.origin) {
  console.error('Both --port and --origin options are required');
  process.exit(1);
}

const app = express();

// Middleware for caching and forwarding requests
const proxyMiddleware = async (req, res) => {
  const cacheKey = req.originalUrl;

  // Check if the response is cached
  if (cache.has(cacheKey)) {
    const cachedResponse = cache.get(cacheKey);
    res.set(cachedResponse.headers);
    res.set('X-Cache', 'HIT');
    return res.status(cachedResponse.status).send(cachedResponse.data);
  }

  const originUrl = `${options.origin}${req.originalUrl}`;
  console.log(`Forwarding request to: ${originUrl}`);

  try {
    const response = await axios({
      method: req.method,  // Forward the same method
      url: originUrl,
      headers: {
        ...req.headers,
        host: undefined // Remove host header to avoid conflicts
      },
      data: req.method === 'POST' ? req.body : undefined,
    });

    // Cache the response
    cache.set(cacheKey, {
      data: response.data,
      status: response.status,
      headers: response.headers,
    });

    res.set(response.headers);
    res.set('X-Cache', 'MISS');
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error forwarding request:', error.message);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
};

// Cache clearing endpoint
app.post('/clear-cache', (req, res) => {
  cache.flushAll();
  console.log('Cache cleared');
  res.status(200).send('Cache cleared successfully');
});

// Define routes for the proxy server
app.get('*', proxyMiddleware);  // Handle GET requests
app.post('*', proxyMiddleware);  // Handle POST requests
app.put('*', proxyMiddleware);    // Handle PUT requests
app.delete('*', proxyMiddleware); // Handle DELETE requests

app.listen(options.port, () => {
  console.log(`Caching proxy server running on http://localhost:${options.port} forwarding to ${options.origin}`);
});