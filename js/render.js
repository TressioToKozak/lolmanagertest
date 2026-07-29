function renderCards(cards) {
  const homeStatus = window.getHomeStatus();
  return `<div class="dashboard-grid">${cards.map(([label, value, note]) => {
    if (label === "Budget") return `<article class="status-card"><span>${label}</span><strong>${window.clubEconomy.format()}</strong><p>${note}</p></article>`;
    if (label === "Next match") return `<article class="status-card"><span>${label}</span><strong>${homeStatus.nextMatch.value}</strong><p>${homeStatus.nextMatch.note}</p></article>`;
    if (label === "Team morale") return `<article class="status-card"><span>${label}</span><strong>${homeStatus.morale.value}</strong><p>${homeStatus.morale.note}</p></article>`;
    return `<article class="status-card"><span>${label}</span><strong>${value}</strong><p>${note}</p></article>`;
  }).join("")}</div>`;
}

function renderSection(content, sectionKey) {
  const section = window.sections[sectionKey] || window.sections.home;
  const isSquad = section.layout === "squad";
  const isGamingHouse = section.layout === "gamingHouse";
  const isMailbox = section.layout === "mailbox";
  const isStaff = section.layout === "staff";
  const isTransfer = section.layout === "transfer";
  const isScouting = section.layout === "scouting";
  const isTournaments = section.layout === "tournaments";
  const isLeagues = section.layout === "leagues";
  const isFinances = section.layout === "finances";
  const isSponsors = section.layout === "sponsors";
  const isSettings = section.layout === "settings";
  const rerender = () => { renderSection(content, sectionKey); window.gameState.schedule(); };

  content.classList.toggle("hero-panel--squad", isSquad);
  content.classList.toggle("hero-panel--gaming-house", isGamingHouse);
  content.classList.toggle("hero-panel--management", isStaff || isTransfer || isScouting || isMailbox || isTournaments || isLeagues || isFinances || isSponsors || isSettings);

  if (isSquad) {
    content.innerHTML = window.renderSquad();
    window.setupSquadDragAndDrop(rerender);
    return;
  }

  if (isGamingHouse) {
    content.innerHTML = window.renderGamingHouse();
    window.setupGamingHouseUpgrades(rerender);
    return;
  }

  if (isMailbox) {
    content.innerHTML = window.renderMailbox();
    window.setupMailbox(rerender);
    return;
  }

  if (isStaff) {
    content.innerHTML = window.renderStaff();
    window.setupStaff(rerender);
    return;
  }

  if (isTransfer) {
    content.innerHTML = window.renderTransfer();
    window.setupTransfer(rerender);
    return;
  }

  if (isScouting) {
    content.innerHTML = window.renderScouting();
    window.setupScouting(rerender);
    return;
  }

  if (isTournaments) {
    content.innerHTML = window.renderTournaments();
    window.setupTournaments(rerender);
    window.matchCenter.setup(rerender);
    return;
  }

  if (isLeagues) {
    content.innerHTML = window.renderLeagues();
    window.setupLeagues(rerender);
    window.matchCenter.setup(rerender);
    return;
  }

  if (isFinances) {
    content.innerHTML = window.renderFinances();
    return;
  }

  if (isSponsors) {
    content.innerHTML = window.renderSponsors();
    return;
  }

  if (isSettings) {
    content.innerHTML = window.renderSettings();
    window.setupSettings(rerender);
    return;
  }

  if (sectionKey === "home") {
    content.innerHTML = `<header class="top-bar"><div><p class="eyebrow">${section.eyebrow}</p><h2>Welcome, ${window.managerName || "Manager"}</h2></div></header>${renderCards(section.cards)}${window.renderOnboardingQuests?.() || ""}`;
  } else {
    content.innerHTML = `<header class="top-bar"><div><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div><button class="primary-action">${section.action}</button></header><div class="hero-content"><p class="hero-content__tag">${section.tag}</p><h3>${section.heading}</h3><p>${section.description}</p></div>${renderCards(section.cards)}`;
  }
  if (sectionKey === "home") window.setupOnboardingQuests?.(rerender);
}

window.renderSection = renderSection;
