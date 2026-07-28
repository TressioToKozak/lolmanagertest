const maxGamingHouseLevel = 5;
const gamingHouseState = {
  level: 1,
  equipment: [
    { id: "mice", name: "Myszki", level: 1, comfort: 4 },
    { id: "keyboards", name: "Klawiatury", level: 1, comfort: 4 },
    { id: "pcs", name: "Komputery", level: 1, comfort: 6 },
    { id: "monitors", name: "Monitory", level: 1, comfort: 5 },
    { id: "headsets", name: "Słuchawki", level: 1, comfort: 4 },
    { id: "chairs", name: "Krzesła", level: 1, comfort: 6 },
    { id: "desks", name: "Biurka", level: 1, comfort: 5 },
  ],
};

function getComfort() {
  const equipmentComfort = gamingHouseState.equipment.reduce((sum, item) => sum + item.level * item.comfort, 0);
  return Math.min(100, Math.round(35 + gamingHouseState.level * 6 + equipmentComfort / 3));
}

function getUpgradeCost(level) {
  return level * 35000;
}

function renderGamingHouse() {
  const comfort = getComfort();
  const equipment = gamingHouseState.equipment
    .map(
      (item) => `
        <article class="equipment-card">
          <img class="equipment-card__image" src="assets/gaming-house/${item.id}.svg" alt="${item.name}"><div><span>${item.name}</span><strong>Level ${item.level}</strong></div>
          <p>Komfort +${item.level * item.comfort}</p>
          <button class="upgrade-button" data-upgrade-equipment="${item.id}" ${!window.clubEconomy.canAfford(getUpgradeCost(item.level)) ? "disabled" : ""}>Ulepsz (${window.clubEconomy.format(getUpgradeCost(item.level))})</button>
        </article>`
    )
    .join("");

  return `
    <div class="gaming-house-board">
      <section class="gaming-house-summary"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div>
        <img class="gaming-house-image" src="assets/gaming-house/house.svg" alt="Gaming House">
        <div>
          <span>Gaming House</span>
          <strong>Level ${gamingHouseState.level}</strong>
          <p>Każdy upgrade podnosi komfort gry i pomaga zawodnikom utrzymać formę podczas treningów.</p>
        </div>
        <div class="comfort-meter">
          <span>Komfort gry</span>
          <strong>${comfort}%</strong>
          <div class="form-bar" aria-label="Komfort gry ${comfort}%"><span style="width: ${comfort}%"></span></div>
        </div>
        <button class="primary-action" data-upgrade-house ${gamingHouseState.level >= maxGamingHouseLevel || !window.clubEconomy.canAfford(getUpgradeCost(gamingHouseState.level) * 3) ? "disabled" : ""}>Ulepsz bazę (${window.clubEconomy.format(getUpgradeCost(gamingHouseState.level) * 3)})</button>
      </section>
      <div class="equipment-grid">${equipment}</div>
    </div>`;
}

function setupGamingHouseUpgrades(onChange) {
  document.querySelector("[data-upgrade-house]")?.addEventListener("click", () => {
    const cost = getUpgradeCost(gamingHouseState.level) * 3;
    if (window.clubEconomy.spend(cost)) {
      gamingHouseState.level = Math.min(maxGamingHouseLevel, gamingHouseState.level + 1);
      onChange();
    }
  });

  document.querySelectorAll("[data-upgrade-equipment]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = gamingHouseState.equipment.find((equipment) => equipment.id === button.dataset.upgradeEquipment);
      if (!item) return;
      if (window.clubEconomy.spend(getUpgradeCost(item.level))) {
        item.level += 1;
        onChange();
      }
    });
  });
}

window.renderGamingHouse = renderGamingHouse;
window.setupGamingHouseUpgrades = setupGamingHouseUpgrades;
window.gameState.register("gamingHouse", {
  get: () => gamingHouseState,
  set: (state) => { gamingHouseState.level = Number(state.level) || 1; if (Array.isArray(state.equipment)) gamingHouseState.equipment.splice(0, gamingHouseState.equipment.length, ...state.equipment); },
});
