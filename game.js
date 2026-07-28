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

window.matchCenter = {
  activeMatch: null,
  lastMatch: null,
  start({ competition, opponent, day, section, onComplete }) {
    if (this.activeMatch) return;
    this.activeMatch = {
      competition, opponent, day, section, onComplete, stage: "dragon", advantage: 0,
      ourKills: 2 + (day % 3), opponentKills: 2, events: [[5, "Spokojny początek. Obie drużyny farmią i szukają przewagi."]],
    };
  },
  choose(choice) {
    const match = this.activeMatch;
    if (!match) return;
    if (match.stage === "dragon") {
      if (choice === "fight") {
        const success = (match.day + match.ourKills) % 3 !== 0;
        match.advantage += success ? 2 : -2;
        match.ourKills += success ? 3 : 1;
        match.opponentKills += success ? 1 : 3;
        match.events.push([10, success ? "Wygrywamy walkę i zdobywamy smoka. Drużyna otrzymuje trwałe wzmocnienie." : `${match.opponent} kontruje nas przy smoku i zabiera cel.`]);
      } else {
        match.advantage -= 1;
        match.events.push([10, `Oddajemy smoka bez walki i wymieniamy go na farmę oraz bezpieczne wieże.`]);
      }
      match.stage = "baron";
      return;
    }
    if (match.stage === "baron") {
      if (choice === "baron") {
        const success = match.advantage >= 0 || (match.day % 2 === 0);
        match.advantage += success ? 3 : -3;
        match.ourKills += success ? 2 : 0;
        match.opponentKills += success ? 0 : 3;
        match.events.push([23, success ? "Kontrolujemy wizję, zabezpieczamy Barona i rozpoczynamy oblężenie." : `${match.opponent} kradnie Barona i wygrywa walkę w pitcie.`]);
      } else if (choice === "bait") {
        const success = match.advantage >= -1;
        match.advantage += success ? 2 : -1;
        match.ourKills += success ? 2 : 0;
        match.opponentKills += success ? 0 : 1;
        match.events.push([23, success ? "Udana pułapka przy Baronie daje nam dwa zabójstwa." : "Rywal rozpoznaje pułapkę, więc wycofujemy się bez Barona."]);
      } else {
        match.advantage += 1;
        match.events.push([23, "Nie ryzykujemy Barona. Czyścimy wizję i skalujemy kompozycję."]);
      }
      match.stage = "nexus";
      return;
    }
    const modifiers = { teamfight: 1, splitpush: match.advantage >= 0 ? 2 : -1, defend: match.advantage < 0 ? 2 : 0 };
    match.advantage += modifiers[choice] ?? 0;
    const won = match.advantage >= 1;
    match.ourKills += won ? 4 : 1;
    match.opponentKills += won ? 1 : 4;
    const finalTexts = {
      teamfight: won ? "Wygrywamy decydujący teamfight i niszczymy Nexus." : "Przegrywamy walkę 5 na 5, a rywal kończy mecz.",
      splitpush: won ? "Splitpush zmusza rywala do podziału, dzięki czemu niszczymy Nexus." : "Rywal wymusza walkę 5 na 4 i kończy grę przed naszym splitpushem.",
      defend: won ? "Skuteczna obrona wyczerpuje rywala. Kontratak kończy mecz." : "Nie utrzymujemy bazy i nasz Nexus upada.",
    };
    match.events.push([34 + (match.day % 5), finalTexts[choice]]);
    this.lastMatch = { ...match, won, stage: "finished" };
    this.activeMatch = null;
    match.onComplete(won, this.lastMatch);
  },
  render(competition) {
    const match = this.activeMatch?.competition === competition ? this.activeMatch : this.lastMatch?.competition === competition ? this.lastMatch : null;
    if (!match) return "";
    const events = match.events.map(([minute, description]) => `<li><strong>${minute}:00</strong><span>${description}</span></li>`).join("");
    const decisions = match.stage === "dragon"
      ? '<div class="match-decisions"><button data-match-choice="fight">Walcz o smoka<small>Ryzyko walki 5v5, ale trwałe wzmocnienie</small></button><button data-match-choice="retreat">Oddaj smoka<small>Bezpieczna farma i brak ryzyka śmierci</small></button></div>'
      : match.stage === "baron"
        ? '<div class="match-decisions"><button data-match-choice="baron">Rozpocznij Barona<small>Duża nagroda i duże ryzyko kradzieży</small></button><button data-match-choice="bait">Zastaw pułapkę<small>Wykorzystaj kontrolę wizji</small></button><button data-match-choice="scale">Wycofaj się<small>Skaluj i broń wizji</small></button></div>'
        : match.stage === "nexus"
          ? '<div class="match-decisions"><button data-match-choice="teamfight">Wymuś teamfight<small>Pełna walka 5v5</small></button><button data-match-choice="splitpush">Zagraj splitpush<small>Wywieraj presję na dwóch liniach</small></button><button data-match-choice="defend">Broń bazy<small>Szukaj błędu przeciwnika</small></button></div>'
          : '<div class="match-decisions match-decisions--finished"><button data-dismiss-match="true">Zamknij relację<small>Wróć do tabeli i terminarza</small></button></div>';
    const state = this.activeMatch ? `Decyzja: ${match.stage === "dragon" ? "smok" : match.stage === "baron" ? "Baron" : "końcówka"}` : match.won ? "ZWYCIĘSTWO" : "PORAŻKA";
    return `<section class="match-simulation match-simulation--${this.activeMatch ? "live" : "finished"}"><div class="section-heading"><span>Mecz na żywo • Dzień ${match.day}</span><h4>${match.competition}</h4></div><div class="match-score"><div><span>Nasz zespół</span><strong>${match.ourKills}</strong></div><b>${state}</b><div><span>${match.opponent}</span><strong>${match.opponentKills}</strong></div></div>${decisions}<ol class="match-timeline">${events}</ol></section>`;
  },
  setup(onChange) {
    document.querySelectorAll("[data-match-choice]").forEach((button) => button.addEventListener("click", () => {
      const scrollContainer = document.querySelector(".management-board");
      const scrollTop = scrollContainer?.scrollTop || 0;
      this.choose(button.dataset.matchChoice);
      onChange();
      const nextContainer = document.querySelector(".management-board");
      if (nextContainer) nextContainer.scrollTop = scrollTop;
      document.querySelector(".match-simulation")?.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
    document.querySelector("[data-dismiss-match]")?.addEventListener("click", () => {
      this.lastMatch = null;
      onChange();
    });
  },
};
