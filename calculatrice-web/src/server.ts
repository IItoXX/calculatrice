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

const PORT = parseInt(process.env.PORT || "8080", 10);
const HOST = "0.0.0.0";
const PUBLIC_DIR = resolve(__dirname, "../public");
const SERVE_STATIC = process.env.SERVE_STATIC !== "false";

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

function gererCalc(res: ServerResponse, op: string, url: URL) {
  const a = parseFloat(url.searchParams.get("a") || "");
  const b = parseFloat(url.searchParams.get("b") || "");

  if (Number.isNaN(a)) {
    return envoyerJSON(res, 400, { error: "Paramètre 'a' manquant ou invalide" });
  }

  try {
    if (op in operationsUnaires) {
      const resultat = operationsUnaires[op](a);
      return envoyerJSON(res, 200, { operation: op, a, resultat });
    }
    if (op in operationsBinaires) {
      if (Number.isNaN(b)) {
        return envoyerJSON(res, 400, { error: "Paramètre 'b' manquant ou invalide" });
      }
      const resultat = operationsBinaires[op](a, b);
      return envoyerJSON(res, 200, { operation: op, a, b, resultat });
    }
    return envoyerJSON(res, 404, { error: `Opération inconnue : ${op}` });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    return envoyerJSON(res, 400, { error: message });
  }
}

function gererRequete(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const chemin = url.pathname;

  if (chemin === "/health") {
    return envoyerJSON(res, 200, {
      status: "ok",
      operations: [...Object.keys(operationsBinaires), ...Object.keys(operationsUnaires)],
    });
  }

  const matchCalc = chemin.match(/^\/calc\/([a-z]+)\/?$/);
  if (matchCalc) {
    return gererCalc(res, matchCalc[1], url);
  }

  if (!SERVE_STATIC) {
    if (chemin === "/") {
      return envoyerJSON(res, 200, {
        service: "calculatrice-api",
        endpoints: ["/health", "/calc/<op>?a=&b="],
      });
    }
    return envoyerJSON(res, 404, { error: "Route inconnue" });
  }

  const cheminFichier = chemin === "/" ? "/index.html" : chemin;
  return servirFichierStatique(res, cheminFichier);
}

const server = createServer(gererRequete);

server.listen(PORT, HOST, () => {
  console.log(`Calculatrice Web à l'écoute sur http://${HOST}:${PORT}`);
});