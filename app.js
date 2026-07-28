const sections = {
  home: {
    eyebrow: "Season 2026 • Preseason",
    title: "Welcome, Coach",
    action: "Start career",
    tag: "Build your legacy",
    heading: "LoL eSport Manager",
    description:
      "Zarządzaj składem, sztabem, transferami i finansami klubu. Przygotuj drużynę do lig, turniejów oraz walki o międzynarodowe trofea.",
    cards: [
      ["Next match", "Spring Split Opener", "Za 3 dni • Best of 1"],
      ["Team morale", "87%", "Pozytywna atmosfera"],
      ["Budget", "€2.4M", "Gotowe na transfery"],
    ],
  },
  mailbox: {
    eyebrow: "Club communication",
    title: "Mailbox",
    action: "Compose reply",
    tag: "3 unread messages",
    heading: "Inbox",
    description:
      "Sprawdzaj wiadomości od zarządu, zawodników, sponsorów oraz organizatorów rozgrywek.",
    cards: [
      ["Board", "Cele sezonu", "Awans do play-offów i dodatni budżet"],
      ["Player", "Prośba o rozmowę", "Midlaner chce omówić plan treningowy"],
      ["League", "Media day", "Obowiązkowa sesja zdjęciowa w piątek"],
    ],
  },
  squad: {
    eyebrow: "Team roster",
    title: "Squad",
    action: "Auto best five",
    tag: "Drag & drop lineup",
    heading: "Skład",
    description:
      "Przeciągaj zawodników między rolami i ławką. Upuszczenie gracza na zajęty slot zamienia ich miejscami, a puste sloty pozwalają zdjąć zawodnika z pierwszej piątki.",
    layout: "squad",
  },
  staff: {
    eyebrow: "Backroom team",
    title: "Staff",
    action: "Hire staff",
    tag: "Performance team",
    heading: "Sztab",
    description:
      "Zarządzaj trenerami, analitykami i psychologiem, którzy pomagają drużynie rozwijać taktykę oraz mental.",
    cards: [
      ["Head coach", "Marta Kowalska", "Strategia draftu • 92"],
      ["Analyst", "Oskar Lewandowski", "VOD review • 87"],
      ["Psychologist", "Ewa Mazur", "Mental reset • 84"],
    ],
  },
  gamingHome: {
    eyebrow: "Club facilities",
    title: "Gaming Home",
    action: "Upgrade base",
    tag: "Training center",
    heading: "Gaming house",
    description:
      "Rozwijaj bazę treningową, pokoje odnowy, stanowiska PC i przestrzeń do analizy po scrimach.",
    cards: [
      ["Scrim room", "Level 3", "+8% efektywności treningu"],
      ["Recovery zone", "Level 2", "Szybsza regeneracja morale"],
      ["Analytics lab", "Level 1", "Odblokowane podstawowe raporty"],
    ],
  },
  transfer: {
    eyebrow: "Market window",
    title: "Transfer",
    action: "Make offer",
    tag: "Open market",
    heading: "Transfery",
    description:
      "Negocjuj kontrakty, sprzedawaj rezerwowych i poluj na talenty, które podniosą poziom drużyny.",
    cards: [
      ["Target", "Lee \"Spark\" Min", "Mid • €640k buyout"],
      ["Offer", "Support prospect", "Kontrakt 2 lata • w trakcie"],
      ["Sale", "Academy ADC", "Zainteresowanie 3 klubów"],
    ],
  },
  scouting: {
    eyebrow: "Talent network",
    title: "Scouting",
    action: "Send scout",
    tag: "Hidden gems",
    heading: "Scouting",
    description:
      "Wysyłaj skautów do lig regionalnych i akademii, aby znaleźć przyszłe gwiazdy zanim zrobi to konkurencja.",
    cards: [
      ["Region", "Korea Challengers", "2 raporty gotowe jutro"],
      ["Prospect", "Toplaner 17 lat", "Potencjał A-"],
      ["Scout", "Anna Wiśniewska", "Specjalizacja: mikro mechanika"],
    ],
  },
  tournaments: {
    eyebrow: "Competition calendar",
    title: "Tournaments",
    action: "Register team",
    tag: "Upcoming events",
    heading: "Turnieje",
    description:
      "Wybieraj turnieje, planuj bootcampy i pilnuj, aby zawodnicy byli w szczycie formy na najważniejsze mecze.",
    cards: [
      ["Cup", "Rift Masters", "Start za 18 dni • Prize €250k"],
      ["Qualifier", "EU Invitational", "Zapisy otwarte"],
      ["Bootcamp", "Warszawa", "7 dni przed play-offami"],
    ],
  },
  leagues: {
    eyebrow: "League overview",
    title: "Leagues",
    action: "View table",
    tag: "Spring split",
    heading: "Ligi",
    description:
      "Śledź terminarz, tabelę, formę rywali i punkty potrzebne do awansu do fazy play-off.",
    cards: [
      ["Position", "3rd place", "Bilans 6-3"],
      ["Next rival", "Dragon Forge", "Agresywny jungle pathing"],
      ["Playoffs", "72% chance", "Według aktualnej symulacji"],
    ],
  },
  finances: {
    eyebrow: "Club economy",
    title: "Finances",
    action: "Open ledger",
    tag: "Financial control",
    heading: "Finanse",
    description:
      "Kontroluj budżet, pensje, premie za wyniki i miesięczny przepływ gotówki klubu.",
    cards: [
      ["Balance", "€2.4M", "Dostępne środki"],
      ["Monthly wages", "€310k", "68% limitu płac"],
      ["Projected profit", "+€180k", "Prognoza na koniec splitu"],
    ],
  },
  sponsors: {
    eyebrow: "Commercial deals",
    title: "Sponsors",
    action: "Negotiate deal",
    tag: "Partner portfolio",
    heading: "Sponsorzy",
    description:
      "Podpisuj umowy sponsorskie, realizuj cele marketingowe i zwiększaj prestiż organizacji.",
    cards: [
      ["Main sponsor", "HyperGear", "€900k rocznie"],
      ["Objective", "Top 4 league", "Bonus €120k"],
      ["New lead", "Energy drink brand", "Wymaga 80+ morale"],
    ],
  },
};

