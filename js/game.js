window.gameClock = {
  day: 1,
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
  },
  nextDay() {
    if (window.matchCenter?.activeMatch) return false;
    this.day += 1;
    this.listeners.forEach((listener) => listener(this.day));
    return true;
  },
};

window.gameState = {
  modules: new Map(),
  saveTimer: null,
  loading: false,
  register(name, handler) { handler.defaultState = JSON.parse(JSON.stringify(handler.get())); this.modules.set(name, handler); },
  snapshot() { return Object.fromEntries([...this.modules].map(([name, handler]) => [name, handler.get()])); },
  schedule() {
    if (this.loading) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.save(), 250);
  },
  async save() {
    try { await fetch("/api/game-state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: this.snapshot() }) }); }
    catch (error) { console.error("Nie udało się zapisać gry:", error); }
  },
  async load() {
    this.loading = true;
    try {
      const response = await fetch("/api/game-state");
      if (!response.ok) return;
      const { state } = await response.json();
      this.modules.forEach((handler, name) => handler.set(state?.[name] ?? JSON.parse(JSON.stringify(handler.defaultState))));
    } finally { this.loading = false; }
  },
  async reset() {
    this.loading = true;
    try {
      this.modules.forEach((handler) => handler.set(JSON.parse(JSON.stringify(handler.defaultState))));
      await fetch("/api/game-state", { method: "DELETE" });
    } finally { this.loading = false; }
  },
};

window.gameState.register("clock", { get: () => ({ day: window.gameClock.day }), set: (state) => { window.gameClock.day = Number(state.day) || 1; } });

window.matchCenter = {
  activeMatch: null,
  lastMatch: null,
  scenarios: {
    opening: [
      { id: "invade", title: "Rywal grupuje się w naszej dżungli", minute: 2, options: [
        { id: "counter", title: "Kontr-invade górą", note: "Odbij tempo po przeciwnej stronie mapy", risk: "średnie", modifier: 2, success: 2, failure: -1, text: ["Czytamy ruch rywala i zabieramy jego górne obozy.", "Rywal przewiduje kontrę i nasz jungler traci tempo."] },
        { id: "collapse", title: "Zamknij pułapkę", note: "Pięciu graczy walczy o pierwszą krew", risk: "wysokie", modifier: -7, success: 3, failure: -2, kills: 2, text: ["Pułapka działa — zdobywamy pierwszą krew i dwa flashe.", "Spóźniona rotacja kończy się pierwszą krwią dla rywala."] },
        { id: "cover", title: "Broń wejść", note: "Bezpieczny start bez utraty zasobów", risk: "niskie", modifier: 10, success: 1, failure: 0, text: ["Zachowujemy zimną krew i rozpoczynamy linie zgodnie z planem.", "Oddajemy jeden obóz, ale linie pozostają bezpieczne."] },
      ]},
      { id: "laneswap", title: "Przeciwnik rozpoczyna lane swap", minute: 3, options: [
        { id: "mirror", title: "Odpowiedz zmianą linii", note: "Utrzymaj równy układ mapy", risk: "niskie", modifier: 8, success: 1, failure: -1, text: ["Szybka odpowiedź neutralizuje plan przeciwnika.", "Zmiana trwa za długo i tracimy dwie fale stworów."] },
        { id: "dive", title: "Wymuś dive na topie", note: "Przewaga liczebna za cenę ryzyka", risk: "wysokie", modifier: -9, success: 3, failure: -3, kills: 2, tower: 1, text: ["Perfekcyjny dive daje zabójstwa i pierwszą wieżę.", "Teleport rywala odwraca dive — tracimy dwóch graczy."] },
        { id: "freeze", title: "Zamroź dolną aleję", note: "Inwestycja w farmę naszego carry", risk: "średnie", modifier: 4, success: 2, failure: -1, text: ["Carry buduje dużą przewagę w stworach.", "Rywal łamie freeze i odzyskuje kontrolę rzeki."] },
      ]},
    ],
    early: [
      { id: "dragon", title: "Pierwszy smok pojawia się na mapie", minute: 9, objective: "smok", options: [
        { id: "fight", title: "Rozpocznij walkę", note: "Pełne 5v5 o trwałe wzmocnienie", risk: "wysokie", modifier: -5, success: 3, failure: -3, kills: 3, objective: "dragon", text: ["Wygrywamy walkę w rzece i zabezpieczamy smoka.", "Rywal kontruje wejście i zabiera smoka po walce."] },
        { id: "trade", title: "Wymień cel na Herolda", note: "Presja wieżą po drugiej stronie mapy", risk: "niskie", modifier: 9, success: 2, failure: 0, tower: 1, objective: "herald", text: ["Herold taranuje wieżę i daje nam zastrzyk złota.", "Zdobywamy Herolda, ale rywal dobrze broni wieży."] },
        { id: "steal", title: "Spróbuj ukraść smoka", note: "Jungler wchodzi sam, reszta farmi", risk: "bardzo wysokie", modifier: -16, success: 4, failure: -2, objective: "dragon", text: ["Niesamowity Smite! Kradniemy smoka i uciekamy.", "Próba kradzieży nie wychodzi, jungler ginie w pitcie."] },
      ]},
      { id: "botpressure", title: "Botlane rywala gra bez flashów", minute: 11, options: [
        { id: "gank", title: "Zagraj dive 4 na 2", note: "Przenieś mid i jungle na dół", risk: "średnie", modifier: 1, success: 3, failure: -2, kills: 2, tower: 1, text: ["Czysty dive otwiera dolną aleję.", "Rywal kupuje czas, a jego teleport odwraca akcję."] },
        { id: "plates", title: "Graj o płyty na midzie", note: "Pewne złoto bez dużej walki", risk: "niskie", modifier: 11, success: 1, failure: 0, text: ["Zgarniamy płyty i spokojnie powiększamy zasoby.", "Presja daje mniej złota, niż zakładaliśmy."] },
        { id: "vision", title: "Odkrój ich od dżungli", note: "Wizja przygotuje następną akcję", risk: "średnie", modifier: 5, success: 2, failure: -1, text: ["Głęboka wizja pozwala złapać supporta rywali.", "Ward zostaje wykryty i tracimy kontrolę rzeki."] },
      ]},
    ],
    middle: [
      { id: "herald", title: "Herold otwiera drogę do środkowej wieży", minute: 17, options: [
        { id: "siege", title: "Zgrupuj się na midzie", note: "Oblężenie i walka o wieżę", risk: "średnie", modifier: 1, success: 3, failure: -2, tower: 1, kills: 2, text: ["Herold uderza, a my wygrywamy walkę pod wieżą.", "Rywal czyści Herolda i karze nas za zbyt długie oblężenie."] },
        { id: "side", title: "1-3-1 na bocznych liniach", note: "Rozciągnij obronę przeciwnika", risk: "średnie", modifier: 4, comfort: true, success: 2, failure: -2, tower: 1, text: ["Boczne linie pękają pod jednoczesną presją.", "Nasz splitpusher zostaje złapany bez teleportu."] },
        { id: "ambush", title: "Oddaj Herolda i zastaw pułapkę", note: "Poluj na rotujących graczy", risk: "wysokie", modifier: -3, success: 3, failure: -2, kills: 3, text: ["Rywal wchodzi bez wizji — pułapka daje trzy zabójstwa.", "Przeciwnik sprawdza krzaki i odwraca zasadzkę."] },
      ]},
      { id: "soul", title: "Walka o punkt duszy smoka", minute: 20, objective: "smok", options: [
        { id: "setup", title: "Ustaw wizję 60 sekund wcześniej", note: "Kontroluj wejścia do rzeki", risk: "niskie", modifier: 10, success: 2, failure: -1, objective: "dragon", text: ["Pełna kontrola rzeki daje nam smoka bez strat.", "Rywal obchodzi wizję i zmusza nas do odwrotu."] },
        { id: "rush", title: "Szybko zabij smoka", note: "Cel zanim rywal zdąży się zebrać", risk: "wysokie", modifier: -7, success: 4, failure: -3, objective: "dragon", text: ["Tempo zaskakuje rywala — smok jest nasz.", "Brakuje obrażeń; rywal wchodzi do pitu i wygrywa walkę."] },
        { id: "crossmap", title: "Atakuj bazę górą", note: "Oddaj smoka za wieże i mapę", risk: "średnie", modifier: 4, success: 3, failure: -1, tower: 2, text: ["Cross-map działa: bierzemy dwie wieże i inhibitor.", "Rotacja jest spóźniona i zyskujemy tylko jedną falę."] },
      ]},
    ],
    late: [
      { id: "baron", title: "Baron jest odsłonięty, rywal nie ma wizji", minute: 27, objective: "baron", options: [
        { id: "rush", title: "Rozpocznij Barona", note: "Szybki cel, ale ryzyko kradzieży", risk: "wysokie", modifier: -10, success: 4, failure: -4, objective: "baron", text: ["Zabezpieczamy Barona tuż przed wejściem rywala.", "Baron zostaje skradziony, a pit zamienia się w pułapkę."] },
        { id: "bait", title: "Zgaś wizję i czekaj", note: "Zmuś przeciwnika do wejścia w pułapkę", risk: "średnie", modifier: 5, success: 3, failure: -2, kills: 3, text: ["Łapiemy trzech graczy i bierzemy Barona po walce.", "Rywal nie daje się sprowokować i odzyskuje teren."] },
        { id: "turn", title: "Zacznij cel i odwróć się do walki", note: "Skoordynowany engage zamiast Smite'a", risk: "wysokie", modifier: -2, success: 4, failure: -3, kills: 4, text: ["Idealny zwrot od Barona kończy się ace'em.", "Dzielimy obrażenia między cel i rywali, przegrywając starcie."] },
        { id: "scale", title: "Reset i zakup przedmiotów", note: "Nie podejmuj walki bez przewagi", risk: "niskie", modifier: 12, success: 1, failure: 0, text: ["Wracamy na mapę z przewagą przedmiotów.", "Rywal wykorzystuje reset, by przejąć wizję."] },
      ]},
      { id: "elder", title: "Starszy Smok rozstrzygnie późną grę", minute: 31, objective: "elder", options: [
        { id: "front", title: "Walcz od frontu", note: "Chroń carry i graj standardowe 5v5", risk: "średnie", modifier: 2, success: 4, failure: -4, kills: 4, objective: "elder", text: ["Carry pozostaje nietknięty — wygrywamy walkę o Starszego.", "Rywal przebija pierwszą linię i zabiera wzmocnienie."] },
        { id: "flank", title: "Szukaj głębokiej flanki", note: "Ryzykowne wejście prosto na carry", risk: "wysokie", modifier: -7, comfort: true, success: 5, failure: -4, kills: 4, objective: "elder", text: ["Flanka rozrywa ustawienie rywala i Starszy jest nasz.", "Flanka zostaje zauważona, zanim drużyna może dołączyć."] },
        { id: "backdoor", title: "Wyślij gracza do backdooru", note: "Wyścig Starszy Smok kontra Nexus", risk: "bardzo wysokie", modifier: -13, success: 6, failure: -5, tower: 2, text: ["Rywal reaguje za późno — otwieramy Nexus.", "Teleport zostaje przerwany, a drużyna przegrywa 4 na 5."] },
      ]},
    ],
    finish: [
      { id: "nexus", title: "Ostatnia decyzja — baza rywala jest otwarta", minute: 36, final: true, options: [
        { id: "teamfight", title: "Wymuś teamfight 5v5", note: "Postaw wszystko na mechanikę drużyny", risk: "średnie", modifier: 0, success: 2, failure: -2 },
        { id: "splitpush", title: "Zagraj splitpush", note: "Presja na dwóch liniach i teleport", risk: "wysokie", modifier: 3, comfort: true, success: 3, failure: -3 },
        { id: "pick", title: "Poluj na pojedynczy cel", note: "Wizja i cierpliwość zamiast pełnej walki", risk: "niskie", modifier: 7, success: 2, failure: -2 },
        { id: "defend", title: "Broń i kontratakuj", note: "Najlepsze, gdy jesteśmy z tyłu", risk: "średnie", modifier: 0, comeback: true, success: 3, failure: -3 },
      ]},
    ],
  },
  start({ competition, opponent, opponentStrength, day, section, onComplete }) {
    if (this.activeMatch) return;
    const profile = window.getSquadMatchProfile();
    const staffBonus = window.getStaffMatchBonus?.() || 0;
    const ourStrength = profile.strength + staffBonus;
    const winChance = Math.max(18, Math.min(82, Math.round(50 + (ourStrength - opponentStrength) * 2.2)));
    this.activeMatch = {
      competition, opponent, day, section, onComplete, stage: "opening", stageIndex: 0, advantage: 0, winChance,
      ourStrength: Math.round(ourStrength), opponentStrength, comfort: profile.comfort,
      ourKills: 1 + (this.seed(`${competition}-${day}-us`) % 4), opponentKills: 1 + (this.seed(`${opponent}-${day}`) % 4),
      ourTowers: 0, opponentTowers: 0, ourObjectives: [], opponentObjectives: [],
      scenarioIndexes: ["opening", "early", "middle", "late"].map((phase, index) => this.seed(`${competition}-${opponent}-${day}-${phase}`) % this.scenarios[phase].length),
      events: [{ minute: 0, type: "info", description: `Wchodzimy na Summoner's Rift. Siła ${Math.round(ourStrength)} vs ${opponentStrength}, komfort ról ${profile.comfort}%.` }],
    };
  },
  seed(value) {
    return [...value].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7);
  },
  succeeds(match, label, modifier = 0) {
    const roll = this.seed(`${match.competition}-${match.opponent}-${match.day}-${label}`) % 100;
    return roll < Math.max(8, Math.min(92, match.winChance + modifier + match.advantage * 7));
  },
  choose(choice) {
    const match = this.activeMatch;
    if (!match) return;
    const scenario = this.currentScenario(match);
    const option = scenario.options.find((item) => item.id === choice);
    if (!option) return;
    let modifier = option.modifier || 0;
    if (option.comfort) modifier += match.comfort >= 80 ? 5 : -5;
    if (option.comeback) modifier += match.advantage < 0 ? 9 : -4;
    const success = this.succeeds(match, `${match.stageIndex}-${scenario.id}-${choice}`, modifier);
    match.advantage += success ? option.success : option.failure;
    const kills = option.kills || (scenario.final ? 4 : 1);
    match.ourKills += success ? kills : Math.min(1, kills);
    match.opponentKills += success ? Math.min(1, kills) : kills;
    if (option.tower) {
      if (success) match.ourTowers += option.tower;
      else match.opponentTowers += option.tower;
    }
    if (option.objective) (success ? match.ourObjectives : match.opponentObjectives).push(option.objective);
    const ambient = this.ambientEvent(match, scenario.minute - 2);
    if (ambient) match.events.push(ambient);
    if (!scenario.final) {
      match.events.push({ minute: scenario.minute, type: success ? "success" : "danger", description: option.text[success ? 0 : 1] });
      match.stageIndex += 1;
      match.stage = ["opening", "early", "middle", "late", "finish"][match.stageIndex];
      return;
    }
    const won = success;
    match.events.push({ minute: scenario.minute + (match.day % 4), type: won ? "success" : "danger", description: won ? "Wygrywamy decydującą akcję i niszczymy Nexus!" : `${match.opponent} wygrywa decydującą akcję i niszczy nasz Nexus.` });
    this.lastMatch = { ...match, won, stage: "finished" };
    this.activeMatch = null;
    window.recordCareerMatch?.(won, this.lastMatch);
    match.onComplete(won, this.lastMatch);
  },
  currentScenario(match) {
    if (match.stage === "finish") return this.scenarios.finish[0];
    return this.scenarios[match.stage][match.scenarioIndexes[match.stageIndex]];
  },
  ambientEvent(match, minute) {
    const pool = match.advantage >= 0
      ? ["Nasze linie przepychają fale i otwierają drogę do rzeki.", "Support usuwa wizję rywala; przejmujemy tempo mapy.", "Carry kończy ważny przedmiot przed przeciwnikiem."]
      : ["Rywal naciska boczne linie i zmusza nas do reakcji.", "Tracimy dwa wardy w dżungli, mapa robi się ciemna.", "Przeciwnik wraca na mapę z przewagą przedmiotów."];
    const description = pool[this.seed(`${match.opponent}-${match.day}-${minute}`) % pool.length];
    return { minute: Math.max(1, minute), type: "neutral", description };
  },
  render(competition) {
    const match = this.activeMatch?.competition === competition ? this.activeMatch : this.lastMatch?.competition === competition ? this.lastMatch : null;
    if (!match) return "";
    const events = match.events.map((event) => { const normalized = Array.isArray(event) ? { minute: event[0], description: event[1], type: "neutral" } : event; return `<li class="match-event--${normalized.type}"><strong>${normalized.minute}:00</strong><span>${normalized.description}</span></li>`; }).reverse().join("");
    const scenario = this.activeMatch ? this.currentScenario(match) : null;
    const decisions = scenario
      ? `<div class="match-call"><span>SYTUACJA NA MAPIE</span><h5>${scenario.title}</h5><p>Wybierz reakcję sztabu — poziom ryzyka wpływa na szansę powodzenia.</p></div><div class="match-decisions">${scenario.options.map((option) => `<button data-match-choice="${option.id}"><span>${option.title}<em>${option.risk}</em></span><small>${option.note}</small></button>`).join("")}</div>`
      : '<div class="match-decisions match-decisions--finished"><button data-dismiss-match="true"><span>Zamknij relację</span><small>Wróć do tabeli i terminarza</small></button></div>';
    const stageIndex = Number(match.stageIndex) || 0;
    const state = this.activeMatch ? `${["OTWARCIE", "WCZESNA GRA", "ŚRODEK GRY", "PÓŹNA GRA", "FINAŁ"][stageIndex]} • ${scenario.minute}:00` : match.won ? "ZWYCIĘSTWO" : "PORAŻKA";
    const currentChance = Math.max(5, Math.min(95, match.winChance + match.advantage * 7));
    const goldLead = match.advantage * 850;
    const objectiveIcons = (items) => items.length ? items.map((item) => `<i title="${item}">${item === "dragon" ? "◆" : item === "baron" ? "⬢" : item === "elder" ? "✦" : "◈"}</i>`).join("") : "—";
    return `<section class="match-simulation match-simulation--${this.activeMatch ? "live" : "finished"}"><div class="match-livebar"><span><i></i> ${this.activeMatch ? "LIVE" : "KONIEC"} • Dzień ${match.day}</span><b>${state}</b><strong>${currentChance}% szans</strong></div><div class="section-heading"><span>${match.competition}</span><h4>Nasz zespół vs ${match.opponent}</h4></div><div class="match-arena"><div class="match-map" aria-label="Taktyczna mapa Summoner's Rift"><img src="assets/summoners-rift.svg" alt="Summoner's Rift — aleje, dżungla, rzeka, Smok i Baron"><b class="map-unit map-unit--us" style="--progress:${24 + stageIndex * 11 + Math.max(-8, match.advantage * 2)}%">●</b><b class="map-unit map-unit--them" style="--progress:${76 - stageIndex * 8 - Math.min(8, match.advantage * 2)}%">●</b></div><div class="match-stats"><div><span>Zabójstwa</span><strong>${match.ourKills} <small>—</small> ${match.opponentKills}</strong></div><div><span>Wieże</span><strong>${match.ourTowers || 0} <small>—</small> ${match.opponentTowers || 0}</strong></div><div><span>Przewaga złota</span><strong class="${goldLead >= 0 ? "positive" : "negative"}">${goldLead >= 0 ? "+" : ""}${goldLead.toLocaleString("pl-PL")}</strong></div><div><span>Cele</span><strong class="match-objectives">${objectiveIcons(match.ourObjectives || [])} <small>vs</small> ${objectiveIcons(match.opponentObjectives || [])}</strong></div></div></div>${decisions}<div class="match-feed"><h5>Relacja na żywo</h5><ol class="match-timeline">${events}</ol></div></section>`;
  },
  setup(onChange) {
    document.querySelectorAll("[data-match-choice]").forEach((button) => button.addEventListener("click", () => {
      const scrollContainer = button.closest(".hero-panel");
      const matchPanel = button.closest(".match-simulation");
      const matchViewportOffset = scrollContainer && matchPanel ? matchPanel.offsetTop - scrollContainer.scrollTop : null;
      this.choose(button.dataset.matchChoice);
      onChange();
      const nextContainer = document.querySelector(".hero-panel");
      const nextMatchPanel = nextContainer?.querySelector(".match-simulation");
      if (nextContainer && nextMatchPanel && matchViewportOffset !== null) nextContainer.scrollTop = Math.max(0, nextMatchPanel.offsetTop - matchViewportOffset);
    }));
    document.querySelector("[data-dismiss-match]")?.addEventListener("click", () => {
      this.lastMatch = null;
      onChange();
    });
  },
};

window.gameState.register("matches", { get: () => ({ lastMatch: window.matchCenter.lastMatch }), set: (state) => { window.matchCenter.lastMatch = state.lastMatch || null; window.matchCenter.activeMatch = null; } });

window.getHomeStatus = function getHomeStatus() {
  const nextMatch = window.getLeagueNextMatch?.() || window.getTournamentNextMatch?.() || { value: "Brak zaplanowanego meczu", note: "Dołącz do ligi lub turnieju" };
  const profile = window.getSquadMatchProfile?.() || { comfort: 70 };
  const resultModifier = window.matchCenter.lastMatch ? (window.matchCenter.lastMatch.won ? 8 : -8) : 0;
  const morale = Math.max(35, Math.min(95, Math.round(62 + profile.comfort * 0.2 + resultModifier)));
  return { nextMatch, morale: { value: `${morale}%`, note: morale >= 80 ? "Świetna atmosfera" : morale >= 65 ? "Stabilna atmosfera" : "Zespół potrzebuje zwycięstwa" } };
};
