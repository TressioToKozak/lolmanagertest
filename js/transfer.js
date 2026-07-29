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

const countryFlags = {
  PL: "Polska", GB: "Wielka Brytania", ES: "Hiszpania", RO: "Rumunia", PT: "Portugalia", SI: "Słowenia",
  DE: "Niemcy", CZ: "Czechy", KR: "Korea Południowa", SK: "Słowacja", SE: "Szwecja", HR: "Chorwacja",
};
const riftCountryCodes = { iBo: "GB" };
function withCountry(player, countryCode) {
  return { ...player, countryCode, country: countryFlags[countryCode] || countryFlags.PL, flag: `assets/flags/${countryCode.toLowerCase()}.svg` };
}

const transferPlayers = Object.entries(riftLegendsRosters).flatMap(([team, roster]) => roster.map((stats) => {
  const [name, macro, micro, vision, roams, farming, reflex] = stats;
  const [position, overall, cost] = transferDetails[name];
  return withCountry({ name, team, league: "RiftLegends (PL)", position, macro, micro, vision, roams, farming, reflex, overall, cost }, riftCountryCodes[name] || "PL");
}));

const superligaRosters = {
  "KOI Fénix": [
    ["Kozi", "PL", 84, 83, 85, 79, 77, 84, 86, 350000], ["bluerzor", "RO", 83, 84, 81, 83, 84, 78, 81, 320000], ["Czajek", "PL", 84, 83, 84, 81, 80, 85, 85, 340000], ["Flakked", "ES", 85, 81, 86, 77, 74, 87, 87, 450000], ["Oscure", "ES", 82, 82, 79, 85, 83, 70, 80, 250000],
  ],
  "Barça eSports": [
    ["Maynter", "ES", 82, 81, 82, 77, 75, 81, 82, 230000], ["Hadess", "PL", 83, 84, 81, 82, 84, 77, 81, 280000], ["Baca", "PT", 82, 82, 82, 79, 79, 83, 83, 240000], ["Legolas", "ES", 81, 79, 82, 76, 73, 84, 84, 220000], ["Whiteinn", "SI", 82, 82, 79, 84, 84, 71, 79, 240000],
  ],
  "GIANTX PRIDE": [
    ["R4ven", "CZ", 81, 81, 82, 76, 74, 81, 82, 210000], ["Peach", "KR", 82, 83, 80, 81, 84, 75, 80, 250000], ["Feisty", "KR", 82, 82, 83, 79, 80, 84, 84, 250000], ["Aetinoth", "ES", 80, 79, 81, 75, 73, 83, 83, 190000], ["Seaz", "ES", 81, 81, 78, 84, 83, 70, 78, 200000],
  ],
  "UCAM Esports Club": [
    ["Dreedy", "CZ", 80, 80, 80, 76, 73, 81, 81, 180000], ["Koldo", "ES", 82, 83, 80, 82, 84, 76, 80, 250000], ["Fresskowy", "PL", 83, 83, 84, 80, 80, 84, 84, 300000], ["Trigger", "KR", 82, 80, 83, 77, 74, 85, 85, 260000], ["Lucky", "ES", 81, 81, 79, 84, 83, 70, 79, 210000],
  ],
  "LUA Gaming": [
    ["Sinmivak", "SK", 79, 79, 80, 74, 72, 80, 81, 150000], ["Thayger", "ES", 80, 81, 79, 80, 82, 75, 79, 180000], ["Miniduke", "ES", 81, 81, 82, 78, 78, 83, 83, 210000], ["Guubi", "ES", 80, 79, 81, 75, 72, 83, 83, 180000], ["Efias", "ES", 80, 80, 78, 83, 82, 69, 78, 170000],
  ],
  "Ramboot Club": [
    ["iBo", "GB", 84, 84, 85, 80, 77, 85, 86, 360000], ["bluerzor", "RO", 83, 84, 81, 83, 85, 78, 81, 320000], ["twohoyrz", "CZ", 81, 80, 82, 78, 78, 82, 83, 220000], ["Coldraa", "SE", 81, 80, 81, 76, 75, 83, 83, 210000], ["Pyrka", "PL", 82, 82, 79, 84, 84, 71, 80, 240000],
  ],
  "Los Heretics": [
    ["Tracyn", "CZ", 82, 81, 83, 77, 75, 82, 84, 240000], ["Rabble", "GB", 82, 83, 80, 82, 84, 76, 80, 250000], ["ESCIK", "PL", 82, 82, 83, 80, 79, 83, 84, 250000], ["BEAN", "GB", 84, 82, 85, 78, 74, 86, 86, 350000], ["LIMIT", "HR", 83, 83, 80, 85, 84, 70, 80, 310000],
  ],
  "Guasones": [
    ["Syzyfek", "PL", 79, 79, 80, 74, 73, 80, 81, 150000], ["Zorozero", "ES", 79, 80, 78, 79, 81, 74, 78, 160000], ["Roison", "ES", 80, 80, 81, 77, 77, 82, 82, 180000], ["Rayito", "ES", 79, 78, 80, 74, 72, 82, 82, 160000], ["Kasing", "GB", 81, 81, 77, 84, 83, 68, 77, 200000],
  ],
  "ZETA": [
    ["Ethe", "ES", 78, 78, 79, 74, 72, 79, 80, 140000], ["ElOjoNinja", "ES", 79, 80, 78, 80, 82, 74, 78, 170000], ["ptt", "ES", 80, 80, 81, 77, 77, 82, 82, 190000], ["Adryh", "ES", 81, 79, 82, 75, 73, 84, 84, 220000], ["escoX", "ES", 80, 81, 78, 83, 82, 69, 78, 190000],
  ],
  "Veni Vidi Vici": [
    ["CPM", "ES", 79, 79, 80, 75, 73, 80, 81, 150000], ["Time", "KR", 80, 81, 79, 80, 82, 74, 79, 180000], ["Miniduke", "ES", 81, 81, 82, 78, 78, 83, 83, 220000], ["Thomas", "ES", 80, 79, 81, 76, 74, 83, 83, 190000], ["Exorant", "ES", 80, 81, 78, 83, 82, 69, 78, 190000],
  ],
};
const primeLeagueRosters = {
  "BIG": [
    ["Satorius", 83, 84, 82, 79, 77, 82, 82, 290000], ["Akabane", 85, 85, 84, 83, 86, 79, 84, 430000], ["Reeker", 86, 85, 87, 82, 81, 86, 87, 500000], ["Jopa", 83, 81, 84, 78, 76, 85, 85, 280000], ["Leonard", 82, 83, 80, 85, 84, 71, 79, 250000],
  ],
  "G2 NORD": [
    ["Melonik", 82, 82, 82, 77, 75, 82, 83, 250000], ["Isma", 84, 85, 82, 83, 85, 77, 82, 360000], ["TakeSet", 83, 83, 84, 80, 79, 84, 84, 300000], ["Vzz", 82, 81, 83, 77, 75, 84, 85, 260000], ["Nata", 83, 84, 80, 86, 85, 71, 79, 290000],
  ],
  "Eintracht Spandau": [
    ["JNX", 85, 84, 85, 81, 78, 85, 86, 420000], ["Xagog", 84, 85, 82, 84, 86, 77, 82, 360000], ["PowerOfEvil", 87, 87, 87, 84, 80, 88, 86, 650000], ["Keduii", 86, 83, 87, 79, 76, 88, 88, 520000], ["seaz", 84, 85, 81, 87, 86, 70, 80, 340000],
  ],
  "Unicorns of Love Sexy Edition": [
    ["Fornoreason", 84, 84, 84, 80, 78, 84, 85, 360000], ["Whiteakitout", 82, 83, 81, 82, 84, 76, 81, 260000], ["Kanin", 83, 83, 84, 79, 79, 84, 84, 300000], ["DenVoksne", 84, 82, 85, 78, 76, 86, 86, 340000], ["Twiizt", 83, 84, 80, 86, 85, 69, 79, 280000],
  ],
  "Eintracht Frankfurt": [
    ["Scarface", 81, 81, 82, 77, 74, 81, 82, 220000], ["Obsess", 82, 83, 81, 82, 84, 76, 80, 260000], ["Diplex", 85, 85, 86, 82, 81, 86, 86, 440000], ["Innaxe", 85, 83, 86, 79, 76, 87, 87, 430000], ["Lucky", 82, 83, 80, 85, 84, 70, 79, 250000],
  ],
  "E WIE EINFACH Esports": [
    ["Alois", 83, 84, 82, 79, 77, 83, 83, 290000], ["Pridestalkr", 85, 86, 83, 84, 86, 78, 83, 440000], ["Selfie", 86, 86, 86, 83, 81, 87, 86, 520000], ["SMILEY", 84, 82, 85, 79, 76, 86, 86, 360000], ["Doss", 84, 85, 81, 87, 86, 70, 80, 340000],
  ],
  "TeamOrangeGaming": [
    ["Cboi", 80, 81, 80, 76, 73, 80, 81, 180000], ["Obsessed", 81, 82, 80, 81, 83, 75, 80, 220000], ["Pretty", 82, 82, 83, 79, 78, 83, 84, 260000], ["Focus", 81, 80, 82, 76, 73, 84, 84, 220000], ["Plasma", 81, 82, 79, 84, 83, 69, 79, 210000],
  ],
  "ROSSMANN Centaurs": [
    ["Scar", 80, 81, 80, 77, 74, 80, 81, 180000], ["Don Arts", 82, 83, 81, 82, 84, 76, 81, 260000], ["Phantasm", 81, 81, 82, 79, 78, 82, 83, 220000], ["Vik", 81, 80, 82, 76, 74, 84, 84, 220000], ["Seal", 82, 83, 79, 85, 84, 70, 79, 250000],
  ],
  "Kaufland Hangry Knights": [
    ["Ragner", 84, 84, 84, 80, 77, 84, 85, 360000], ["Lurox", 85, 86, 83, 84, 86, 78, 83, 430000], ["Special", 85, 85, 85, 82, 80, 86, 85, 440000], ["Gadget", 84, 82, 85, 79, 76, 86, 86, 360000], ["Prime", 83, 84, 81, 86, 85, 70, 80, 310000],
  ],
  "VfB eSports": [
    ["Phones", 81, 81, 82, 77, 75, 81, 82, 220000], ["Rabble", 83, 84, 81, 83, 85, 77, 81, 290000], ["Sertuss", 86, 86, 87, 83, 81, 87, 87, 550000], ["Fun K3y", 82, 81, 83, 78, 75, 84, 84, 260000], ["Hustlin", 82, 83, 80, 85, 84, 70, 79, 250000],
  ],
};

