const tournaments = [
  { name: "Local Net Cup", type: "Amatorski", entryFee: 0, prize: 25000, date: "Za 6 dni", opponent: "Pixel Rookies", matchTime: "Sobota 18:00" },
  { name: "City LAN Clash", type: "Regionalny", entryFee: 15000, prize: 60000, date: "Za 14 dni", opponent: "Kraków Minions", matchTime: "Środa 20:00" },
  { name: "Rift Masters Open", type: "Semi-pro", entryFee: 45000, prize: 140000, date: "Za 24 dni", opponent: "Baltic Foxes", matchTime: "Piątek 19:00" },
  { name: "EU Rising Cup", type: "Pro", entryFee: 90000, prize: 300000, date: "Za 35 dni", opponent: "Berlin Bots", matchTime: "Niedziela 17:00" },
];
let activeTournamentIndex = null;

function renderTournamentTable(tournament) {
  if (!tournament) return "";
  return `<section class="competition-table"><div class="section-heading"><span>Wybrany turniej</span><h4>${tournament.name}</h4></div><table class="finance-table"><thead><tr><th>Następny mecz</th><th>Rywal</th><th>Godzina</th><th>Nagroda</th></tr></thead><tbody><tr><td>${tournament.date}</td><td>${tournament.opponent}</td><td>${tournament.matchTime}</td><td>${window.clubEconomy.format(tournament.prize)}</td></tr></tbody></table></section>`;
}

function renderTournaments() {
  const rows = tournaments.map((tournament, index) => {
    const isActive = activeTournamentIndex === index;
    const hasActive = activeTournamentIndex !== null;
    return `<article class="market-card ${isActive ? "market-card--active" : ""}"><span>${tournament.type}</span><strong>${tournament.name}</strong><p>${tournament.date} • Nagroda: ${window.clubEconomy.format(tournament.prize)}</p><small>Wpisowe: ${tournament.entryFee ? window.clubEconomy.format(tournament.entryFee) : "Darmowe"}</small><button class="upgrade-button" data-join-tournament="${index}" ${isActive || (hasActive && !isActive) || !window.clubEconomy.canAfford(tournament.entryFee) ? "disabled" : ""}>${isActive ? "Wybrany" : "Dołącz"}</button></article>`;
  }).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="market-grid market-grid--four">${rows}</div>${renderTournamentTable(tournaments[activeTournamentIndex])}</div>`;
}

function setupTournaments(onChange) {
  document.querySelectorAll("[data-join-tournament]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.joinTournament);
    const tournament = tournaments[index];
    if (activeTournamentIndex === null && tournament && window.clubEconomy.spend(tournament.entryFee)) {
      activeTournamentIndex = index;
      onChange();
    }
  }));
}

window.renderTournaments = renderTournaments;
window.setupTournaments = setupTournaments;
