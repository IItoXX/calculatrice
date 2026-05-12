const form = document.getElementById("form");
const inputA = document.getElementById("a");
const inputB = document.getElementById("b");
const selectOp = document.getElementById("op");
const labelB = inputB.closest("label");
const resultatEl = document.getElementById("resultat");

const OPS_UNAIRES = new Set(["sqrt"]);

function majChampB() {
  const unaire = OPS_UNAIRES.has(selectOp.value);
  labelB.style.display = unaire ? "none" : "";
  inputB.required = !unaire;
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
      return;
    }
    resultatEl.className = "resultat ok";
    resultatEl.textContent = data.resultat;
  } catch {
    resultatEl.className = "resultat error";
    resultatEl.textContent = "Erreur réseau";
  }
}

selectOp.addEventListener("change", majChampB);
form.addEventListener("submit", calculer);
majChampB();