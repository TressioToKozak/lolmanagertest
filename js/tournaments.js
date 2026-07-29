const tournaments = [
  { name: "Go4LoL 🥇", type: "Elitarny", entryFee: 15000, prize: 250000, startIn: 18, requiredWins: 12, strength: 88 },
  { name: "Challengermode", type: "Profesjonalny", entryFee: 10000, prize: 150000, startIn: 14, requiredWins: 8, strength: 81 },
  { name: "Żabka Cup / Legends Academy", type: "Akademicki", entryFee: 7500, prize: 90000, startIn: 12, requiredWins: 5, strength: 75 },
  { name: "ARRMY.GG", type: "Semi-pro", entryFee: 5000, prize: 60000, startIn: 10, requiredWins: 3, strength: 70 },
  { name: "FACEIT", type: "Otwarty", entryFee: 2500, prize: 35000, startIn: 8, requiredWins: 1, strength: 65 },
  { name: "Battlefy", type: "Community", entryFee: 1000, prize: 18000, startIn: 6, requiredWins: 0, strength: 60 },
  { name: "Toornament", type: "Debiutancki", entryFee: 0, prize: 10000, startIn: 4, requiredWins: 0, strength: 56 },
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
    const wins = window.getCareerWins?.() || 0;
    const locked = wins < tournament.requiredWins;
    const cannotJoin = activeTournamentIndex !== null || locked || !window.clubEconomy.canAfford(tournament.entryFee);
    const buttonLabel = locked ? `Wymagane zwycięstwa: ${wins}/${tournament.requiredWins}` : runFinished ? "Zakończ aktywny turniej" : "Dołącz do turnieju";
    return `<article class="market-card competition-card ${isActive ? "market-card--active" : ""} ${locked ? "competition-card--locked" : ""}"><div class="competition-card__top"><span>${tournament.type}</span><b>Start za ${tournament.startIn} dni</b></div><strong>${tournament.name}</strong><p>Drabinka pucharowa • BO1 • 8 drużyn</p><div class="competition-card__facts"><small>Nagroda<strong>${window.clubEconomy.format(tournament.prize)}</strong></small><small>Wpisowe<strong>${tournament.entryFee ? window.clubEconomy.format(tournament.entryFee) : "Darmowe"}</strong></small></div>${isActive ? "" : `<button class="upgrade-button" data-join-tournament="${index}" ${cannotJoin ? "disabled" : ""}>${buttonLabel}</button>`}</article>`;
  }).join("");
  return `<div class="management-board"><header class="competition-picker-header"><div><span>Turnieje pucharowe</span><h2>${activeTournamentIndex === null ? "Wybierz następne wyzwanie" : "Aktywny turniej"}</h2><p>${activeTournamentIndex === null ? "Sprawdź termin, poziom i ryzyko finansowe przed zgłoszeniem drużyny." : "Pozostałe turnieje wrócą po zakończeniu obecnej drabinki."}</p></div><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div></header><div class="market-grid ${activeTournamentIndex === null ? "market-grid--four" : ""} competition-picker">${cards}</div>${renderTournamentTable(tournaments[activeTournamentIndex])}</div>`;
}

function setupTournaments(onChange) {
  document.querySelectorAll("[data-join-tournament]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.joinTournament);
    const tournament = tournaments[index];
    if (activeTournamentIndex === null && tournament && window.clubEconomy.spend(tournament.entryFee)) {
      startTournament(index);
      window.progressQuest?.("join-tournament");
      onChange();
    }
  }));
  document.querySelector("[data-close-tournament]")?.addEventListener("click", () => {
    activeTournamentIndex = null;
    tournamentRun = null;
    onChange();
  });
}

function resolveTournamentMatch(day, tournament, opponent, won) {
  const ourTeam = tournamentRun.results[0];
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
}

window.gameClock.subscribe((day) => {
  if (!tournamentRun || tournamentRun.eliminated || tournamentRun.champion || day < tournamentRun.nextMatchDay || window.matchCenter.activeMatch) return;
  const tournament = tournaments[activeTournamentIndex];
  const opponent = tournamentRun.results.find((team) => team.name === tournamentRun.opponent);
  window.matchCenter.start({
    competition: tournament.name,
    opponent: opponent.name,
    opponentStrength: tournament.strength + tournamentRun.round * 2,
    day,
    section: "tournaments",
    onComplete: (won) => resolveTournamentMatch(day, tournament, opponent, won),
  });
});

window.renderTournaments = renderTournaments;
window.setupTournaments = setupTournaments;
window.getTournamentNextMatch = () => {
  if (!tournamentRun || tournamentRun.eliminated || tournamentRun.champion) return null;
  const remaining = Math.max(0, tournamentRun.nextMatchDay - window.gameClock.day);
  return { value: `vs ${tournamentRun.opponent}`, note: `${remaining === 0 ? "Dzisiaj" : remaining === 1 ? "Jutro" : `Za ${remaining} dni`} • ${tournaments[activeTournamentIndex].name}` };
};
window.gameState.register("tournaments", {
  get: () => ({ activeTournamentIndex, tournamentRun }),
  set: (state) => { activeTournamentIndex = state.activeTournamentIndex ?? null; tournamentRun = state.tournamentRun || null; },
});
