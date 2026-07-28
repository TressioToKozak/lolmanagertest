const transferPlayers = [
  { name: 'Lee "Spark" Min', role: "MID", team: "Seoul Sparks", cost: 640000 },
  { name: 'Carlos "Blade" Ruiz', role: "TOP", team: "Madrid Griffins", cost: 420000 },
  { name: 'Mikołaj "River" Bąk', role: "JUNGLE", team: "Warsaw Wolves", cost: 310000 },
  { name: 'Jonas "Crit" Meyer', role: "ADC", team: "Berlin Bots", cost: 520000 },
  { name: 'Erik "Shield" Lund', role: "SUPPORT", team: "Nordic Lights", cost: 280000 },
];
const purchasedPlayers = new Set();

function renderTransfer() {
  const rows = transferPlayers.map((player, index) => `<article class="market-card"><span>${player.role}</span><strong>${player.name}</strong><p>Drużyna: ${player.team}</p><small>Cena: ${window.clubEconomy.format(player.cost)}</small><button class="upgrade-button" data-buy-player="${index}" ${purchasedPlayers.has(index) || !window.clubEconomy.canAfford(player.cost) ? "disabled" : ""}>${purchasedPlayers.has(index) ? "Kupiony" : "Kup"}</button></article>`).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><div class="market-grid">${rows}</div></div>`;
}

function setupTransfer(onChange) {
  document.querySelectorAll("[data-buy-player]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.buyPlayer);
    const player = transferPlayers[index];
    if (player && window.clubEconomy.spend(player.cost)) {
      purchasedPlayers.add(index);
      onChange();
    }
  }));
}

window.renderTransfer = renderTransfer;
window.setupTransfer = setupTransfer;
