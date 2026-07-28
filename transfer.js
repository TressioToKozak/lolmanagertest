const riftLegendsRosters = {
  "Forsaken": [
    ["iBo", 76, 80, 73, 68, 79, 81], ["XnS", 78, 74, 77, 80, 69, 73],
    ["Decay", 77, 79, 75, 74, 80, 80], ["Scorth", 75, 77, 72, 73, 78, 79],
    ["Lucker", 73, 76, 78, 71, 76, 77],
  ],
  "Barcząca Esports": [
    ["Agresivoo", 79, 79, 75, 71, 78, 80], ["mikusik", 74, 75, 73, 76, 71, 75],
    ["Tenshi", 67, 68, 65, 66, 67, 69], ["Artoria", 75, 77, 79, 76, 74, 76],
    ["Woolite", 77, 78, 72, 66, 81, 79], ["Jactroll", 79, 74, 81, 80, 63, 73],
  ],
  "BOMBA Team": [
    ["frajgo", 72, 74, 70, 68, 74, 75], ["LeQu", 73, 75, 71, 76, 70, 76],
    ["Guli", 71, 73, 69, 68, 73, 74], ["Mrozku", 70, 72, 69, 67, 72, 73],
    ["Odi11", 67, 69, 65, 64, 69, 70], ["minemaciek", 65, 67, 64, 63, 67, 68],
  ],
  "Anonymo Esports": [
    ["HeSSZero", 75, 74, 72, 69, 75, 74], ["Joki37", 75, 74, 76, 77, 70, 74],
    ["Sobek", 76, 77, 74, 73, 77, 78], ["ejsner", 72, 73, 75, 72, 73, 74],
    ["Raxxo", 71, 72, 74, 71, 71, 72],
  ],
  "DOCISK": [
    ["PmK", 69, 71, 68, 66, 70, 72], ["FullClear", 74, 73, 74, 77, 70, 73],
    ["Birkyy", 70, 71, 69, 69, 72, 72], ["Anyone", 69, 69, 68, 67, 69, 70],
    ["kubagoat", 68, 69, 70, 68, 68, 69],
  ],
  "LODIS": [
    ["Blesia", 72, 73, 71, 69, 72, 73], ["Kokos", 73, 72, 72, 75, 70, 72],
    ["lee sang", 72, 73, 71, 72, 72, 73], ["Klorell", 69, 70, 68, 68, 70, 71],
    ["Robertoos", 74, 75, 77, 74, 73, 75], ["Syrpy", 66, 67, 67, 65, 66, 67],
  ],
  "devils.one": [
    ["Goldmen", 71, 72, 70, 69, 71, 72], ["belit", 71, 72, 70, 73, 70, 72],
    ["fantomisto", 71, 72, 69, 70, 71, 72], ["Faetski", 70, 70, 69, 68, 70, 71],
    ["Calmsky", 68, 69, 70, 67, 68, 69],
  ],
  "GLORE": [
    ["Szafa", 68, 69, 67, 67, 69, 70], ["Ribu", 71, 72, 71, 74, 70, 72],
    ["Krysia", 68, 69, 67, 68, 69, 69], ["ShazQ", 70, 71, 69, 69, 71, 72],
    ["Sorrow2", 68, 69, 70, 68, 68, 69], ["Salami", 67, 68, 67, 66, 68, 68],
    ["Acorderr", 67, 68, 66, 66, 67, 68],
  ],
};

const transferPlayers = Object.entries(riftLegendsRosters).flatMap(([team, roster]) => roster.map((stats) => {
  const [name, macro, micro, vision, roams, farming, reflex] = stats;
  const overall = Math.round((macro + micro + vision + roams + farming + reflex) / 6);
  return { name, team, macro, micro, vision, roams, farming, reflex, overall, cost: Math.max(90000, (overall - 55) * 35000) };
}));
const purchasedPlayers = new Set();
let transferTeamFilter = "all";
let transferSearch = "";

function renderTransfer() {
  const teams = Object.keys(riftLegendsRosters);
  const visiblePlayers = transferPlayers.filter((player) =>
    (transferTeamFilter === "all" || player.team === transferTeamFilter)
    && player.name.toLocaleLowerCase("pl").includes(transferSearch.toLocaleLowerCase("pl"))
  );
  const rows = visiblePlayers.map((player) => {
    const index = transferPlayers.indexOf(player);
    const unavailable = purchasedPlayers.has(index) || !window.clubEconomy.canAfford(player.cost);
    return `<tr><td><strong>${player.name}</strong><small>${player.team}</small></td><td class="rating-cell">${player.overall}</td><td>${player.macro}</td><td>${player.micro}</td><td>${player.vision}</td><td>${player.roams}</td><td>${player.farming}</td><td>${player.reflex}</td><td>${window.clubEconomy.format(player.cost)}</td><td><button class="upgrade-button transfer-buy" data-buy-player="${index}" ${unavailable ? "disabled" : ""}>${purchasedPlayers.has(index) ? "Kupiony" : "Kup"}</button></td></tr>`;
  }).join("");
  return `<div class="management-board transfer-board">
    <header class="transfer-toolbar"><div><span class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></span><p>${visiblePlayers.length} z ${transferPlayers.length} zawodników ligi RiftLegends</p></div><div class="transfer-filters"><label><span>Szukaj</span><input data-transfer-search value="${transferSearch}" placeholder="Nazwa zawodnika"></label><label><span>Drużyna</span><select data-transfer-team><option value="all">Wszystkie drużyny</option>${teams.map((team) => `<option ${team === transferTeamFilter ? "selected" : ""}>${team}</option>`).join("")}</select></label></div></header>
    <div class="transfer-table-wrap"><table class="finance-table transfer-table"><thead><tr><th>Zawodnik</th><th>OVR</th><th>Macro</th><th>Micro</th><th>Wizja</th><th>Roamy</th><th>Farming</th><th>Reflex</th><th>Cena</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="10" class="transfer-empty">Brak zawodników spełniających kryteria.</td></tr>`}</tbody></table></div>
  </div>`;
}

function setupTransfer(onChange) {
  document.querySelector("[data-transfer-team]")?.addEventListener("change", (event) => {
    transferTeamFilter = event.target.value;
    onChange();
  });
  document.querySelector("[data-transfer-search]")?.addEventListener("input", (event) => {
    transferSearch = event.target.value;
    onChange();
    const search = document.querySelector("[data-transfer-search]");
    search?.focus();
    search?.setSelectionRange(transferSearch.length, transferSearch.length);
  });
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
