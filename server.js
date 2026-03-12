const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});