const standardPositions = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];
Object.entries(superligaRosters).forEach(([team, roster]) => roster.forEach((stats, index) => {
  const [name, countryCode, overall, macro, micro, vision, roams, farming, reflex, cost] = stats;
  transferPlayers.push(withCountry({ name, team, league: "LVP Superliga (ES)", position: standardPositions[index], overall, macro, micro, vision, roams, farming, reflex, cost }, countryCode));
}));
Object.entries(primeLeagueRosters).forEach(([team, roster]) => roster.forEach((stats, index) => {
  const [name, overall, macro, micro, vision, roams, farming, reflex, cost] = stats;
  transferPlayers.push(withCountry({ name, team, league: "Prime League (DE)", position: standardPositions[index], overall, macro, micro, vision, roams, farming, reflex, cost }, "DE"));
}));
const koreanLeagueRosters = {
  "🏆 T1": [["Doran",92,94,91,90,89,92,91,2800000],["Oner",95,96,94,94,96,90,95,4500000],["Faker",99,99,98,99,99,97,97,10000000],["Peyz",95,92,97,89,86,98,98,5000000],["Keria",97,98,96,99,99,84,96,7000000]],
  "🐯 Gen.G": [["Kiin",96,96,96,92,90,95,96,6000000],["Canyon",97,98,97,95,97,92,97,7500000],["Chovy",98,98,99,94,91,99,99,9000000],["Ruler",97,94,98,90,87,99,98,7500000],["Duro",91,92,89,94,93,82,90,2200000]],
  "🦅 Hanwha Life Esports": [["Zeus",97,96,98,91,90,97,98,8000000],["Kanavi",97,98,97,94,96,92,97,7500000],["Zeka",95,94,96,90,89,95,96,5500000],["Gumayusi",96,93,97,89,86,98,98,6500000],["Delight",94,95,92,97,97,82,92,3800000]],
  "⚡ Dplus KIA": [["Siwoo",90,90,91,86,84,90,91,1800000],["Lucid",93,94,93,91,94,88,93,3200000],["ShowMaker",96,97,96,94,92,96,96,6500000],["Aiming",94,91,95,88,84,97,97,4500000],["BeryL",92,95,89,98,97,80,88,2800000]],
  "🔵 KT Rolster": [["PerfecT",91,91,92,87,85,91,92,2200000],["Cuzz",92,94,91,91,94,87,90,2800000],["Bdd",95,96,95,93,90,95,95,5200000],["Deokdam",91,89,92,85,82,94,94,2300000],["Peter",89,90,88,92,91,80,88,1600000]],
  "🦈 DN SOOPers": [["DuDu",90,91,90,87,85,90,91,1900000],["Pyosik",92,94,91,91,94,87,91,2800000],["BuLLDoG",90,90,91,88,86,91,92,1800000],["Smash",91,89,93,85,82,94,95,2400000],["Life",91,93,89,95,94,81,89,2300000]],
  "🐉 KIWOOM DRX": [["Rich",89,90,89,86,84,89,89,1500000],["Willer",91,92,91,90,93,86,91,2400000],["Ucal",92,93,92,90,88,93,93,3000000],["Jiwoo",91,89,93,85,82,95,95,2600000],["Andil",89,91,88,93,92,80,88,1600000]],
  "🦊 BNK FearX": [["Clear",88,89,88,85,83,88,89,1300000],["Raptor",89,90,89,88,91,84,89,1600000],["VicLa",91,91,92,89,87,92,93,2500000],["Diable",90,88,92,84,81,94,94,2100000],["Kellin",92,94,90,96,95,81,90,2900000]],
  "🌶️ Nongshim RedForce": [["Kingen",94,95,94,90,88,94,94,4200000],["Sponge",89,90,89,88,90,84,89,1500000],["Scout",96,97,96,93,90,97,96,6800000],["Taeyoon",89,87,90,84,81,92,92,1500000],["Lehends",95,97,93,98,97,82,92,5800000]],
  "🚢 Hanjin BRION": [["Morgan",90,91,89,87,84,90,90,1800000],["Gideon",89,91,89,89,91,84,89,1600000],["Karis",89,89,90,87,85,91,91,1700000],["Hype",88,87,90,83,80,91,92,1300000],["Pollu",88,90,87,92,91,79,87,1200000]],
};
Object.entries(koreanLeagueRosters).forEach(([team, roster]) => roster.forEach(([name, overall, macro, micro, vision, roams, farming, reflex, cost], index) => {
  transferPlayers.push(withCountry({ name, team, league: "LCK (KR)", position: standardPositions[index], overall, macro, micro, vision, roams, farming, reflex, cost }, "KR"));
}));

