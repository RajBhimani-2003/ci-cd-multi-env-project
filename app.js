const http = require("http");

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "dev";

const server = http.createServer((req, res) => {
  res.end(`Hello from ${ENV} environment 🚀`);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server; // for testing