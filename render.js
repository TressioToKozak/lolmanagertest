import { sections } from "./data.js";
import { renderGamingHouse, setupGamingHouseUpgrades } from "./gaming-house.js";
import { renderSquad, setupSquadDragAndDrop } from "./squad.js";

function renderCards(cards) {
  return `<div class="dashboard-grid">${cards.map(([label, value, note]) => `<article class="status-card"><span>${label}</span><strong>${value}</strong><p>${note}</p></article>`).join("")}</div>`;
}

export function renderSection(content, sectionKey) {
  const section = sections[sectionKey] || sections.home;
  const isSquad = section.layout === "squad";
  const isGamingHouse = section.layout === "gamingHouse";
  const rerender = () => renderSection(content, sectionKey);

  content.classList.toggle("hero-panel--squad", isSquad);
  content.classList.toggle("hero-panel--gaming-house", isGamingHouse);

  if (isSquad) {
    content.innerHTML = renderSquad();
    setupSquadDragAndDrop(rerender);
    return;
  }

  if (isGamingHouse) {
    content.innerHTML = renderGamingHouse();
    setupGamingHouseUpgrades(rerender);
    return;
  }

  content.innerHTML = `
    <header class="top-bar"><div><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div><button class="primary-action">${section.action}</button></header>
    <div class="hero-content"><p class="hero-content__tag">${section.tag}</p><h3>${section.heading}</h3><p>${section.description}</p></div>
    ${renderCards(section.cards)}`;
}
