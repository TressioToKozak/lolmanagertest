const leagues = [
  { name: "Bronze Circuit", tier: "Startowa", entryFee: 0, prize: 35000, region: "Polska", teamCount: 8 },
  { name: "Regional Academy League", tier: "Regionalna", entryFee: 20000, prize: 80000, region: "Europa Centralna", teamCount: 10 },
  { name: "Challenger Path", tier: "Semi-pro", entryFee: 60000, prize: 180000, region: "Europa", teamCount: 12 },
  { name: "Elite Championship", tier: "Pro", entryFee: 150000, prize: 500000, region: "Europa", teamCount: 10 },
];
const leagueTeamNames = ["Nasz zespół", "Bronze Badgers", "Academy Owls", "Valley Drakes", "Dragon Forge", "Crimson Wolves", "Royal Krakens", "Iron Ravens", "Prague Golems", "Berlin Bots", "Nordic Sparks", "Baltic Foxes"];
let activeLeagueIndex = null;
let leagueSeason = null;

function createLeagueSeason(league) {
  const teams = leagueTeamNames.slice(0, league.teamCount).map((name, index) => ({
    name,
    played: index % 3,
    wins: index % 3 === 2 ? 1 : 0,
    losses: index % 3 === 2 ? 1 : index % 3,
  }));
  teams[0] = { name: "Nasz zespół", played: 0, wins: 0, losses: 0 };
  return { teams, opponentIndex: 1, nextMatchDay: window.gameClock.day + 3, matches: [] };
}

function getLeagueStandings() {
  return [...leagueSeason.teams].sort((first, second) =>
    (second.wins * 3 - first.wins * 3)
    || (first.losses - second.losses)
    || first.name.localeCompare(second.name, "pl")
  );
}

function renderLeagueTable(league) {
  if (!league || !leagueSeason) return "";
  const opponent = leagueSeason.teams[leagueSeason.opponentIndex];
  const remaining = leagueSeason.nextMatchDay - window.gameClock.day;
  const matchDate = remaining <= 0 ? "Dzisiaj" : remaining === 1 ? "Jutro" : `Za ${remaining} dni`;
  const rows = getLeagueStandings().map((team, index) => `<tr class="${team.name === "Nasz zespół" ? "tournament-us" : ""}"><td>${index + 1}</td><td><strong>${team.name}</strong></td><td>${team.played}</td><td>${team.wins}</td><td>${team.losses}</td><td>${team.wins * 3}</td></tr>`).join("");
  const matchRows = leagueSeason.matches.length
    ? leagueSeason.matches.map((match) => `<tr><td>Dzień ${match.day}</td><td>${match.opponent}</td><td><strong>${match.score}</strong></td><td>${match.result}</td></tr>`).join("")
    : '<tr><td colspan="4">Pierwszy mecz jeszcze się nie odbył.</td></tr>';
  return `<section class="competition-table"><div class="section-heading"><span>Aktywna liga • ${league.teamCount} drużyn</span><h4>${league.name}</h4></div><div class="tournament-next"><span>Następny mecz ligowy</span><strong>${matchDate} kontra ${opponent.name}</strong><small>Dzień ${leagueSeason.nextMatchDay} • BO1</small></div>${window.matchCenter.render(league.name)}<h4 class="table-title">Tabela ligowa</h4><table class="finance-table league-standings"><thead><tr><th>#</th><th>Drużyna</th><th>M</th><th>W</th><th>P</th><th>PKT</th></tr></thead><tbody>${rows}</tbody></table><h4 class="table-title">Mecze naszego zespołu</h4><table class="finance-table"><thead><tr><th>Dzień</th><th>Rywal</th><th>Wynik</th><th>Rezultat</th></tr></thead><tbody>${matchRows}</tbody></table></section>`;
}

function renderLeagues() {
  const cards = leagues.map((league, index) => {
    const isActive = activeLeagueIndex === index;
    const unavailable = activeLeagueIndex !== null || !window.clubEconomy.canAfford(league.entryFee);
    return `<article class="market-card ${isActive ? "market-card--active" : ""}"><span>${league.tier}</span><strong>${league.name}</strong><p>${league.region} • ${league.teamCount} drużyn</p><small>Wpisowe: ${league.entryFee ? window.clubEconomy.format(league.entryFee) : "Darmowe"}</small><button class="upgrade-button" data-join-league="${index}" ${unavailable ? "disabled" : ""}>${isActive ? "Gramy" : "Dołącz"}</button></article>`;
  }).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="market-grid market-grid--four">${cards}</div>${renderLeagueTable(leagues[activeLeagueIndex])}</div>`;
}

function setupLeagues(onChange) {
  document.querySelectorAll("[data-join-league]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.joinLeague);
    const league = leagues[index];
    if (activeLeagueIndex === null && league && window.clubEconomy.spend(league.entryFee)) {
      activeLeagueIndex = index;
      leagueSeason = createLeagueSeason(league);
      onChange();
    }
  }));
}

function resolveLeagueMatch(day, league, opponent, won) {
  const us = leagueSeason.teams[0];
  us.played += 1;
  opponent.played += 1;
  us[won ? "wins" : "losses"] += 1;
  opponent[won ? "losses" : "wins"] += 1;
  leagueSeason.matches.unshift({ day, opponent: opponent.name, score: won ? "1 : 0" : "0 : 1", result: won ? "Wygrana" : "Porażka" });
  leagueSeason.opponentIndex = leagueSeason.opponentIndex >= leagueSeason.teams.length - 1 ? 1 : leagueSeason.opponentIndex + 1;
  leagueSeason.nextMatchDay = day + 3;
  window.addMail({
    id: `league-${day}`,
    from: league.name,
    subject: `${won ? "Wygrana" : "Porażka"} w lidze z ${opponent.name}`,
    date: `Dzień ${day} • 20:00`,
    body: `${won ? "Wygraliśmy" : "Przegraliśmy"} mecz ligowy ${won ? "1:0" : "0:1"} z ${opponent.name}. Tabela została zaktualizowana, a kolejne spotkanie odbędzie się w dniu ${leagueSeason.nextMatchDay}.`,
  });
}

window.gameClock.subscribe((day) => {
  if (!leagueSeason || day < leagueSeason.nextMatchDay || window.matchCenter.activeMatch) return;
  const league = leagues[activeLeagueIndex];
  const opponent = leagueSeason.teams[leagueSeason.opponentIndex];
  window.matchCenter.start({
    competition: league.name,
    opponent: opponent.name,
    day,
    section: "leagues",
    onComplete: (won) => resolveLeagueMatch(day, league, opponent, won),
  });
});

window.renderLeagues = renderLeagues;
window.setupLeagues = setupLeagues;
