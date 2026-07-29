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

function createRoundRobinRounds(teamNames) {
  const rotation = [...teamNames];
  const rounds = [];
  for (let round = 0; round < rotation.length - 1; round += 1) {
    const pairs = [];
    for (let index = 0; index < rotation.length / 2; index += 1) pairs.push([rotation[index], rotation[rotation.length - 1 - index]]);
    rounds.push(pairs);
    rotation.splice(1, 0, rotation.pop());
  }
  return rounds;
}

function createLeagueSeason(league) {
  const teams = Array.from({ length: 8 }, (_, index) => leagueTeamNames[index]).map((name) => ({
    name,
    played: 0,
    wins: 0,
    losses: 0,
  }));
  teams[0] = { name: "Nasz zespół", played: 0, wins: 0, losses: 0 };
  return { teams, opponentIndex: 0, rounds: createRoundRobinRounds(teams.map((team) => team.name)), nextMatchDay: window.gameClock.day + 3, matches: [], stage: "regular", playoffTeams: [], currentOpponentName: null, finished: false, eliminated: false, champion: false };
}

function getLeagueStandings() {
  return [...leagueSeason.teams].sort((first, second) =>
    (second.wins * 3 - first.wins * 3)
    || (first.losses - second.losses)
    || first.name.localeCompare(second.name, "pl")
  );
}

function getLeagueOpponent() {
  if (!leagueSeason) return null;
  if (leagueSeason.stage === "regular") {
    const ourPair = leagueSeason.rounds?.[leagueSeason.opponentIndex]?.find((pair) => pair.includes("Nasz zespół"));
    const opponentName = ourPair?.find((name) => name !== "Nasz zespół");
    return leagueSeason.teams.find((team) => team.name === opponentName) || null;
  }
  return leagueSeason.teams.find((team) => team.name === leagueSeason.currentOpponentName) || null;
}

function simulateRestOfRound(day) {
  const pairs = leagueSeason.rounds[leagueSeason.opponentIndex].filter((pair) => !pair.includes("Nasz zespół"));
  pairs.forEach(([firstName, secondName]) => {
    const first = leagueSeason.teams.find((team) => team.name === firstName);
    const second = leagueSeason.teams.find((team) => team.name === secondName);
    const firstWon = window.matchCenter.seed(`${day}-${first.name}-${second.name}-${leagueSeason.opponentIndex}`) % 2 === 0;
    first.played += 1; second.played += 1;
    first[firstWon ? "wins" : "losses"] += 1;
    second[firstWon ? "losses" : "wins"] += 1;
  });
}

