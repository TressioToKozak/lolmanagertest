const scoutSlots = [null, null, null];
const scouts = [
  { name: "Anna Wiśniewska", region: "Korea Challengers", rating: 88, discovery: "Talenty mechaniczne", cost: 95000 },
  { name: "Filip Domański", region: "EU Masters", rating: 82, discovery: "Gotowi do gry", cost: 75000 },
  { name: "Noah Jensen", region: "Nordics", rating: 77, discovery: "Młodzi shotcallerzy", cost: 68000 },
  { name: "Sofia Rossi", region: "ERL South", rating: 80, discovery: "Agresywni carry", cost: 72000 },
];
let selectedScoutSlot = 0;

function renderScouting() {
  const slots = scoutSlots.map((scout, index) => `<button class="staff-slot staff-profile ${selectedScoutSlot === index ? "staff-slot--active" : ""}" data-scout-slot="${index}"><i class="staff-avatar">${scout ? scout.name.split(" ").map((part) => part[0]).join("") : "+"}</i><div><span>Siatka skautingowa ${index + 1}</span><strong>${scout ? scout.name : "Wolny slot"}</strong><p>${scout ? `${scout.region} • OVR ${scout.rating}` : "Wybierz slot, a następnie zatrudnij scouta"}</p></div></button>`).join("");
  const options = scouts.map((scout, index) => `<article class="candidate-card candidate-card--detailed"><div class="candidate-heading"><i class="staff-avatar">${scout.name.split(" ").map((part) => part[0]).join("")}</i><div><span>${scout.region}</span><strong>${scout.name}</strong></div><b class="candidate-rating">${scout.rating}</b></div><p>Specjalizacja: ${scout.discovery}</p><div class="candidate-meta"><small>Zasięg: ${scout.region}</small><strong>${window.clubEconomy.format(scout.cost)}</strong></div><button class="upgrade-button" data-buy-scout="${index}" ${!window.clubEconomy.canAfford(scout.cost) ? "disabled" : ""}>Zatrudnij scouta</button></article>`).join("");
  return `<div class="management-board"><header class="management-header"><div><span>Sieć talentów</span><h3>Skauting regionalny</h3><p>Zatrudniaj specjalistów, którzy wyszukają zawodników pasujących do stylu zespołu.</p></div><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div></header><div class="staff-grid">${slots}</div><section><div class="section-heading"><span>Dostępni scoutci</span><h4>Obsada siatki ${selectedScoutSlot + 1}</h4></div><div class="candidate-grid candidate-grid--two">${options}</div></section></div>`;
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
