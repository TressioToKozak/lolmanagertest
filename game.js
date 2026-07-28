window.gameClock = {
  day: 1,
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
  },
  nextDay() {
    this.day += 1;
    this.listeners.forEach((listener) => listener(this.day));
  },
};

window.matchCenter = {
  lastMatch: null,
  simulate({ competition, opponent, won, day }) {
    const ourScore = won ? 14 + (day % 7) : 7 + (day % 5);
    const opponentScore = won ? 8 + (day % 5) : 15 + (day % 6);
    const events = [
      [3, won ? "Pierwsza krew dla naszego junglera" : `${opponent} zdobywa pierwszą krew`],
      [9, won ? "Wygrywamy walkę o pierwszego smoka" : `${opponent} przejmuje pierwszego smoka`],
      [17, `Stan zabójstw: ${Math.round(ourScore * 0.45)}–${Math.round(opponentScore * 0.45)}`],
      [24, won ? "Udany teamfight i Baron dla naszego zespołu" : `${opponent} wygrywa walkę przy Baronie`],
      [31 + (day % 5), won ? "Niszczymy Nexus rywala" : "Nasz Nexus zostaje zniszczony"],
    ];
    this.lastMatch = { competition, opponent, won, day, ourScore, opponentScore, events };
    return this.lastMatch;
  },
  render(competition) {
    if (!this.lastMatch || this.lastMatch.competition !== competition) return "";
    const match = this.lastMatch;
    const events = match.events.map(([minute, description]) => `<li><strong>${minute}:00</strong><span>${description}</span></li>`).join("");
    return `<section class="match-simulation"><div class="section-heading"><span>Symulacja ostatniego meczu • Dzień ${match.day}</span><h4>${match.competition}</h4></div><div class="match-score"><div><span>Nasz zespół</span><strong>${match.ourScore}</strong></div><b>${match.won ? "ZWYCIĘSTWO" : "PORAŻKA"}</b><div><span>${match.opponent}</span><strong>${match.opponentScore}</strong></div></div><ol class="match-timeline">${events}</ol></section>`;
  },
};
