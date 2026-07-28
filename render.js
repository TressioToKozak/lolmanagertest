function renderCards(cards) {
  return `<div class="dashboard-grid">${cards.map(([label, value, note]) => `<article class="status-card"><span>${label}</span><strong>${value}</strong><p>${note}</p></article>`).join("")}</div>`;
}

function renderSection(content, sectionKey) {
  const section = window.sections[sectionKey] || window.sections.home;
  const isSquad = section.layout === "squad";
  const isGamingHouse = section.layout === "gamingHouse";
  const isMailbox = section.layout === "mailbox";
  const isStaff = section.layout === "staff";
  const isTransfer = section.layout === "transfer";
  const isScouting = section.layout === "scouting";
  const rerender = () => renderSection(content, sectionKey);

  content.classList.toggle("hero-panel--squad", isSquad);
  content.classList.toggle("hero-panel--gaming-house", isGamingHouse);
  content.classList.toggle("hero-panel--management", isStaff || isTransfer || isScouting || isMailbox);

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

  content.innerHTML = `
    <header class="top-bar"><div><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div><button class="primary-action">${section.action}</button></header>
    <div class="hero-content"><p class="hero-content__tag">${section.tag}</p><h3>${section.heading}</h3><p>${section.description}</p></div>
    ${renderCards(section.cards)}`;
}

window.renderSection = renderSection;