const purchasedPlayers = new Set();
let transferTeamFilter = "all";
let transferLeagueFilter = "all";
let transferPositionFilter = "all";
let transferSearch = "";
let transferMessage = "";
let transferSort = { key: "overall", direction: "desc" };
let pendingNegotiation = null;

function getContractTerms(player) {
  return { requestedSalary: Math.max(100, Math.round(player.cost * 0.006)), requiredPrestige: Math.min(95, Math.max(5, (player.overall - 64) * 3)) };
}

const transferColumns = [
  ["name", "Zawodnik"], ["flag", "Kraj"], ["position", "Pozycja"], ["team", "Drużyna"], ["league", "Liga"], ["overall", "OVR"],
  ["macro", "Macro"], ["micro", "Micro"], ["vision", "Wizja"], ["roams", "Roamy"],
  ["farming", "Farming"], ["reflex", "Reflex"], ["cost", "Cena"],
];

function renderSortHeader(key, label) {
  const active = transferSort.key === key;
  const arrow = active ? (transferSort.direction === "asc" ? "↑" : "↓") : "↕";
  return `<th><button class="transfer-sort ${active ? "transfer-sort--active" : ""}" data-transfer-sort="${key}" aria-label="Sortuj: ${label}" aria-pressed="${active}">${label}<span>${arrow}</span></button></th>`;
}

