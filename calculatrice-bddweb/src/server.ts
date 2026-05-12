import { createServer, IncomingMessage, ServerResponse } from "http";
import { readFile } from "fs/promises";
import { extname, join, normalize, resolve } from "path";
import {
  addition,
  soustraction,
  multiplication,
  division,
  puissance,
  racineCarree,
  modulo,
  pourcentage,
} from "./calculator";
import { initDb, enregistrerCalcul, listerHistorique, viderHistorique } from "./db";

const PORT = parseInt(process.env.PORT || "8082", 10);
const HOST = "0.0.0.0";
const PUBLIC_DIR = resolve(__dirname, "../public");

type OperationBinaire = (a: number, b: number) => number;
type OperationUnaire = (a: number) => number;

const operationsBinaires: Record<string, OperationBinaire> = {
  add: addition,
  sub: soustraction,
  mul: multiplication,
  div: division,
  pow: puissance,
  mod: modulo,
  pct: pourcentage,
};

const operationsUnaires: Record<string, OperationUnaire> = {
  sqrt: racineCarree,
};

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function envoyerJSON(res: ServerResponse, code: number, data: unknown) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

async function servirFichierStatique(res: ServerResponse, cheminRelatif: string) {
  const cible = normalize(join(PUBLIC_DIR, cheminRelatif));
  if (!cible.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const contenu = await readFile(cible);
    const mime = MIME[extname(cible).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    res.end(contenu);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

async function gererCalc(res: ServerResponse, op: string, url: URL) {
  const a = parseFloat(url.searchParams.get("a") || "");
  const bParam = url.searchParams.get("b");
  const b = bParam !== null ? parseFloat(bParam) : NaN;

  if (Number.isNaN(a)) {
    return envoyerJSON(res, 400, { error: "Paramètre 'a' manquant ou invalide" });
  }

  const estUnaire = op in operationsUnaires;
  const estBinaire = op in operationsBinaires;

  if (!estUnaire && !estBinaire) {
    return envoyerJSON(res, 404, { error: `Opération inconnue : ${op}` });
  }

  if (estBinaire && Number.isNaN(b)) {
    return envoyerJSON(res, 400, { error: "Paramètre 'b' manquant ou invalide" });
  }

  try {
    const resultat = estUnaire ? operationsUnaires[op](a) : operationsBinaires[op](a, b);
    await enregistrerCalcul({
      operation: op,
      a,
      b: estUnaire ? null : b,
      resultat,
      erreur: null,
    });
    return envoyerJSON(res, 200, estUnaire ? { operation: op, a, resultat } : { operation: op, a, b, resultat });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    await enregistrerCalcul({
      operation: op,
      a,
      b: estUnaire ? null : b,
      resultat: null,
      erreur: message,
    }).catch(() => {});
    return envoyerJSON(res, 400, { error: message });
  }
}

async function gererHistorique(req: IncomingMessage, res: ServerResponse, url: URL) {
  if (req.method === "DELETE") {
    await viderHistorique();
    return envoyerJSON(res, 200, { status: "ok" });
  }
  const limite = parseInt(url.searchParams.get("limite") || "20", 10);
  const lignes = await listerHistorique(Math.min(Math.max(limite, 1), 200));
  return envoyerJSON(res, 200, lignes);
}

async function gererRequete(req: IncomingMessage, res: ServerResponse) {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const chemin = url.pathname;

    if (chemin === "/health") {
      return envoyerJSON(res, 200, { status: "ok" });
    }

    if (chemin === "/history") {
      return await gererHistorique(req, res, url);
    }

    const matchCalc = chemin.match(/^\/calc\/([a-z]+)\/?$/);
    if (matchCalc) {
      return await gererCalc(res, matchCalc[1], url);
    }

    const cheminFichier = chemin === "/" ? "/index.html" : chemin;
    return servirFichierStatique(res, cheminFichier);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return envoyerJSON(res, 500, { error: message });
  }
}

async function demarrer() {
  await initDb();
  const server = createServer(gererRequete);
  server.listen(PORT, HOST, () => {
    console.log(`Calculatrice BDD à l'écoute sur http://${HOST}:${PORT}`);
  });
}

demarrer().catch((e) => {
  console.error("Erreur de démarrage :", e);
  process.exit(1);
});