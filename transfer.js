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

const transferDetails = {
  iBo: ["TOP", 80, 180000], XnS: ["JUNGLE", 77, 90000], Decay: ["MID", 78, 110000], Scorth: ["ADC", 77, 80000], Lucker: ["SUPPORT", 76, 75000],
  Agresivoo: ["TOP", 79, 170000], mikusik: ["JUNGLE", 75, 60000], Tenshi: ["JUNGLE", 67, 20000], Artoria: ["MID", 76, 70000], Woolite: ["ADC", 79, 160000], Jactroll: ["SUPPORT", 78, 140000],
  frajgo: ["TOP", 73, 45000], LeQu: ["JUNGLE", 74, 50000], Guli: ["MID", 71, 35000], Mrozku: ["ADC", 71, 35000], Odi11: ["SUPPORT", 68, 20000], minemaciek: ["SUPPORT", 66, 15000],
  HeSSZero: ["TOP", 74, 50000], Joki37: ["JUNGLE", 74, 50000], Sobek: ["MID", 76, 70000], ejsner: ["ADC", 73, 40000], Raxxo: ["SUPPORT", 72, 35000],
  PmK: ["TOP", 70, 30000], FullClear: ["JUNGLE", 73, 45000], Birkyy: ["MID", 70, 30000], Anyone: ["ADC", 69, 25000], kubagoat: ["SUPPORT", 69, 25000],
  Blesia: ["TOP", 72, 35000], Kokos: ["JUNGLE", 72, 35000], "lee sang": ["MID", 72, 35000], Klorell: ["ADC", 69, 25000], Robertoos: ["SUPPORT", 74, 50000], Syrpy: ["SUPPORT", 66, 15000],
  Goldmen: ["TOP", 71, 35000], belit: ["JUNGLE", 71, 35000], fantomisto: ["MID", 71, 35000], Faetski: ["ADC", 70, 30000], Calmsky: ["SUPPORT", 69, 25000],
  Szafa: ["TOP", 68, 20000], Ribu: ["JUNGLE", 71, 35000], Krysia: ["MID", 68, 20000], ShazQ: ["ADC", 70, 30000], Sorrow2: ["SUPPORT", 68, 20000], Salami: ["ADC", 67, 18000], Acorderr: ["SUPPORT", 67, 18000],
};

const transferPlayers = Object.entries(riftLegendsRosters).flatMap(([team, roster]) => roster.map((stats) => {
  const [name, macro, micro, vision, roams, farming, reflex] = stats;
  const [position, overall, cost] = transferDetails[name];
  return { name, team, league: "RiftLegends", position, macro, micro, vision, roams, farming, reflex, overall, cost };
}));
const purchasedPlayers = new Set();
let transferTeamFilter = "all";
let transferLeagueFilter = "all";
let transferPositionFilter = "all";
let transferSearch = "";
let transferMessage = "";
let transferSort = { key: "overall", direction: "desc" };

const transferColumns = [
  ["name", "Zawodnik"], ["position", "Pozycja"], ["team", "Drużyna"], ["league", "Liga"], ["overall", "OVR"],
  ["macro", "Macro"], ["micro", "Micro"], ["vision", "Wizja"], ["roams", "Roamy"],
  ["farming", "Farming"], ["reflex", "Reflex"], ["cost", "Cena"],
];

function renderSortHeader(key, label) {
  const active = transferSort.key === key;
  const arrow = active ? (transferSort.direction === "asc" ? "↑" : "↓") : "↕";
  return `<th><button class="transfer-sort ${active ? "transfer-sort--active" : ""}" data-transfer-sort="${key}" aria-label="Sortuj: ${label}" aria-pressed="${active}">${label}<span>${arrow}</span></button></th>`;
}

