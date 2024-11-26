# Caching Proxy Server

A simple caching proxy server built with Node.js, Express, and Axios. This server forwards requests to a specified origin server and caches the responses to improve performance and reduce load on the origin server.

## Features

- **Caching**: Automatically caches responses from the origin server to reduce latency for repeated requests.
- **Dynamic Cache Clearing**: Clear the cache on startup or via an API endpoint while the server is running.
- **Supports Multiple HTTP Methods**: Handles GET, POST, PUT, and DELETE requests.

## Requirements

- Node.js (version 12 or newer)
- npm (Node Package Manager)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/caching-proxy.git
   cd caching-proxy
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

### Starting the Server

You can start the caching proxy server with the following command:

```bash
node caching-proxy.js --port <port> --origin <origin_url> [--clear-cache]
```

- `--port <port>`: Specify the port on which the caching proxy will run (e.g., `3000`).
- `--origin <origin_url>`: Specify the URL of the server to which requests will be forwarded (e.g., `http://dummyjson.com`).
- `--clear-cache`: (Optional) Clear the cache on startup.

**Example**:

```bash
node caching-proxy.js --port 3000 --origin http://dummyjson.com --clear-cache
```

### Clearing the Cache

- **On Startup**: You can use the `--clear-cache` option when starting the server to clear the cache immediately.
- **While Running**: You can clear the cache while the server is running by sending a POST request to the `/clear-cache` endpoint:

```bash
curl -X POST http://localhost:3000/clear-cache
```

### Testing the Proxy

After starting the server, you can test it using `curl` or any HTTP client. For example:

```bash
curl -i http://localhost:3000/products
```

The first request will fetch data from the origin server, and subsequent requests will return cached data until the cache is cleared.

## API Endpoints

### Clear Cache

- **URL**: `/clear-cache`
- **Method**: `POST`
- **Description**: Clears the cached responses.
- **Response**: Returns a message indicating that the cache has been cleared.

### Proxying Requests

The proxy server forwards requests to the origin server for the following HTTP methods:

- **GET**: Retrieve data from the origin server.
- **POST**: Send data to the origin server.
- **PUT**: Update data on the origin server.
- **DELETE**: Delete data on the origin server.

## Example Use Case

1. Start the caching proxy server:

   ```bash
   node caching-proxy.js --port 3000 --origin http://dummyjson.com
   ```

2. Make a GET request to the proxy:

   ```bash
   curl -i http://localhost:3000/products
   ```

3. Make the same GET request again to see the cached response.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have suggestions or improvements.

## Project Link
[Project URL](https://roadmap.sh/projects/caching-server)