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
  return `€${(level * 35).toFixed(0)}k`;
}

export function renderGamingHouse() {
  const comfort = getComfort();
  const equipment = gamingHouseState.equipment
    .map(
      (item) => `
        <article class="equipment-card">
          <div><span>${item.name}</span><strong>Level ${item.level}</strong></div>
          <p>Komfort +${item.level * item.comfort}</p>
          <button class="upgrade-button" data-upgrade-equipment="${item.id}">Ulepsz (${getUpgradeCost(item.level)})</button>
        </article>`
    )
    .join("");

  return `
    <div class="gaming-house-board">
      <section class="gaming-house-summary">
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
        <button class="primary-action" data-upgrade-house ${gamingHouseState.level >= maxGamingHouseLevel ? "disabled" : ""}>Ulepsz bazę</button>
      </section>
      <div class="equipment-grid">${equipment}</div>
    </div>`;
}

export function setupGamingHouseUpgrades(onChange) {
  document.querySelector("[data-upgrade-house]")?.addEventListener("click", () => {
    gamingHouseState.level = Math.min(maxGamingHouseLevel, gamingHouseState.level + 1);
    onChange();
  });

  document.querySelectorAll("[data-upgrade-equipment]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = gamingHouseState.equipment.find((equipment) => equipment.id === button.dataset.upgradeEquipment);
      if (!item) return;
      item.level += 1;
      onChange();
    });
  });
}
