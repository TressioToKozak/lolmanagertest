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
    action: "Set lineup",
    tag: "Starting five",
    heading: "Skład",
    description:
      "Ustaw podstawową piątkę dokładnie jak w LoL-u, analizuj formę zawodników i trzymaj pod ręką rezerwowych gotowych do rotacji.",
    layout: "squad",
    starters: [
      { role: "TOP", player: "Kamil \"Stone\" Wójcik", style: "Tank specialist", form: 82 },
      { role: "JUNGLE", player: "Adam \"Path\" Nowak", style: "Early gank style", form: 88 },
      { role: "MID", player: "Michał \"Nova\" Zieliński", style: "Control mage", form: 91 },
      { role: "ADC", player: "Piotr \"Arrow\" Lis", style: "Late game carry", form: 86 },
      { role: "SUPPORT", player: "Jan \"Ward\" Kowal", style: "Shotcaller", form: 89 },
    ],
    reserves: [
      { role: "TOP / JUNGLE", player: "Bartosz \"Flex\" Grabowski", note: "Rezerwowy front line • Forma 76" },
      { role: "MID / ADC", player: "Tomasz \"Pulse\" Wrona", note: "Mechaniczny talent • Forma 79" },
      { role: "SUPPORT", player: "Miejsce wolne", note: "Slot na przyszły transfer lub akademię" },
    ],
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

function renderSquad(section) {
  const starters = section.starters
    .map(
      ({ role, player, style, form }) => `
        <article class="player-card player-card--starter">
          <span class="player-card__role">${role}</span>
          <strong>${player}</strong>
          <p>${style}</p>
          <div class="form-bar" aria-label="Forma zawodnika ${form}%">
            <span style="width: ${form}%"></span>
          </div>
          <small>Forma ${form}</small>
        </article>`
    )
    .join("");

  const reserves = section.reserves
    .map(
      ({ role, player, note }) => `
        <article class="player-card player-card--reserve">
          <span class="player-card__role">${role}</span>
          <strong>${player}</strong>
          <p>${note}</p>
        </article>`
    )
    .join("");

  return `
    <div class="squad-board">
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

function renderSection(sectionKey) {
  const section = sections[sectionKey] || sections.home;
  const body = section.layout === "squad" ? renderSquad(section) : renderCards(section.cards);

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
