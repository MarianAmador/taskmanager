const controller = require("./taskController");

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

function handleRoutes(req, res) {
  const { method, url } = req;

  if (method === "OPTIONS") {
    sendResponse(res, 200, {});
    return;
  }

  if (method === "GET" && url === "/tasks") {
    sendResponse(res, 200, controller.getAll());
    return;
  }

  if (method === "POST" && url === "/tasks") {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
      try {
        const result = controller.create(JSON.parse(body));
        if (result.error) { sendResponse(res, 400, result); return; }
        sendResponse(res, 201, result);
      } catch { sendResponse(res, 400, { error: "JSON inválido" }); }
    });
    return;
  }

  const matchId = url.match(/^\/tasks\/(\d+)$/);

  if (method === "PATCH" && matchId) {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
      try {
        const task = controller.update(parseInt(matchId[1]), JSON.parse(body));
        if (!task) { sendResponse(res, 404, { error: "no encontrada" }); return; }
        sendResponse(res, 200, task);
      } catch { sendResponse(res, 400, { error: "JSON inválido" }); }
    });
    return;
  }

  if (method === "DELETE" && matchId) {
    const deleted = controller.remove(parseInt(matchId[1]));
    if (!deleted) { sendResponse(res, 404, { error: "no encontrada" }); return; }
    sendResponse(res, 200, { message: "eliminada", task: deleted });
    return;
  }

  sendResponse(res, 404, { error: "ruta no encontrada" });
}

module.exports = { handleRoutes };