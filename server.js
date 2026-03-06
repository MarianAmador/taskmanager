const http = require("http");
const { handleRoutes } = require("./routes");

const server = http.createServer((req, res) => {
  handleRoutes(req, res);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ API corriendo en http://localhost:${PORT}`);
});
