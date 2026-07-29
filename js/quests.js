const onboardingQuests = [
  { id: "join-tournament", title: "Dołącz do turnieju", description: "Wybierz pierwsze rozgrywki w zakładce Tournaments.", target: 1, reward: 1500 },
  { id: "hire-staff", title: "Zatrudnij członka sztabu", description: "Wzmocnij zespół trenerem, analitykiem lub psychologiem.", target: 1, reward: 1000 },
  { id: "play-match", title: "Rozegraj pierwszy mecz", description: "Podejmij wszystkie decyzje taktyczne podczas spotkania.", target: 1, reward: 2000 },
  { id: "win-match", title: "Odnieś pierwsze zwycięstwo", description: "Wygraj mecz ligowy albo turniejowy.", target: 1, reward: 3000 },
];

const questProgress = Object.fromEntries(onboardingQuests.map((quest) => [quest.id, 0]));
const claimedQuests = new Set();
const careerStats = { matches: 0, wins: 0 };

window.progressQuest = function progressQuest(id, amount = 1) {
  if (id === "play-match") careerStats.matches += amount;
  if (id === "win-match") careerStats.wins += amount;
  const quest = onboardingQuests.find((item) => item.id === id);
  if (!quest || questProgress[id] >= quest.target) return;
  questProgress[id] = Math.min(quest.target, questProgress[id] + amount);
};

window.claimQuest = function claimQuest(id) {
  const quest = onboardingQuests.find((item) => item.id === id);
  if (!quest || questProgress[id] < quest.target || claimedQuests.has(id)) return false;
  claimedQuests.add(id);
  window.clubEconomy.budget += quest.reward;
  window.gameState.schedule();
  return true;
};

window.renderOnboardingQuests = function renderOnboardingQuests() {
  const completed = onboardingQuests.filter((quest) => questProgress[quest.id] >= quest.target).length;
  return `<section class="quest-panel"><div class="section-heading"><span>Pierwsze kroki • ${completed}/${onboardingQuests.length}</span><h4>Droga początkującego menedżera</h4></div><div class="quest-list">${onboardingQuests.map((quest, index) => {
    const done = questProgress[quest.id] >= quest.target;
    const claimed = claimedQuests.has(quest.id);
    return `<article class="quest-card ${done ? "quest-card--done" : ""}"><i>${claimed ? "✓" : done ? "!" : index + 1}</i><div><strong>${quest.title}</strong><p>${quest.description}</p><small>Nagroda: ${window.clubEconomy.format(quest.reward)}</small></div>${done && !claimed ? `<button data-claim-quest="${quest.id}">Odbierz</button>` : `<b>${claimed ? "Odebrano" : `${questProgress[quest.id]}/${quest.target}`}</b>`}</article>`;
  }).join("")}</div></section>`;
};

window.setupOnboardingQuests = function setupOnboardingQuests(onChange) {
  document.querySelectorAll("[data-claim-quest]").forEach((button) => button.addEventListener("click", () => {
    if (window.claimQuest(button.dataset.claimQuest)) onChange();
  }));
};

window.getCareerWins = () => careerStats.wins;
window.gameState.register("quests", {
  get: () => ({ progress: questProgress, claimed: [...claimedQuests], careerStats }),
  set: (state) => {
    Object.assign(questProgress, state.progress || {});
    claimedQuests.clear();
    (state.claimed || []).forEach((id) => claimedQuests.add(id));
    Object.assign(careerStats, state.careerStats || {});
  },
});
