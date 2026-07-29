const leagues = [
  { name: "Puchar Polski / eventy offseason", tier: "Krajowa elita", entryFee: 10000, prize: 180000, region: "Polska", teamCount: 12, requiredWins: 10, strength: 82 },
  { name: "ARRMY League", tier: "Czołowa amatorska", entryFee: 6500, prize: 100000, region: "Polska", teamCount: 12, requiredWins: 6, strength: 75 },
  { name: "Grimorr League", tier: "Społecznościowa+", entryFee: 4000, prize: 60000, region: "Polska", teamCount: 10, requiredWins: 3, strength: 69 },
  { name: "MadLeague", tier: "Amatorska", entryFee: 2000, prize: 30000, region: "Polska", teamCount: 10, requiredWins: 1, strength: 63 },
  { name: "Małe ligi Discordowe", tier: "Debiutancka", entryFee: 0, prize: 12000, region: "Polska • ligi społecznościowe", teamCount: 16, requiredWins: 0, strength: 56 },
];
const leagueTeamNames = ["Nasz zespół", "Bronze Badgers", "Academy Owls", "Valley Drakes", "Dragon Forge", "Crimson Wolves", "Royal Krakens", "Iron Ravens", "Prague Golems", "Berlin Bots", "Nordic Sparks", "Baltic Foxes"];
let activeLeagueIndex = null;
let leagueSeason = null;
let leagueQualifier = null;

function createLeagueSeason(league) {
  const teams = Array.from({ length: league.teamCount }, (_, index) => leagueTeamNames[index] || `Discord Squad ${index + 1}`).map((name, index) => ({
    name,
    played: index % 3,
    wins: index % 3 === 2 ? 1 : 0,
    losses: index % 3 === 2 ? 1 : index % 3,
  }));
  teams[0] = { name: "Nasz zespół", played: 0, wins: 0, losses: 0 };
  return { teams, opponentIndex: 1, nextMatchDay: window.gameClock.day + 3, matches: [], finished: false };
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
  const nextMatchPanel = leagueSeason.finished ? `<div class="tournament-next"><span>Sezon zakończony</span><strong>Rozegrano wszystkie mecze</strong><button class="upgrade-button" data-close-league>Zakończ sezon</button></div>` : `<div class="tournament-next"><span>Następny mecz ligowy</span><strong>${matchDate} kontra ${opponent.name}</strong><small>Dzień ${leagueSeason.nextMatchDay} • BO1</small></div>`;
  return `<section class="competition-table"><div class="section-heading"><span>Aktywna liga • ${league.teamCount} drużyn</span><h4>${league.name}</h4></div>${nextMatchPanel}${window.matchCenter.render(league.name)}<h4 class="table-title">Tabela ligowa</h4><table class="finance-table league-standings"><thead><tr><th>#</th><th>Drużyna</th><th>M</th><th>W</th><th>P</th><th>PKT</th></tr></thead><tbody>${rows}</tbody></table><h4 class="table-title">Mecze naszego zespołu</h4><table class="finance-table"><thead><tr><th>Dzień</th><th>Rywal</th><th>Wynik</th><th>Rezultat</th></tr></thead><tbody>${matchRows}</tbody></table></section>`;
}

function renderLeagues() {
  if (activeLeagueIndex !== null && (!leagues[activeLeagueIndex] || !leagueSeason)) {
    activeLeagueIndex = null;
    leagueSeason = null;
  }
  if (leagueQualifier && !leagues[leagueQualifier.index]) leagueQualifier = null;
  const visibleLeagues = activeLeagueIndex === null || leagueSeason?.finished ? leagues.map((league, index) => [league, index]) : [[leagues[activeLeagueIndex], activeLeagueIndex]];
  const cards = visibleLeagues.map(([league, index]) => {
    const isActive = activeLeagueIndex === index;
    const wins = window.getCareerWins?.() || 0;
    const locked = wins < league.requiredWins;
    const qualifying = leagueQualifier?.index === index;
    const unavailable = activeLeagueIndex !== null || leagueQualifier !== null || locked || !window.clubEconomy.canAfford(league.entryFee);
    const label = isActive ? "Gramy" : qualifying ? `Eliminacje • dzień ${leagueQualifier.nextMatchDay}` : locked ? `Wymagane zwycięstwa: ${wins}/${league.requiredWins}` : "Zagraj eliminacje";
    return `<article class="market-card competition-card ${isActive ? "market-card--active" : ""} ${locked ? "competition-card--locked" : ""}"><div class="competition-card__top"><span>${league.tier}</span><b>${league.teamCount} drużyn</b></div><strong>${league.name}</strong><p>${league.region}</p><div class="competition-card__facts"><small>Nagroda<strong>${window.clubEconomy.format(league.prize)}</strong></small><small>Wpisowe eliminacyjne<strong>${league.entryFee ? window.clubEconomy.format(league.entryFee) : "Darmowe"}</strong></small></div><button class="upgrade-button" data-join-league="${index}" ${unavailable ? "disabled" : ""}>${label}</button></article>`;
  }).join("");
  const qualifierMatch = leagueQualifier ? window.matchCenter.render(`Eliminacje • ${leagues[leagueQualifier.index].name}`) : "";
  return `<div class="management-board" data-scroll-view="leagues"><header class="competition-picker-header"><div><span>Rozgrywki ligowe</span><h2>${activeLeagueIndex === null ? "Wywalcz miejsce w lidze" : "Sezon ligowy"}</h2><p>${activeLeagueIndex === null ? "Każda liga wymaga wygrania meczu eliminacyjnego. Na start dostępne są Małe ligi Discordowe; kolejne odblokujesz zwycięstwami." : "Śledź tabelę, terminarz i formę rywali."}</p></div><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div></header>${qualifierMatch}<div class="market-grid market-grid--four competition-picker">${cards}</div>${renderLeagueTable(leagues[activeLeagueIndex])}</div>`;
}

