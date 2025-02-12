// Load HTTP module
const http = require("http");

const hostname = "0.0.0.0";
const port = 80;

// Create HTTP server
const server = http.createServer(function (req, res) {
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { "Content-Type": "text/plain" });

  // Send the response body "Hello World"
  res.end(`Hello1 World\nGit comit SHA:${process.env.GIT_COMMIT_TAG}`);
});

// Prints a log once the server starts listening
server.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});