const tournaments = [
  { name: "Local Net Cup", type: "Amatorski", entryFee: 0, prize: 25000, startIn: 6 },
  { name: "City LAN Clash", type: "Regionalny", entryFee: 15000, prize: 60000, startIn: 14 },
  { name: "Rift Masters Open", type: "Semi-pro", entryFee: 45000, prize: 140000, startIn: 24 },
  { name: "EU Rising Cup", type: "Pro", entryFee: 90000, prize: 300000, startIn: 35 },
];
const tournamentTeams = ["Nasz zespół", "Pixel Rookies", "Kraków Minions", "Baltic Foxes", "Berlin Bots", "Warsaw Dragons", "Prague Golems", "Nordic Sparks"];
let activeTournamentIndex = null;
let tournamentRun = null;

function daysUntil(day) {
  const remaining = day - window.gameClock.day;
  return remaining <= 0 ? "Dzisiaj" : remaining === 1 ? "Jutro" : `Za ${remaining} dni`;
}

function startTournament(index) {
  const tournament = tournaments[index];
  activeTournamentIndex = index;
  tournamentRun = {
    round: 0,
    nextMatchDay: window.gameClock.day + tournament.startIn,
    opponent: tournamentTeams[1],
    eliminated: false,
    champion: false,
    results: tournamentTeams.map((name, seed) => ({ name, seed: seed + 1, status: seed < 2 ? "Ćwierćfinał" : "Oczekuje" })),
  };
}

function renderTournamentTable(tournament) {
  if (!tournament || !tournamentRun) return "";
  const rows = tournamentRun.results.map((team) => `<tr class="${team.name === "Nasz zespół" ? "tournament-us" : ""}"><td>${team.seed}</td><td><strong>${team.name}</strong></td><td>${team.status}</td></tr>`).join("");
  const finished = tournamentRun.eliminated || tournamentRun.champion;
  const headline = tournamentRun.champion
    ? "Wygraliśmy turniej!"
    : tournamentRun.eliminated
      ? "Odpadliśmy z turnieju"
      : `${daysUntil(tournamentRun.nextMatchDay)} kontra ${tournamentRun.opponent}`;
  return `<section class="competition-table"><div class="section-heading"><span>Aktywny turniej • ${tournamentTeams.length} drużyn</span><h4>${tournament.name}</h4></div><div class="tournament-next"><span>${finished ? "Wynik" : "Następny mecz"}</span><strong>${headline}</strong>${finished ? `<button class="upgrade-button" data-close-tournament>Zakończ turniej</button>` : `<small>Dzień ${tournamentRun.nextMatchDay} • BO1</small>`}</div>${window.matchCenter.render(tournament.name)}<table class="finance-table"><thead><tr><th>Seed</th><th>Drużyna</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

function renderTournaments() {
  const runFinished = tournamentRun?.eliminated || tournamentRun?.champion;
  const visibleTournaments = activeTournamentIndex === null || runFinished
    ? tournaments.map((tournament, index) => [tournament, index])
    : [[tournaments[activeTournamentIndex], activeTournamentIndex]];
  const cards = visibleTournaments.map(([tournament, index]) => {
    const isActive = activeTournamentIndex === index;
    const cannotJoin = activeTournamentIndex !== null || !window.clubEconomy.canAfford(tournament.entryFee);
    return `<article class="market-card ${isActive ? "market-card--active" : ""}"><span>${tournament.type}</span><strong>${tournament.name}</strong><p>Start za ${tournament.startIn} dni • Nagroda: ${window.clubEconomy.format(tournament.prize)}</p><small>Wpisowe: ${tournament.entryFee ? window.clubEconomy.format(tournament.entryFee) : "Darmowe"}</small>${isActive ? "" : `<button class="upgrade-button" data-join-tournament="${index}" ${cannotJoin ? "disabled" : ""}>${runFinished ? "Zakończ aktywny turniej" : "Dołącz"}</button>`}</article>`;
  }).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="market-grid ${activeTournamentIndex === null ? "market-grid--four" : ""}">${cards}</div>${renderTournamentTable(tournaments[activeTournamentIndex])}</div>`;
}

function setupTournaments(onChange) {
  document.querySelectorAll("[data-join-tournament]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.joinTournament);
    const tournament = tournaments[index];
    if (activeTournamentIndex === null && tournament && window.clubEconomy.spend(tournament.entryFee)) {
      startTournament(index);
      onChange();
    }
  }));
  document.querySelector("[data-close-tournament]")?.addEventListener("click", () => {
    activeTournamentIndex = null;
    tournamentRun = null;
    onChange();
  });
}

window.gameClock.subscribe((day) => {
  if (!tournamentRun || tournamentRun.eliminated || tournamentRun.champion || day < tournamentRun.nextMatchDay) return;
  const tournament = tournaments[activeTournamentIndex];
  const ourTeam = tournamentRun.results[0];
  const opponent = tournamentRun.results.find((team) => team.name === tournamentRun.opponent);
  const won = (day + activeTournamentIndex + tournamentRun.round) % 4 !== 0;
  window.matchCenter.simulate({ competition: tournament.name, opponent: opponent.name, won, day });
  if (!won) {
    tournamentRun.eliminated = true;
    ourTeam.status = `Odpadł (${tournamentRun.round + 1}. runda)`;
    opponent.status = "Awans";
  } else if (tournamentRun.round === 2) {
    tournamentRun.champion = true;
    ourTeam.status = "Mistrz";
    opponent.status = "2. miejsce";
    window.clubEconomy.budget += tournament.prize;
  } else {
    opponent.status = "Odpadł";
    tournamentRun.round += 1;
    ourTeam.status = tournamentRun.round === 1 ? "Półfinał" : "Finał";
    tournamentRun.opponent = tournamentTeams[tournamentRun.round + 1];
    tournamentRun.results[tournamentRun.round + 1].status = ourTeam.status;
    tournamentRun.nextMatchDay = day + 2;
  }
  window.addMail({
    id: `tournament-${day}`,
    from: "Organizator turnieju",
    subject: `${won ? "Wygrana" : "Porażka"}: ${tournament.name}`,
    date: `Dzień ${day} • 21:00`,
    body: won ? `Wygraliśmy mecz turniejowy z ${opponent.name}. ${tournamentRun.champion ? `Zdobywamy trofeum i ${window.clubEconomy.format(tournament.prize)} nagrody!` : `Następny mecz z ${tournamentRun.opponent} odbędzie się za 2 dni.`}` : `Przegraliśmy z ${opponent.name} i odpadamy z turnieju. Możesz zakończyć turniej i wybrać kolejne rozgrywki.`,
  });
});

window.renderTournaments = renderTournaments;
window.setupTournaments = setupTournaments;
