const scoutSlots = [null, null, null];
const scouts = [
  { name: "Anna Wiśniewska", region: "Korea Challengers", cost: 95000 },
  { name: "Filip Domański", region: "EU Masters", cost: 75000 },
  { name: "Noah Jensen", region: "Nordics", cost: 68000 },
  { name: "Sofia Rossi", region: "ERL South", cost: 72000 },
];
let selectedScoutSlot = 0;

function renderScouting() {
  const slots = scoutSlots.map((scout, index) => `<button class="staff-slot ${selectedScoutSlot === index ? "staff-slot--active" : ""}" data-scout-slot="${index}"><span>Scout ${index + 1}</span><strong>${scout ? scout.name : "Puste miejsce"}</strong><p>${scout ? scout.region : "Kliknij, żeby kupić scouta"}</p></button>`).join("");
  const options = scouts.map((scout, index) => `<article class="candidate-card"><div><span>Scout</span><strong>${scout.name}</strong><p>Region: ${scout.region}</p><small>Koszt: ${window.clubEconomy.format(scout.cost)}</small></div><button class="upgrade-button" data-buy-scout="${index}" ${!window.clubEconomy.canAfford(scout.cost) ? "disabled" : ""}>Kup scouta</button></article>`).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="staff-grid">${slots}</div><section><div class="section-heading"><span>Dostępni scoutci</span><h4>Slot ${selectedScoutSlot + 1}</h4></div><div class="candidate-grid">${options}</div></section></div>`;
}

function setupScouting(onChange) {
  document.querySelectorAll("[data-scout-slot]").forEach((button) => button.addEventListener("click", () => { selectedScoutSlot = Number(button.dataset.scoutSlot); onChange(); }));
  document.querySelectorAll("[data-buy-scout]").forEach((button) => button.addEventListener("click", () => {
    const scout = scouts[Number(button.dataset.buyScout)];
    if (scout && window.clubEconomy.spend(scout.cost)) {
      scoutSlots[selectedScoutSlot] = scout;
      onChange();
    }
  }));
}

window.renderScouting = renderScouting;
window.setupScouting = setupScouting;
