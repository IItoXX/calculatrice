const express = require("express");
const { add, sub, mul, div } = require("./calculator");

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

function parseParams(req, res) {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    res.status(400).json({ error: "Paramètres 'a' et 'b' requis et numériques" });
    return null;
  }
  return { a, b };
}

app.get("/add", (req, res) => {
  const p = parseParams(req, res);
  if (!p) return;
  res.json({ result: add(p.a, p.b) });
});

app.get("/sub", (req, res) => {
  const p = parseParams(req, res);
  if (!p) return;
  res.json({ result: sub(p.a, p.b) });
});

app.get("/mul", (req, res) => {
  const p = parseParams(req, res);
  if (!p) return;
  res.json({ result: mul(p.a, p.b) });
});

app.get("/div", (req, res) => {
  const p = parseParams(req, res);
  if (!p) return;
  try {
    res.json({ result: div(p.a, p.b) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Calculator API à l'écoute sur http://0.0.0.0:${PORT}`);
});

module.exports = app;
