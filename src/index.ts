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

// Démonstration en ligne de commande
// Usage: node index.js <operation> <a> [b]
// Exemples:
//   node index.js add 5 3
//   node index.js sqrt 16

const args = process.argv.slice(2);
const operation = args[0];
const a = parseFloat(args[1]);
const b = parseFloat(args[2]);

function main() {
  if (!operation) {
    console.log("=== Calculatrice TypeScript ===");
    console.log("Démonstration des fonctions :");
    console.log(`addition(5, 3) = ${addition(5, 3)}`);
    console.log(`soustraction(10, 4) = ${soustraction(10, 4)}`);
    console.log(`multiplication(6, 7) = ${multiplication(6, 7)}`);
    console.log(`division(20, 4) = ${division(20, 4)}`);
    console.log(`puissance(2, 10) = ${puissance(2, 10)}`);
    console.log(`racineCarree(144) = ${racineCarree(144)}`);
    console.log(`modulo(17, 5) = ${modulo(17, 5)}`);
    console.log(`pourcentage(200, 15) = ${pourcentage(200, 15)}`);
    console.log("\nUsage : docker compose run --rm calculatrice <op> <a> [b]");
    console.log("Opérations : add, sub, mul, div, pow, sqrt, mod, pct");
    return;
  }

  try {
    let resultat: number;
    switch (operation) {
      case "add":
        resultat = addition(a, b);
        break;
      case "sub":
        resultat = soustraction(a, b);
        break;
      case "mul":
        resultat = multiplication(a, b);
        break;
      case "div":
        resultat = division(a, b);
        break;
      case "pow":
        resultat = puissance(a, b);
        break;
      case "sqrt":
        resultat = racineCarree(a);
        break;
      case "mod":
        resultat = modulo(a, b);
        break;
      case "pct":
        resultat = pourcentage(a, b);
        break;
      default:
        console.error(`Opération inconnue : ${operation}`);
        process.exit(1);
    }
    console.log(`Résultat : ${resultat}`);
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Erreur : ${e.message}`);
    }
    process.exit(1);
  }
}

main();
