import mysql, { Pool, RowDataPacket } from "mysql2/promise";

let pool: Pool | null = null;

export async function initDb(): Promise<Pool> {
  const config = {
    host: process.env.DB_HOST || "mysql",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "calculatrice",
    waitForConnections: true,
    connectionLimit: 10,
  };

  for (let tentative = 1; tentative <= 30; tentative++) {
    try {
      pool = mysql.createPool(config);
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      break;
    } catch (e) {
      console.log(`MySQL pas prêt (tentative ${tentative}/30), nouvel essai dans 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
      if (tentative === 30) throw e;
    }
  }

  if (!pool) throw new Error("Impossible de se connecter à MySQL");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS historique (
      id INT AUTO_INCREMENT PRIMARY KEY,
      operation VARCHAR(10) NOT NULL,
      a DOUBLE NOT NULL,
      b DOUBLE NULL,
      resultat DOUBLE NULL,
      erreur VARCHAR(255) NULL,
      cree_a TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_cree_a (cree_a)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  console.log("BDD prête.");
  return pool;
}

export function getPool(): Pool {
  if (!pool) throw new Error("BDD non initialisée");
  return pool;
}

export async function enregistrerCalcul(params: {
  operation: string;
  a: number;
  b: number | null;
  resultat: number | null;
  erreur: string | null;
}): Promise<void> {
  await getPool().execute(
    "INSERT INTO historique (operation, a, b, resultat, erreur) VALUES (?, ?, ?, ?, ?)",
    [params.operation, params.a, params.b, params.resultat, params.erreur]
  );
}

export interface LigneHistorique extends RowDataPacket {
  id: number;
  operation: string;
  a: number;
  b: number | null;
  resultat: number | null;
  erreur: string | null;
  cree_a: Date;
}

export async function listerHistorique(limite = 20): Promise<LigneHistorique[]> {
  const [rows] = await getPool().query<LigneHistorique[]>(
    "SELECT id, operation, a, b, resultat, erreur, cree_a FROM historique ORDER BY id DESC LIMIT ?",
    [limite]
  );
  return rows;
}

export async function viderHistorique(): Promise<void> {
  await getPool().query("TRUNCATE TABLE historique");
}