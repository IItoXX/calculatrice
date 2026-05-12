import { createServer, IncomingMessage, ServerResponse } from "http";
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

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = "0.0.0.0";

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

function envoyerJSON(res: ServerResponse, code: number, data: unknown) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function gererRequete(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const chemin = url.pathname.replace(/\/+$/, "") || "/";

  if (chemin === "/" || chemin === "/health") {
    return envoyerJSON(res, 200, {
      status: "ok",
      operations: [...Object.keys(operationsBinaires), ...Object.keys(operationsUnaires)],
      usage: {
        binaire: "/calc/<op>?a=<n>&b=<n>",
        unaire: "/calc/sqrt?a=<n>",
      },
    });
  }

  const match = chemin.match(/^\/calc\/([a-z]+)$/);
  if (!match) {
    return envoyerJSON(res, 404, { error: "Route inconnue" });
  }

  const op = match[1];
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

const server = createServer(gererRequete);

server.listen(PORT, HOST, () => {
  console.log(`Calculatrice API à l'écoute sur http://${HOST}:${PORT}`);
});
