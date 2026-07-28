const leagues = [
  { name: "Bronze Circuit", tier: "Startowa", entryFee: 0, prize: 35000, region: "Polska", slots: "8 drużyn", opponent: "Bronze Badgers", nextMatch: "Poniedziałek 19:00" },
  { name: "Regional Academy League", tier: "Regionalna", entryFee: 20000, prize: 80000, region: "Europa Centralna", slots: "10 drużyn", opponent: "Academy Owls", nextMatch: "Czwartek 18:00" },
  { name: "Challenger Path", tier: "Semi-pro", entryFee: 60000, prize: 180000, region: "Europa", slots: "12 drużyn", opponent: "Valley Drakes", nextMatch: "Sobota 16:00" },
  { name: "Elite Championship", tier: "Pro", entryFee: 150000, prize: 500000, region: "Europa", slots: "10 drużyn", opponent: "Dragon Forge", nextMatch: "Niedziela 20:00" },
];
let activeLeagueIndex = null;

function renderLeagueTable(league) {
  if (!league) return "";
  return `<section class="competition-table"><div class="section-heading"><span>Wybrana liga</span><h4>${league.name}</h4></div><table class="finance-table"><thead><tr><th>Następny mecz</th><th>Rywal</th><th>Region</th><th>Potencjalna nagroda</th></tr></thead><tbody><tr><td>${league.nextMatch}</td><td>${league.opponent}</td><td>${league.region}</td><td>${window.clubEconomy.format(league.prize)}</td></tr></tbody></table></section>`;
}

function renderLeagues() {
  const rows = leagues.map((league, index) => {
    const isActive = activeLeagueIndex === index;
    const hasActive = activeLeagueIndex !== null;
    return `<article class="market-card ${isActive ? "market-card--active" : ""}"><span>${league.tier}</span><strong>${league.name}</strong><p>${league.region} • ${league.slots}</p><small>Wpisowe: ${league.entryFee ? window.clubEconomy.format(league.entryFee) : "Darmowe"}</small><button class="upgrade-button" data-join-league="${index}" ${isActive || (hasActive && !isActive) || !window.clubEconomy.canAfford(league.entryFee) ? "disabled" : ""}>${isActive ? "Wybrana" : "Dołącz"}</button></article>`;
  }).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="market-grid market-grid--four">${rows}</div>${renderLeagueTable(leagues[activeLeagueIndex])}</div>`;
}

function setupLeagues(onChange) {
  document.querySelectorAll("[data-join-league]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.joinLeague);
    const league = leagues[index];
    if (activeLeagueIndex === null && league && window.clubEconomy.spend(league.entryFee)) {
      activeLeagueIndex = index;
      onChange();
    }
  }));
}

window.renderLeagues = renderLeagues;
window.setupLeagues = setupLeagues;
