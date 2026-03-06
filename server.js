const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleRoutes } = require("./routes");

const server = http.createServer((req, res) => {

  if (req.url === "/" && req.method === "GET") {
    const filePath = path.join(__dirname, "index.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error cargando HTML");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });

    return;
  }

  handleRoutes(req, res);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ API corriendo en http://localhost:${PORT}`);
});
