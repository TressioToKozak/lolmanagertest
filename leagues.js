const leagues = [
  { name: "Elite Championship", tier: "Tier 1", entryFee: 150000, region: "Europa", slots: "10 drużyn" },
  { name: "Northern League", tier: "Tier 2", entryFee: 70000, region: "Nordics", slots: "12 drużyn" },
  { name: "Polish Masters", tier: "Regional", entryFee: 45000, region: "Polska", slots: "8 drużyn" },
];
const joinedLeagues = new Set();

function renderLeagues() {
  const rows = leagues.map((league, index) => `<article class="market-card"><span>${league.tier}</span><strong>${league.name}</strong><p>${league.region} • ${league.slots}</p><small>Wpisowe: ${window.clubEconomy.format(league.entryFee)}</small><button class="upgrade-button" data-join-league="${index}" ${joinedLeagues.has(index) || !window.clubEconomy.canAfford(league.entryFee) ? "disabled" : ""}>${joinedLeagues.has(index) ? "Dołączono" : "Dołącz"}</button></article>`).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="market-grid market-grid--three">${rows}</div></div>`;
}

function setupLeagues(onChange) {
  document.querySelectorAll("[data-join-league]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.joinLeague);
    const league = leagues[index];
    if (league && window.clubEconomy.spend(league.entryFee)) {
      joinedLeagues.add(index);
      onChange();
    }
  }));
}

window.renderLeagues = renderLeagues;
window.setupLeagues = setupLeagues;