const content = document.querySelector("#game-content");
const navItems = document.querySelectorAll(".main-nav__item");
const squadPlayers = {
  stone: { name: 'Kamil "Stone" Wójcik', role: "TOP", style: "Tank specialist", rating: 82 },
  path: { name: 'Adam "Path" Nowak', role: "JUNGLE", style: "Early gank style", rating: 88 },
  nova: { name: 'Michał "Nova" Zieliński', role: "MID", style: "Control mage", rating: 91 },
  arrow: { name: 'Piotr "Arrow" Lis', role: "ADC", style: "Late game carry", rating: 86 },
  ward: { name: 'Jan "Ward" Kowal', role: "SUPPORT", style: "Shotcaller", rating: 89 },
  flex: { name: 'Bartosz "Flex" Grabowski', role: "TOP / JUNGLE", style: "Rezerwowy front line", rating: 76 },
  pulse: { name: 'Tomasz "Pulse" Wrona', role: "MID / ADC", style: "Mechaniczny talent", rating: 79 },
};

const squadSlots = {
  top: "stone",
  jungle: "path",
  mid: "nova",
  adc: "arrow",
  support: "ward",
  reserve1: "flex",
  reserve2: "pulse",
  reserve3: null,
};

const startingSlots = ["top", "jungle", "mid", "adc", "support"];
const slotLabels = {
  top: "TOP",
  jungle: "JUNGLE",
  mid: "MID",
  adc: "ADC",
  support: "SUPPORT",
  reserve1: "REZERWA 1",
  reserve2: "REZERWA 2",
  reserve3: "WOLNY SLOT",
};


function renderCards(cards) {
  return `
    <div class="dashboard-grid">
      ${cards
        .map(
          ([label, value, note]) => `
            <article class="status-card">
              <span>${label}</span>
              <strong>${value}</strong>
              <p>${note}</p>
            </article>`
        )
        .join("")}
    </div>`;
}

function getAverageRating() {
  const ratings = startingSlots
    .map((slotId) => squadPlayers[squadSlots[slotId]]?.rating)
    .filter(Boolean);

  if (!ratings.length) {
    return "--";
  }

  return Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length);
}

