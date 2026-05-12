// Fonctions de base de la calculatrice

export function addition(a: number, b: number): number {
  return a + b;
}

export function soustraction(a: number, b: number): number {
  return a - b;
}

export function multiplication(a: number, b: number): number {
  return a * b;
}

export function division(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division par zéro impossible");
  }
  return a / b;
}

export function puissance(base: number, exposant: number): number {
  return Math.pow(base, exposant);
}

export function racineCarree(n: number): number {
  if (n < 0) {
    throw new Error("Racine carrée d'un nombre négatif impossible");
  }
  return Math.sqrt(n);
}

export function modulo(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Modulo par zéro impossible");
  }
  return a % b;
}

export function pourcentage(valeur: number, pourcent: number): number {
  return (valeur * pourcent) / 100;
}
