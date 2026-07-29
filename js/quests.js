const onboardingQuests = [
  { id: "join-tournament", title: "Dołącz do turnieju", description: "Wybierz pierwsze rozgrywki w zakładce Tournaments.", target: 1, reward: 1500 },
  { id: "hire-staff", title: "Zatrudnij członka sztabu", description: "Wzmocnij zespół trenerem, analitykiem lub psychologiem.", target: 1, reward: 1000 },
  { id: "play-match", title: "Rozegraj pierwszy mecz", description: "Podejmij wszystkie decyzje taktyczne podczas spotkania.", target: 1, reward: 2000 },
  { id: "win-match", title: "Odnieś pierwsze zwycięstwo", description: "Wygraj mecz ligowy albo turniejowy.", target: 1, reward: 3000 },
];

const questProgress = Object.fromEntries(onboardingQuests.map((quest) => [quest.id, 0]));
const claimedQuests = new Set();
const careerStats = { matches: 0, wins: 0, losses: 0, currentStreak: 0, bestStreak: 0, recentMatches: [] };

function updateQuestIndicator() {
  const count = onboardingQuests.filter((quest) => questProgress[quest.id] >= quest.target && !claimedQuests.has(quest.id)).length;
  const badge = document.querySelector("[data-quest-badge]");
  if (badge) { badge.textContent = String(count); badge.hidden = count === 0; }
  document.querySelector('[data-section="home"]')?.classList.toggle("main-nav__item--unread", count > 0);
}

window.progressQuest = function progressQuest(id, amount = 1) {
  const quest = onboardingQuests.find((item) => item.id === id);
  if (!quest || questProgress[id] >= quest.target) return;
  questProgress[id] = Math.min(quest.target, questProgress[id] + amount);
  updateQuestIndicator();
};

window.recordCareerMatch = function recordCareerMatch(won, match) {
  careerStats.matches += 1;
  careerStats[won ? "wins" : "losses"] += 1;
  careerStats.currentStreak = won ? careerStats.currentStreak + 1 : 0;
  careerStats.bestStreak = Math.max(careerStats.bestStreak, careerStats.currentStreak);
  careerStats.recentMatches.unshift({ day: match.day, competition: match.competition, opponent: match.opponent, result: won ? "Wygrana" : "Porażka", score: `${match.ourKills} : ${match.opponentKills}` });
  careerStats.recentMatches = careerStats.recentMatches.slice(0, 8);
  window.progressQuest("play-match");
  if (won) window.progressQuest("win-match");
};

window.claimQuest = function claimQuest(id) {
  const quest = onboardingQuests.find((item) => item.id === id);
  if (!quest || questProgress[id] < quest.target || claimedQuests.has(id)) return false;
  claimedQuests.add(id);
  window.clubEconomy.budget += quest.reward;
  window.gameState.schedule();
  updateQuestIndicator();
  return true;
};

window.renderOnboardingQuests = function renderOnboardingQuests() {
  if (onboardingQuests.every((quest) => claimedQuests.has(quest.id))) return window.renderCareerSummary();
  const completed = onboardingQuests.filter((quest) => questProgress[quest.id] >= quest.target).length;
  return `<section class="quest-panel"><div class="section-heading"><span>Pierwsze kroki • ${completed}/${onboardingQuests.length}</span><h4>Droga początkującego menedżera</h4></div><div class="quest-list">${onboardingQuests.map((quest, index) => {
    const done = questProgress[quest.id] >= quest.target;
    const claimed = claimedQuests.has(quest.id);
    return `<article class="quest-card ${done ? "quest-card--done" : ""}"><i>${claimed ? "✓" : done ? "!" : index + 1}</i><div><strong>${quest.title}</strong><p>${quest.description}</p><small>Nagroda: ${window.clubEconomy.format(quest.reward)}</small></div>${done && !claimed ? `<button data-claim-quest="${quest.id}">Odbierz</button>` : `<b>${claimed ? "Odebrano" : `${questProgress[quest.id]}/${quest.target}`}</b>`}</article>`;
  }).join("")}</div></section>`;
};

window.renderCareerSummary = function renderCareerSummary() {
  const winRate = careerStats.matches ? Math.round(careerStats.wins / careerStats.matches * 100) : 0;
  const rows = careerStats.recentMatches.length ? careerStats.recentMatches.map((match) => `<tr><td>Dzień ${match.day}</td><td>${match.competition}</td><td>${match.opponent}</td><td><strong class="career-result--${match.result === "Wygrana" ? "win" : "loss"}">${match.result}</strong></td><td>${match.score}</td></tr>`).join("") : '<tr><td colspan="5">Nie rozegrano jeszcze żadnego meczu.</td></tr>';
  return `<section class="career-summary"><div class="section-heading"><span>Kariera menedżera</span><h4>Podsumowanie wyników</h4></div><div class="career-kpis"><article><span>Mecze</span><strong>${careerStats.matches}</strong></article><article><span>Wygrane</span><strong>${careerStats.wins}</strong></article><article><span>Przegrane</span><strong>${careerStats.losses}</strong></article><article><span>Win rate</span><strong>${winRate}%</strong></article><article><span>Najlepsza seria</span><strong>${careerStats.bestStreak}</strong></article><article><span>Overall</span><strong>${careerStats.wins - careerStats.losses >= 0 ? "+" : ""}${careerStats.wins - careerStats.losses}</strong></article></div><div class="career-table-wrap"><table class="finance-table career-table"><thead><tr><th>Dzień</th><th>Rozgrywki</th><th>Rywal</th><th>Wynik</th><th>K/D</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
};

window.setupOnboardingQuests = function setupOnboardingQuests(onChange) {
  document.querySelectorAll("[data-claim-quest]").forEach((button) => button.addEventListener("click", () => {
    if (window.claimQuest(button.dataset.claimQuest)) onChange();
  }));
};

window.getCareerWins = () => careerStats.wins;
window.getClubPrestige = () => Math.min(100, 10 + careerStats.wins * 3 + careerStats.bestStreak);
window.gameState.register("quests", {
  get: () => ({ progress: questProgress, claimed: [...claimedQuests], careerStats }),
  set: (state) => {
    Object.assign(questProgress, state.progress || {});
    claimedQuests.clear();
    (state.claimed || []).forEach((id) => claimedQuests.add(id));
    Object.assign(careerStats, state.careerStats || {});
    careerStats.losses = Number(careerStats.losses) || Math.max(0, careerStats.matches - careerStats.wins);
    careerStats.recentMatches = Array.isArray(careerStats.recentMatches) ? careerStats.recentMatches : [];
    updateQuestIndicator();
  },
});
