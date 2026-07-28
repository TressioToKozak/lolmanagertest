const staffSlots = { coach: null, analyst: null, psychologist: null };
const staffLabels = { coach: "Trener", analyst: "Analityk", psychologist: "Psycholog" };
const candidates = {
  coach: [
    { name: "Marta Kowalska", specialty: "Draft i makro", cost: 120000 },
    { name: "Rafał Nowicki", specialty: "Agresywny early game", cost: 90000 },
  ],
  analyst: [
    { name: "Oskar Lewandowski", specialty: "VOD review", cost: 70000 },
    { name: "Nina Kamińska", specialty: "Dane i matchup", cost: 85000 },
  ],
  psychologist: [
    { name: "Ewa Mazur", specialty: "Mental reset", cost: 60000 },
    { name: "Igor Malec", specialty: "Praca pod presją", cost: 75000 },
  ],
};
let selectedSlot = "coach";

function renderStaffSlot(slotId) {
  const hired = staffSlots[slotId];
  return `<button class="staff-slot ${selectedSlot === slotId ? "staff-slot--active" : ""}" data-staff-slot="${slotId}"><span>${staffLabels[slotId]}</span><strong>${hired ? hired.name : "Puste miejsce"}</strong><p>${hired ? hired.specialty : "Kliknij, żeby wybrać kandydata"}</p></button>`;
}

function renderCandidates() {
  return candidates[selectedSlot]
    .map((candidate, index) => `<article class="candidate-card"><div><span>${staffLabels[selectedSlot]}</span><strong>${candidate.name}</strong><p>${candidate.specialty}</p><small>Koszt zatrudnienia ${window.clubEconomy.format(candidate.cost)}</small></div><button class="upgrade-button" data-hire-staff="${index}" ${!window.clubEconomy.canAfford(candidate.cost) ? "disabled" : ""}>Zatrudnij</button></article>`)
    .join("");
}

function renderStaff() {
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="staff-grid">${Object.keys(staffSlots).map(renderStaffSlot).join("")}</div><section><div class="section-heading"><span>Kandydaci</span><h4>${staffLabels[selectedSlot]}</h4></div><div class="candidate-grid">${renderCandidates()}</div></section></div>`;
}

function setupStaff(onChange) {
  document.querySelectorAll("[data-staff-slot]").forEach((button) => button.addEventListener("click", () => { selectedSlot = button.dataset.staffSlot; onChange(); }));
  document.querySelectorAll("[data-hire-staff]").forEach((button) => button.addEventListener("click", () => {
    const candidate = candidates[selectedSlot][Number(button.dataset.hireStaff)];
    if (candidate && window.clubEconomy.spend(candidate.cost)) {
      staffSlots[selectedSlot] = candidate;
      onChange();
    }
  }));
}

window.renderStaff = renderStaff;
window.setupStaff = setupStaff;