function renderLeagueTable(league) {
  if (!league || !leagueSeason) return "";
  const opponent = getLeagueOpponent();
  const remaining = leagueSeason.nextMatchDay - window.gameClock.day;
  const matchDate = remaining <= 0 ? "Dzisiaj" : remaining === 1 ? "Jutro" : `Za ${remaining} dni`;
  const rows = getLeagueStandings().map((team, index) => `<tr class="${team.name === "Nasz zespół" ? "tournament-us" : ""}"><td>${index + 1}</td><td><strong>${team.name}</strong></td><td>${team.played}</td><td>${team.wins}</td><td>${team.losses}</td><td>${team.wins * 3}</td></tr>`).join("");
  const matchRows = leagueSeason.matches.length
    ? leagueSeason.matches.map((match) => `<tr><td>Dzień ${match.day}</td><td>${match.opponent}</td><td><strong>${match.score}</strong></td><td>${match.result}</td></tr>`).join("")
    : '<tr><td colspan="4">Pierwszy mecz jeszcze się nie odbył.</td></tr>';
  const stageLabel = { regular: "Faza każdy z każdym", semifinal: "Półfinał", final: "Finał", finished: "Sezon zakończony" }[leagueSeason.stage] || "Faza ligowa";
  const finishedText = leagueSeason.champion ? "Mistrzostwo ligi!" : leagueSeason.eliminated ? "Odpadamy z rozgrywek" : "Sezon zakończony";
  const nextMatchPanel = leagueSeason.finished ? `<div class="tournament-next"><span>${stageLabel}</span><strong>${finishedText}</strong><button class="upgrade-button" data-close-league>Zakończ sezon</button></div>` : `<div class="tournament-next"><span>${stageLabel}</span><strong>${matchDate} kontra ${opponent.name}</strong><small>Dzień ${leagueSeason.nextMatchDay} • BO1</small></div>`;
  const playoff = leagueSeason.playoffTeams.length ? `<div class="league-playoffs"><strong>Play-offy • TOP 4</strong>${leagueSeason.playoffTeams.map((name, index) => `<span>${index + 1}. ${name}</span>`).join("")}</div>` : "";
  return `<section class="competition-table"><div class="section-heading"><span>Aktywna liga • 8 drużyn</span><h4>${league.name}</h4></div>${nextMatchPanel}${window.matchCenter.render(league.name)}${playoff}<h4 class="table-title">Tabela ligowa</h4><table class="finance-table league-standings"><thead><tr><th>#</th><th>Drużyna</th><th>M</th><th>W</th><th>P</th><th>PKT</th></tr></thead><tbody>${rows}</tbody></table><h4 class="table-title">Mecze naszego zespołu</h4><table class="finance-table"><thead><tr><th>Dzień</th><th>Rywal</th><th>Wynik</th><th>Rezultat</th></tr></thead><tbody>${matchRows}</tbody></table></section>`;
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
    return `<article class="market-card competition-card ${isActive ? "market-card--active" : ""} ${locked ? "competition-card--locked" : ""}"><div class="competition-card__top"><span>${league.tier}</span><b>${league.teamCount} zgłoszeń</b></div><strong>${league.name}</strong><p>${league.region} • liga 8 drużyn • TOP 4 awansuje</p><div class="competition-card__facts"><small>Nagroda<strong>${window.clubEconomy.format(league.prize)}</strong></small><small>Wpisowe eliminacyjne<strong>${league.entryFee ? window.clubEconomy.format(league.entryFee) : "Darmowe"}</strong></small></div><button class="upgrade-button" data-join-league="${index}" ${unavailable ? "disabled" : ""}>${label}</button></article>`;
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
  const playedStage = leagueSeason.stage;
  const us = leagueSeason.teams[0];
  us.played += 1;
  opponent.played += 1;
  us[won ? "wins" : "losses"] += 1;
  opponent[won ? "losses" : "wins"] += 1;
  leagueSeason.matches.unshift({ day, opponent: opponent.name, score: won ? "1 : 0" : "0 : 1", result: won ? "Wygrana" : "Porażka" });
  if (leagueSeason.stage === "regular") {
    simulateRestOfRound(day);
    if (leagueSeason.opponentIndex < leagueSeason.rounds.length - 1) {
      leagueSeason.opponentIndex += 1;
      leagueSeason.nextMatchDay = day + 3;
    } else {
      const topFour = getLeagueStandings().slice(0, 4);
      leagueSeason.playoffTeams = topFour.map((team) => team.name);
      const ourSeed = topFour.findIndex((team) => team.name === "Nasz zespół");
      if (ourSeed < 0) {
        leagueSeason.finished = true;
        leagueSeason.eliminated = true;
        leagueSeason.stage = "finished";
      } else {
        const opponentSeed = ourSeed === 0 ? 3 : ourSeed === 3 ? 0 : ourSeed === 1 ? 2 : 1;
        leagueSeason.stage = "semifinal";
        leagueSeason.currentOpponentName = topFour[opponentSeed].name;
        leagueSeason.nextMatchDay = day + 2;
      }
    }
  } else if (leagueSeason.stage === "semifinal") {
    if (!won) {
      leagueSeason.finished = true;
      leagueSeason.eliminated = true;
      leagueSeason.stage = "finished";
    } else {
      leagueSeason.stage = "final";
      leagueSeason.currentOpponentName = leagueSeason.playoffTeams.find((name) => name !== "Nasz zespół" && name !== opponent.name) || leagueSeason.playoffTeams[0];
      leagueSeason.nextMatchDay = day + 2;
    }
  } else if (leagueSeason.stage === "final") {
    leagueSeason.finished = true;
    leagueSeason.champion = won;
    leagueSeason.eliminated = !won;
    leagueSeason.stage = "finished";
    if (won) window.clubEconomy.budget += league.prize;
  }
  window.addMail({
    id: `league-${day}`,
    from: league.name,
    subject: `${won ? "Wygrana" : "Porażka"} w lidze z ${opponent.name}`,
    date: `Dzień ${day} • 20:00`,
    body: `${won ? "Wygraliśmy" : "Przegraliśmy"} mecz ${playedStage === "regular" ? "ligowy" : "play-off"} ${won ? "1:0" : "0:1"} z ${opponent.name}. ${leagueSeason.champion ? `Zdobywamy mistrzostwo i ${window.clubEconomy.format(league.prize)}!` : leagueSeason.finished ? "Nasze rozgrywki zostały zakończone." : `Kolejny mecz odbędzie się w dniu ${leagueSeason.nextMatchDay}.`}`,
  });
}

