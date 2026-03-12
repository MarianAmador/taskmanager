const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const USERS_DB = "users.json";
const JWT_SECRET = "mi_secreto_seguro_2024";

function readUsers() {
  if (!fs.existsSync(USERS_DB)) return [];
  return JSON.parse(fs.readFileSync(USERS_DB, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));
}

async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !username.trim())
    return res.status(400).json({ error: "El usuario es obligatorio" });
  if (!password || password.length < 4)
    return res.status(400).json({ error: "La contraseña debe tener al menos 4 caracteres" });

  const users = readUsers();
  if (users.find(u => u.username === username.toLowerCase()))
    return res.status(409).json({ error: "El usuario ya existe" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), username: username.toLowerCase(), password: hashed };
  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: "2h" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 2 * 60 * 60 * 1000
  });

  res.status(201).json({ message: "Registro exitoso", username: newUser.username });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Usuario y contraseña requeridos" });

  const users = readUsers();
  const user = users.find(u => u.username === username.toLowerCase());

  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "2h" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 2 * 60 * 60 * 1000
  });

  res.json({ message: "Login exitoso", username: user.username });
}

function logout(req, res) {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  res.json({ message: "Sesión cerrada" });
}

function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token)
    return res.status(401).json({ error: "No autenticado. Inicia sesión." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.clearCookie("token");
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
}

function me(req, res) {
  res.json({ username: req.user.username });
}

module.exports = { register, login, logout, verifyToken, me };