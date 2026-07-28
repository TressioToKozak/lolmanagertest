const tournaments = [
  { name: "Rift Masters", type: "Cup", entryFee: 80000, prize: "€250k", date: "Za 18 dni" },
  { name: "EU Invitational", type: "Qualifier", entryFee: 50000, prize: "Slot międzynarodowy", date: "Za 25 dni" },
  { name: "Baltic Clash", type: "Showmatch", entryFee: 20000, prize: "€60k", date: "Za 9 dni" },
];
const joinedTournaments = new Set();

function renderTournaments() {
  const rows = tournaments.map((tournament, index) => `<article class="market-card"><span>${tournament.type}</span><strong>${tournament.name}</strong><p>${tournament.date} • Nagroda: ${tournament.prize}</p><small>Wpisowe: ${window.clubEconomy.format(tournament.entryFee)}</small><button class="upgrade-button" data-join-tournament="${index}" ${joinedTournaments.has(index) || !window.clubEconomy.canAfford(tournament.entryFee) ? "disabled" : ""}>${joinedTournaments.has(index) ? "Dołączono" : "Dołącz"}</button></article>`).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="market-grid market-grid--three">${rows}</div></div>`;
}

function setupTournaments(onChange) {
  document.querySelectorAll("[data-join-tournament]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.joinTournament);
    const tournament = tournaments[index];
    if (tournament && window.clubEconomy.spend(tournament.entryFee)) {
      joinedTournaments.add(index);
      onChange();
    }
  }));
}

window.renderTournaments = renderTournaments;
window.setupTournaments = setupTournaments;