function renderTransfer() {
  const teams = [...new Set(transferPlayers.map((player) => player.team))];
  const leagues = [...new Set(transferPlayers.map((player) => player.league))];
  const positions = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];
  const visiblePlayers = transferPlayers.filter((player) =>
    !purchasedPlayers.has(transferPlayers.indexOf(player))
    &&
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
    const terms = getContractTerms(player);
    return `<tr><td><strong>${player.name}</strong><small>Prestiż ${terms.requiredPrestige}+</small></td><td><img class="country-flag" src="${player.flag}" title="${player.country}" alt="Flaga: ${player.country}" loading="lazy"></td><td><strong>${player.position}</strong></td><td>${player.team}</td><td>${player.league}</td><td class="rating-cell">${player.overall}</td><td>${player.macro}</td><td>${player.micro}</td><td>${player.vision}</td><td>${player.roams}</td><td>${player.farming}</td><td>${player.reflex}</td><td><strong>${window.clubEconomy.format(player.cost)}</strong></td><td><button class="upgrade-button transfer-buy" data-buy-player="${index}" ${unavailable ? "disabled" : ""}>Negocjuj</button></td></tr>`;
  }).join("");
  const negotiation = pendingNegotiation ? (() => {
    const player = transferPlayers[pendingNegotiation.index];
    const terms = getContractTerms(player);
    const prestige = window.getClubPrestige?.() || 10;
    return `<section class="contract-negotiation"><div><span>Negocjacje kontraktu</span><h3>${player.name} • ${player.overall} OVR</h3><p>Oczekiwania: <strong>${window.clubEconomy.format(terms.requestedSalary)} / mies.</strong> • wymagany prestiż <strong>${terms.requiredPrestige}</strong> • prestiż klubu <strong class="${prestige >= terms.requiredPrestige ? "positive" : "negative"}">${prestige}</strong></p></div><form data-contract-form><label>Miesięczna pensja<input type="number" name="salary" min="50" step="50" value="${pendingNegotiation.salary || terms.requestedSalary}" required></label><button class="primary-action">Złóż ofertę</button><button type="button" class="upgrade-button" data-cancel-contract>Anuluj</button></form></section>`;
  })() : "";
  return `<div class="management-board transfer-board ${pendingNegotiation ? "transfer-board--negotiating" : ""}">
    <header class="transfer-toolbar"><div><p class="eyebrow">Rynek transferowy</p><h2>${transferLeagueFilter === "all" ? "Wszystkie ligi" : transferLeagueFilter}</h2><div class="transfer-meta"><span class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></span><span>Prestiż: <strong>${window.getClubPrestige?.() || 10}</strong></span><span>${visiblePlayers.length} z ${transferPlayers.length - purchasedPlayers.size} dostępnych zawodników</span></div></div><div class="transfer-filters"><label><span>Szukaj</span><input data-transfer-search value="${transferSearch}" placeholder="Nazwa zawodnika"></label><label><span>Pozycja</span><select data-transfer-position><option value="all">Wszystkie pozycje</option>${positions.map((position) => `<option ${position === transferPositionFilter ? "selected" : ""}>${position}</option>`).join("")}</select></label><label><span>Liga</span><select data-transfer-league><option value="all">Wszystkie ligi</option>${leagues.map((league) => `<option ${league === transferLeagueFilter ? "selected" : ""}>${league}</option>`).join("")}</select></label><label><span>Drużyna</span><select data-transfer-team><option value="all">Wszystkie drużyny</option>${teams.map((team) => `<option ${team === transferTeamFilter ? "selected" : ""}>${team}</option>`).join("")}</select></label></div></header>
    <p class="transfer-notice ${transferMessage ? "" : "transfer-notice--hint"}" role="status">${transferMessage || "Wybierz zawodnika, wynegocjuj pensję i przekonaj go prestiżem klubu."}</p>${negotiation}
    <div class="transfer-table-wrap"><table class="finance-table transfer-table"><thead><tr>${transferColumns.map(([key, label]) => renderSortHeader(key, label)).join("")}<th>Zakup</th></tr></thead><tbody>${rows || `<tr><td colspan="14" class="transfer-empty">Brak zawodników spełniających kryteria.</td></tr>`}</tbody></table></div>
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
    if (!player) return;
    pendingNegotiation = { index, salary: getContractTerms(player).requestedSalary };
    transferMessage = `Rozpoczęto rozmowy z ${player.name}. Ustal miesięczną pensję.`;
    onChange();
  }));
  document.querySelector("[data-cancel-contract]")?.addEventListener("click", () => { pendingNegotiation = null; transferMessage = "Negocjacje anulowane."; onChange(); });
  document.querySelector("[data-contract-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const player = transferPlayers[pendingNegotiation?.index];
    if (!player) return;
    const salary = Math.max(0, Number(new FormData(event.currentTarget).get("salary")) || 0);
    const terms = getContractTerms(player);
    const prestige = window.getClubPrestige?.() || 10;
    pendingNegotiation.salary = salary;
    if (prestige < terms.requiredPrestige) {
      transferMessage = `${player.name} odrzuca ofertę. Klub ma ${prestige} prestiżu, a zawodnik oczekuje minimum ${terms.requiredPrestige}.`;
      onChange();
      return;
    }
    const salaryRatio = salary / terms.requestedSalary;
    const roll = [...`${player.name}-${salary}-${window.gameClock.day}`].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7) % 100;
    const acceptanceChance = Math.min(100, Math.round(20 + salaryRatio * 65 + Math.max(0, prestige - terms.requiredPrestige) * 1.5));
    if (salaryRatio < 0.7 || roll >= acceptanceChance) {
      transferMessage = `${player.name} odrzuca pensję ${window.clubEconomy.format(salary)}. Oczekuje około ${window.clubEconomy.format(terms.requestedSalary)} miesięcznie.`;
      onChange();
      return;
    }
    if (!window.clubEconomy.spend(player.cost)) { transferMessage = "Klubu nie stać na opłatę transferową."; onChange(); return; }
    purchasedPlayers.add(pendingNegotiation.index);
    window.addSquadPlayer(player, salary);
    pendingNegotiation = null;
    window.addMail({ id: `transfer-${player.name}`, from: "Dyrektor sportowy", subject: `Transfer zakończony: ${player.name}`, date: `Dzień ${window.gameClock.day} • 12:00`, body: `${player.name} (${player.position}, OVR ${player.overall}) podpisuje kontrakt. Transfer: ${window.clubEconomy.format(player.cost)}, pensja: ${window.clubEconomy.format(salary)} miesięcznie.` });
    transferMessage = `${player.name} zaakceptował kontrakt: ${window.clubEconomy.format(salary)} / mies.`;
    onChange();
  });
  document.querySelectorAll("[data-transfer-sort]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.transferSort;
    const defaultDirection = key === "name" || key === "flag" || key === "position" || key === "team" || key === "league" || key === "cost" ? "asc" : "desc";
    transferSort = transferSort.key === key
      ? { key, direction: transferSort.direction === "asc" ? "desc" : "asc" }
      : { key, direction: defaultDirection };
    onChange();
  }));
}

window.renderTransfer = renderTransfer;
window.setupTransfer = setupTransfer;
window.gameState.register("transfers", {
  get: () => ({ purchasedPlayers: [...purchasedPlayers], transferTeamFilter, transferLeagueFilter, transferPositionFilter, transferSearch, transferMessage, transferSort, pendingNegotiation }),
  set: (state) => {
    purchasedPlayers.clear(); (state.purchasedPlayers || []).forEach((index) => purchasedPlayers.add(index));
    transferTeamFilter = state.transferTeamFilter || "all"; transferLeagueFilter = state.transferLeagueFilter || "all"; transferPositionFilter = state.transferPositionFilter || "all";
    transferSearch = state.transferSearch || ""; transferMessage = state.transferMessage || ""; transferSort = state.transferSort || transferSort; pendingNegotiation = state.pendingNegotiation || null;
  },
});
