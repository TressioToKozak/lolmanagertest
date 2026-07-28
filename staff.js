const staffSlots = { coach: null, analyst: null, psychologist: null };
const staffLabels = { coach: "Trener", analyst: "Analityk", psychologist: "Psycholog" };
const candidates = {
  coach: [
    { name: "Marta Kowalska", specialty: "Draft i makro", rating: 86, experience: "5 sezonów", cost: 120000 },
    { name: "Rafał Nowicki", specialty: "Agresywny early game", rating: 79, experience: "3 sezony", cost: 90000 },
  ],
  analyst: [
    { name: "Oskar Lewandowski", specialty: "VOD review", rating: 78, experience: "4 sezony", cost: 70000 },
    { name: "Nina Kamińska", specialty: "Dane i matchup", rating: 83, experience: "3 sezony", cost: 85000 },
  ],
  psychologist: [
    { name: "Ewa Mazur", specialty: "Mental reset", rating: 80, experience: "6 sezonów", cost: 60000 },
    { name: "Igor Malec", specialty: "Praca pod presją", rating: 82, experience: "4 sezony", cost: 75000 },
  ],
};
let selectedSlot = "coach";

function renderStaffSlot(slotId) {
  const hired = staffSlots[slotId];
  return `<button class="staff-slot staff-profile ${selectedSlot === slotId ? "staff-slot--active" : ""}" data-staff-slot="${slotId}"><i class="staff-avatar">${hired ? hired.name.split(" ").map((part) => part[0]).join("") : "+"}</i><div><span>${staffLabels[slotId]}</span><strong>${hired ? hired.name : "Puste stanowisko"}</strong><p>${hired ? `${hired.specialty} • OVR ${hired.rating}` : "Wybierz stanowisko i zatrudnij specjalistę"}</p></div></button>`;
}

function renderCandidates() {
  return candidates[selectedSlot]
    .map((candidate, index) => `<article class="candidate-card candidate-card--detailed"><div class="candidate-heading"><i class="staff-avatar">${candidate.name.split(" ").map((part) => part[0]).join("")}</i><div><span>${staffLabels[selectedSlot]}</span><strong>${candidate.name}</strong></div><b class="candidate-rating">${candidate.rating}</b></div><p>${candidate.specialty}</p><div class="candidate-meta"><small>Doświadczenie: ${candidate.experience}</small><strong>${window.clubEconomy.format(candidate.cost)}</strong></div><button class="upgrade-button" data-hire-staff="${index}" ${!window.clubEconomy.canAfford(candidate.cost) ? "disabled" : ""}>Zatrudnij</button></article>`)
    .join("");
}

function renderStaff() {
  return `<div class="management-board"><header class="management-header"><div><span>Sztab szkoleniowy</span><h3>Zbuduj zaplecze zespołu</h3><p>Lepszy sztab wspiera przygotowanie, analizę rywali i formę mentalną.</p></div><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div></header><div class="staff-grid">${Object.keys(staffSlots).map(renderStaffSlot).join("")}</div><section><div class="section-heading"><span>Dostępni kandydaci</span><h4>${staffLabels[selectedSlot]}</h4></div><div class="candidate-grid candidate-grid--two">${renderCandidates()}</div></section></div>`;
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