function startLeagueQualifier(day) {
  if (!leagueQualifier || window.matchCenter.activeMatch) return false;
  const qualifier = { ...leagueQualifier };
  const league = leagues[qualifier.index];
  if (!league) { leagueQualifier = null; return false; }
  window.matchCenter.start({
    competition: `Eliminacje • ${league.name}`,
    opponent: "Rywal kwalifikacyjny",
    opponentStrength: league.strength,
    day,
    section: "leagues",
    onComplete: (won) => {
      leagueQualifier = null;
      if (won) {
        activeLeagueIndex = qualifier.index;
        leagueSeason = createLeagueSeason(league);
      }
      window.addMail({ id: `qualifier-${day}`, from: league.name, subject: won ? "Awans do ligi" : "Nieudane eliminacje", date: `Dzień ${day} • 20:00`, body: won ? `Wygraliśmy eliminacje i otrzymaliśmy miejsce w ${league.name}.` : `Przegraliśmy eliminacje do ${league.name}. Możemy spróbować ponownie.` });
    },
  });
  return Boolean(window.matchCenter.activeMatch);
}

function setupLeagues(onChange) {
  document.querySelectorAll("[data-join-league]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.joinLeague);
    const league = leagues[index];
    const eligible = league && (window.getCareerWins?.() || 0) >= league.requiredWins;
    if (activeLeagueIndex === null && leagueQualifier === null && !window.matchCenter.activeMatch && eligible && window.clubEconomy.spend(league.entryFee)) {
      leagueQualifier = { index, nextMatchDay: window.gameClock.day };
      startLeagueQualifier(window.gameClock.day);
      onChange();
    }
  }));
  document.querySelector("[data-close-league]")?.addEventListener("click", () => { activeLeagueIndex = null; leagueSeason = null; onChange(); });
}

function resolveLeagueMatch(day, league, opponent, won) {
  const us = leagueSeason.teams[0];
  us.played += 1;
  opponent.played += 1;
  us[won ? "wins" : "losses"] += 1;
  opponent[won ? "losses" : "wins"] += 1;
  leagueSeason.matches.unshift({ day, opponent: opponent.name, score: won ? "1 : 0" : "0 : 1", result: won ? "Wygrana" : "Porażka" });
  if (leagueSeason.opponentIndex >= leagueSeason.teams.length - 1) leagueSeason.finished = true;
  else { leagueSeason.opponentIndex += 1; leagueSeason.nextMatchDay = day + 3; }
  window.addMail({
    id: `league-${day}`,
    from: league.name,
    subject: `${won ? "Wygrana" : "Porażka"} w lidze z ${opponent.name}`,
    date: `Dzień ${day} • 20:00`,
    body: `${won ? "Wygraliśmy" : "Przegraliśmy"} mecz ligowy ${won ? "1:0" : "0:1"} z ${opponent.name}. ${leagueSeason.finished ? "Sezon ligowy został zakończony." : `Tabela została zaktualizowana, a kolejne spotkanie odbędzie się w dniu ${leagueSeason.nextMatchDay}.`}`,
  });
}

window.gameClock.subscribe((day) => {
  if (leagueQualifier && day >= leagueQualifier.nextMatchDay && !window.matchCenter.activeMatch) {
    startLeagueQualifier(day);
    return;
  }
  if (!leagueSeason || leagueSeason.finished || day < leagueSeason.nextMatchDay || window.matchCenter.activeMatch) return;
  const league = leagues[activeLeagueIndex];
  const opponent = leagueSeason.teams[leagueSeason.opponentIndex];
  window.matchCenter.start({
    competition: league.name,
    opponent: opponent.name,
    opponentStrength: league.strength + (leagueSeason.opponentIndex % 5),
    day,
    section: "leagues",
    onComplete: (won) => resolveLeagueMatch(day, league, opponent, won),
  });
});

window.renderLeagues = renderLeagues;
window.setupLeagues = setupLeagues;
window.getLeagueNextMatch = () => {
  if (leagueQualifier) {
    const remaining = Math.max(0, leagueQualifier.nextMatchDay - window.gameClock.day);
    return { value: `Eliminacje: ${leagues[leagueQualifier.index].name}`, note: remaining === 0 ? "Dzisiaj" : remaining === 1 ? "Jutro" : `Za ${remaining} dni` };
  }
  if (!leagueSeason || leagueSeason.finished) return null;
  const opponent = leagueSeason.teams[leagueSeason.opponentIndex];
  const remaining = Math.max(0, leagueSeason.nextMatchDay - window.gameClock.day);
  return { value: `vs ${opponent.name}`, note: `${remaining === 0 ? "Dzisiaj" : remaining === 1 ? "Jutro" : `Za ${remaining} dni`} • ${leagues[activeLeagueIndex].name}` };
};
window.gameState.register("leagues", {
  get: () => ({ activeLeagueIndex, leagueSeason, leagueQualifier }),
  set: (state) => {
    const savedIndex = Number(state.activeLeagueIndex);
    activeLeagueIndex = Number.isInteger(savedIndex) && leagues[savedIndex] && state.leagueSeason ? savedIndex : null;
    leagueSeason = activeLeagueIndex === null ? null : state.leagueSeason;
    const qualifierIndex = Number(state.leagueQualifier?.index);
    leagueQualifier = Number.isInteger(qualifierIndex) && leagues[qualifierIndex] ? { ...state.leagueQualifier, index: qualifierIndex } : null;
  },
});
