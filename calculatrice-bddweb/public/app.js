const form = document.getElementById("form");
const inputA = document.getElementById("a");
const inputB = document.getElementById("b");
const selectOp = document.getElementById("op");
const labelB = inputB.closest("label");
const resultatEl = document.getElementById("resultat");
const corpsHistorique = document.getElementById("corps-historique");
const btnVider = document.getElementById("btn-vider");

const OPS_UNAIRES = new Set(["sqrt"]);

const LIBELLES = {
  add: "Addition",
  sub: "Soustraction",
  mul: "Multiplication",
  div: "Division",
  pow: "Puissance",
  mod: "Modulo",
  pct: "Pourcentage",
  sqrt: "Racine carrée",
};

function majChampB() {
  const unaire = OPS_UNAIRES.has(selectOp.value);
  labelB.style.display = unaire ? "none" : "";
  inputB.required = !unaire;
}

function formaterDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR");
}

function rendreHistorique(lignes) {
  if (!lignes.length) {
    corpsHistorique.innerHTML = '<tr><td colspan="6" class="vide">Aucun calcul enregistré</td></tr>';
    return;
  }
  corpsHistorique.innerHTML = lignes
    .map((l) => {
      const erreur = l.erreur !== null;
      const valeur = erreur ? l.erreur : l.resultat;
      const classe = erreur ? "erreur" : "ok";
      return `
        <tr>
          <td>${l.id}</td>
          <td>${LIBELLES[l.operation] || l.operation}</td>
          <td>${l.a}</td>
          <td>${l.b ?? ""}</td>
          <td class="${classe}">${valeur}</td>
          <td>${formaterDate(l.cree_a)}</td>
        </tr>
      `;
    })
    .join("");
}

async function chargerHistorique() {
  try {
    const res = await fetch("/history");
    const lignes = await res.json();
    rendreHistorique(lignes);
  } catch {
    corpsHistorique.innerHTML = '<tr><td colspan="6" class="vide">Erreur de chargement</td></tr>';
  }
}

async function calculer(event) {
  event.preventDefault();
  const op = selectOp.value;
  const params = new URLSearchParams({ a: inputA.value });
  if (!OPS_UNAIRES.has(op)) params.set("b", inputB.value);

  resultatEl.className = "resultat";
  resultatEl.textContent = "…";

  try {
    const res = await fetch(`/calc/${op}?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      resultatEl.className = "resultat error";
      resultatEl.textContent = data.error || "Erreur";
    } else {
      resultatEl.className = "resultat ok";
      resultatEl.textContent = data.resultat;
    }
  } catch {
    resultatEl.className = "resultat error";
    resultatEl.textContent = "Erreur réseau";
  }

  chargerHistorique();
}

async function viderHistorique() {
  if (!confirm("Vider tout l'historique ?")) return;
  await fetch("/history", { method: "DELETE" });
  chargerHistorique();
}

selectOp.addEventListener("change", majChampB);
form.addEventListener("submit", calculer);
btnVider.addEventListener("click", viderHistorique);
majChampB();
chargerHistorique();