function renderPlayer(playerId, isStarter) {
  if (!playerId) {
    return `
      <div class="empty-slot">
        <strong>Pusty slot</strong>
        <p>Przeciągnij tutaj zawodnika, żeby zdjąć go ze składu lub dodać do rezerw.</p>
      </div>`;
  }

  const player = squadPlayers[playerId];

  return `
    <article class="player-card ${isStarter ? "player-card--starter" : "player-card--reserve"}" draggable="true" data-player-id="${playerId}">
      <span class="player-card__role">${player.role}</span>
      <strong>${player.name}</strong>
      <p>${player.style}</p>
      <div class="form-bar" aria-label="Ocena zawodnika ${player.rating}">
        <span style="width: ${player.rating}%"></span>
      </div>
      <small>Ocena ${player.rating}</small>
    </article>`;
}

function renderSlot(slotId, isStarter) {
  return `
    <div class="squad-slot ${isStarter ? "squad-slot--starter" : "squad-slot--reserve"}" data-slot-id="${slotId}">
      <span class="squad-slot__label">${slotLabels[slotId]}</span>
      ${renderPlayer(squadSlots[slotId], isStarter)}
    </div>`;
}

function renderSquad() {
  const starters = startingSlots.map((slotId) => renderSlot(slotId, true)).join("");
  const reserves = ["reserve1", "reserve2", "reserve3"].map((slotId) => renderSlot(slotId, false)).join("");

  return `
    <div class="squad-board">
      <div class="squad-summary">
        <div>
          <span>Średnia ocena składu</span>
          <strong id="squad-average">${getAverageRating()}</strong>
        </div>
        <p>Liczone tylko z aktualnej podstawowej piątki.</p>
      </div>

      <section>
        <div class="section-heading">
          <span>LoL starting lineup</span>
          <h4>Podstawowa piątka</h4>
        </div>
        <div class="lineup-grid">${starters}</div>
      </section>

      <section class="reserve-section">
        <div class="section-heading">
          <span>Bench slots</span>
          <h4>Rezerwowi</h4>
        </div>
        <div class="reserve-grid">${reserves}</div>
      </section>
    </div>`;
}

function setupSquadDragAndDrop() {
  document.querySelectorAll(".player-card[draggable='true']").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.playerId);
      card.classList.add("player-card--dragging");
    });

    card.addEventListener("dragend", () => card.classList.remove("player-card--dragging"));
  });

  document.querySelectorAll(".squad-slot").forEach((slot) => {
    slot.addEventListener("dragover", (event) => {
      event.preventDefault();
      slot.classList.add("squad-slot--over");
    });

    slot.addEventListener("dragleave", () => slot.classList.remove("squad-slot--over"));

    slot.addEventListener("drop", (event) => {
      event.preventDefault();
      slot.classList.remove("squad-slot--over");

      const playerId = event.dataTransfer.getData("text/plain");
      const sourceSlotId = Object.keys(squadSlots).find((slotId) => squadSlots[slotId] === playerId);
      const targetSlotId = slot.dataset.slotId;

      if (!playerId || !sourceSlotId || !targetSlotId || sourceSlotId === targetSlotId) {
        return;
      }

      const targetPlayerId = squadSlots[targetSlotId];
      squadSlots[targetSlotId] = playerId;
      squadSlots[sourceSlotId] = targetPlayerId;
      renderSection("squad");
    });
  });
}

function renderSection(sectionKey) {
  const section = sections[sectionKey] || sections.home;
  const isSquad = section.layout === "squad";
  const body = isSquad ? renderSquad() : renderCards(section.cards);

  content.classList.toggle("hero-panel--squad", isSquad);

  if (isSquad) {
    content.innerHTML = body;
    setupSquadDragAndDrop();
    return;
  }

  content.innerHTML = `
    <header class="top-bar">
      <div>
        <p class="eyebrow">${section.eyebrow}</p>
        <h2>${section.title}</h2>
      </div>
      <button class="primary-action">${section.action}</button>
    </header>

    <div class="hero-content">
      <p class="hero-content__tag">${section.tag}</p>
      <h3>${section.heading}</h3>
      <p>${section.description}</p>
    </div>

    ${body}`;
}

function activateNavItem(activeItem) {
  navItems.forEach((item) => item.classList.remove("main-nav__item--active"));
  activeItem.classList.add("main-nav__item--active");
}

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    activateNavItem(item);
    renderSection(item.dataset.section);
    window.history.replaceState(null, "", item.getAttribute("href"));
  });
});

const initialItem = [...navItems].find((item) => item.getAttribute("href") === window.location.hash) || navItems[0];
activateNavItem(initialItem);
renderSection(initialItem.dataset.section);