window.gameClock.subscribe((day) => {
  if (leagueQualifier && day >= leagueQualifier.nextMatchDay && !window.matchCenter.activeMatch) {
    startLeagueQualifier(day);
    return;
  }
  if (!leagueSeason || leagueSeason.finished || day < leagueSeason.nextMatchDay || window.matchCenter.activeMatch) return;
  const league = leagues[activeLeagueIndex];
  const opponent = getLeagueOpponent();
  if (!opponent) { leagueSeason.finished = true; leagueSeason.stage = "finished"; return; }
  window.matchCenter.start({
    competition: league.name,
    opponent: opponent.name,
    opponentStrength: league.strength + (leagueSeason.stage === "regular" ? leagueSeason.opponentIndex % 5 : leagueSeason.stage === "semifinal" ? 5 : 8),
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
  const opponent = getLeagueOpponent();
  if (!opponent) return null;
  const remaining = Math.max(0, leagueSeason.nextMatchDay - window.gameClock.day);
  return { value: `vs ${opponent.name}`, note: `${remaining === 0 ? "Dzisiaj" : remaining === 1 ? "Jutro" : `Za ${remaining} dni`} • ${leagues[activeLeagueIndex].name}` };
};
window.gameState.register("leagues", {
  get: () => ({ activeLeagueIndex, leagueSeason, leagueQualifier }),
  set: (state) => {
    const savedIndex = Number(state.activeLeagueIndex);
    activeLeagueIndex = Number.isInteger(savedIndex) && leagues[savedIndex] && state.leagueSeason ? savedIndex : null;
    leagueSeason = activeLeagueIndex === null ? null : state.leagueSeason;
    if (leagueSeason) {
      leagueSeason.stage = leagueSeason.stage || "regular";
      leagueSeason.rounds = Array.isArray(leagueSeason.rounds) ? leagueSeason.rounds : createRoundRobinRounds(leagueSeason.teams.map((team) => team.name));
      leagueSeason.opponentIndex = Math.max(0, Math.min(Number(leagueSeason.opponentIndex) || 0, leagueSeason.rounds.length - 1));
      leagueSeason.playoffTeams = Array.isArray(leagueSeason.playoffTeams) ? leagueSeason.playoffTeams : [];
      leagueSeason.currentOpponentName = leagueSeason.currentOpponentName || null;
      leagueSeason.eliminated = Boolean(leagueSeason.eliminated);
      leagueSeason.champion = Boolean(leagueSeason.champion);
    }
    const qualifierIndex = Number(state.leagueQualifier?.index);
    leagueQualifier = Number.isInteger(qualifierIndex) && leagues[qualifierIndex] ? { ...state.leagueQualifier, index: qualifierIndex } : null;
  },
});