function renderTransfer() {
  const teams = Object.keys(riftLegendsRosters);
  const leagues = [...new Set(transferPlayers.map((player) => player.league))];
  const positions = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];
  const visiblePlayers = transferPlayers.filter((player) =>
    (transferTeamFilter === "all" || player.team === transferTeamFilter)
    && (transferLeagueFilter === "all" || player.league === transferLeagueFilter)
    && (transferPositionFilter === "all" || player.position === transferPositionFilter)
    && player.name.toLocaleLowerCase("pl").includes(transferSearch.toLocaleLowerCase("pl"))
  ).sort((first, second) => {
    const firstValue = first[transferSort.key];
    const secondValue = second[transferSort.key];
    const comparison = typeof firstValue === "string"
      ? firstValue.localeCompare(secondValue, "pl")
      : firstValue - secondValue;
    return transferSort.direction === "asc" ? comparison : -comparison;
  });
  const rows = visiblePlayers.map((player) => {
    const index = transferPlayers.indexOf(player);
    const unavailable = purchasedPlayers.has(index) || !window.clubEconomy.canAfford(player.cost);
    return `<tr><td><strong>${player.name}</strong></td><td><strong>${player.position}</strong></td><td>${player.team}</td><td>${player.league}</td><td class="rating-cell">${player.overall}</td><td>${player.macro}</td><td>${player.micro}</td><td>${player.vision}</td><td>${player.roams}</td><td>${player.farming}</td><td>${player.reflex}</td><td><strong>${window.clubEconomy.format(player.cost)}</strong></td><td><button class="upgrade-button transfer-buy" data-buy-player="${index}" ${unavailable ? "disabled" : ""}>${purchasedPlayers.has(index) ? "Kupiony" : "Kup"}</button></td></tr>`;
  }).join("");
  return `<div class="management-board transfer-board">
    <header class="transfer-toolbar"><div><p class="eyebrow">Rynek transferowy</p><h2>RiftLegends</h2><div class="transfer-meta"><span class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></span><span>${visiblePlayers.length} z ${transferPlayers.length} zawodników</span></div></div><div class="transfer-filters"><label><span>Szukaj</span><input data-transfer-search value="${transferSearch}" placeholder="Nazwa zawodnika"></label><label><span>Pozycja</span><select data-transfer-position><option value="all">Wszystkie pozycje</option>${positions.map((position) => `<option ${position === transferPositionFilter ? "selected" : ""}>${position}</option>`).join("")}</select></label><label><span>Liga</span><select data-transfer-league><option value="all">Wszystkie ligi</option>${leagues.map((league) => `<option ${league === transferLeagueFilter ? "selected" : ""}>${league}</option>`).join("")}</select></label><label><span>Drużyna</span><select data-transfer-team><option value="all">Wszystkie drużyny</option>${teams.map((team) => `<option ${team === transferTeamFilter ? "selected" : ""}>${team}</option>`).join("")}</select></label></div></header>
    <p class="transfer-notice ${transferMessage ? "" : "transfer-notice--hint"}" role="status">${transferMessage || "Wybierz zawodnika z listy i kliknij „Kup”. Cena zostanie odjęta od budżetu klubu."}</p>
    <div class="transfer-table-wrap"><table class="finance-table transfer-table"><thead><tr>${transferColumns.map(([key, label]) => renderSortHeader(key, label)).join("")}<th>Zakup</th></tr></thead><tbody>${rows || `<tr><td colspan="13" class="transfer-empty">Brak zawodników spełniających kryteria.</td></tr>`}</tbody></table></div>
  </div>`;
}

function setupTransfer(onChange) {
  document.querySelector("[data-transfer-position]")?.addEventListener("change", (event) => {
    transferPositionFilter = event.target.value;
    onChange();
  });
  document.querySelector("[data-transfer-league]")?.addEventListener("change", (event) => {
    transferLeagueFilter = event.target.value;
    onChange();
  });
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
      transferMessage = `Kupiono zawodnika ${player.name} z ${player.team} za ${window.clubEconomy.format(player.cost)}.`;
      onChange();
    }
  }));
  document.querySelectorAll("[data-transfer-sort]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.transferSort;
    const defaultDirection = key === "name" || key === "position" || key === "team" || key === "league" || key === "cost" ? "asc" : "desc";
    transferSort = transferSort.key === key
      ? { key, direction: transferSort.direction === "asc" ? "desc" : "asc" }
      : { key, direction: defaultDirection };
    onChange();
  }));
}

window.renderTransfer = renderTransfer;
window.setupTransfer = setupTransfer;
