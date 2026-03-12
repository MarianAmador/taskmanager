const express = require("express");
const router = express.Router();
const controller = require("./taskController");
const auth = require("./authController");

router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);
router.post("/auth/logout", auth.logout);
router.get("/auth/me", auth.verifyToken, auth.me);

router.get("/tasks", auth.verifyToken, (req, res) => {
  res.json(controller.getAll());
});

router.post("/tasks", auth.verifyToken, (req, res) => {
  const result = controller.create(req.body);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});

router.patch("/tasks/:id", auth.verifyToken, (req, res) => {
  const task = controller.update(parseInt(req.params.id), req.body);
  if (!task) return res.status(404).json({ error: "no encontrada" });
  res.json(task);
});

router.delete("/tasks/:id", auth.verifyToken, (req, res) => {
  const deleted = controller.remove(parseInt(req.params.id));
  if (!deleted) return res.status(404).json({ error: "no encontrada" });
  res.json({ message: "eliminada", task: deleted });
});

module.exports = router;