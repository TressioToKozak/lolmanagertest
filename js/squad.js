const squadPlayers = {
  stone: { name: 'Kamil "Stone" Wójcik', role: "TOP", style: "Tank specialist", rating: 58, value: 39000 },
  path: { name: 'Adam "Path" Nowak', role: "JUNGLE", style: "Early gank style", rating: 61, value: 48000 },
  nova: { name: 'Michał "Nova" Zieliński', role: "MID", style: "Control mage", rating: 64, value: 57000 },
  arrow: { name: 'Piotr "Arrow" Lis', role: "ADC", style: "Late game carry", rating: 60, value: 45000 },
  ward: { name: 'Jan "Ward" Kowal', role: "SUPPORT", style: "Shotcaller", rating: 62, value: 51000 },
  flex: { name: 'Bartosz "Flex" Grabowski', role: "TOP / JUNGLE", style: "Rezerwowy front line", rating: 54, value: 27000 },
  pulse: { name: 'Tomasz "Pulse" Wrona', role: "MID / ADC", style: "Mechaniczny talent", rating: 56, value: 33000 },
};

const squadSlots = { top: "stone", jungle: "path", mid: "nova", adc: "arrow", support: "ward", reserve1: "flex", reserve2: "pulse", reserve3: null };
const startingSlots = ["top", "jungle", "mid", "adc", "support"];
const reserveSlots = ["reserve1", "reserve2", "reserve3"];
const slotLabels = { top: "TOP", jungle: "JUNGLE", mid: "MID", adc: "ADC", support: "SUPPORT", reserve1: "REZERWA 1", reserve2: "REZERWA 2", reserve3: "WOLNY SLOT" };
const transferListedPlayers = new Map();
let squadSaleFilter = "all";

function getAverageRating() {
  const ratings = startingSlots.map((slotId) => squadPlayers[squadSlots[slotId]]?.rating).filter(Boolean);
  return ratings.length ? Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) : "--";
}

function renderPlayer(playerId, isStarter) {
  if (!playerId) {
    return `<div class="empty-slot"><strong>Pusty slot</strong><p>Przeciągnij tutaj zawodnika, żeby zdjąć go ze składu lub dodać do rezerw.</p></div>`;
  }

  const player = squadPlayers[playerId];
  const listed = transferListedPlayers.has(playerId);
  return `
    <article class="player-card ${isStarter ? "player-card--starter" : "player-card--reserve"} ${listed ? "player-card--listed" : ""}" draggable="true" data-player-id="${playerId}">
      <span class="player-card__role">${player.role}</span>
      <strong>${player.name}</strong>
      <p>${player.style}</p>
      <div class="form-bar" aria-label="Ocena zawodnika ${player.rating}"><span style="width: ${player.rating}%"></span></div>
      <small>Ocena ${player.rating}</small>
      <button class="player-sale-button" data-sell-player="${playerId}">${listed ? `Wystawiony • ${window.clubEconomy.format(player.value)}` : `Wystaw na sprzedaż • ${window.clubEconomy.format(player.value)}`}</button>
    </article>`;
}

function renderSlot(slotId, isStarter) {
  return `<div class="squad-slot ${isStarter ? "squad-slot--starter" : "squad-slot--reserve"}" data-slot-id="${slotId}"><span class="squad-slot__label">${slotLabels[slotId]}</span>${renderPlayer(squadSlots[slotId], isStarter)}</div>`;
}

function renderSquad() {
  const starters = startingSlots.map((slotId) => renderSlot(slotId, true)).join("");
  const visibleReserveSlots = reserveSlots.filter((slotId) => {
    const playerId = squadSlots[slotId];
    if (squadSaleFilter === "listed") return playerId && transferListedPlayers.has(playerId);
    if (squadSaleFilter === "unlisted") return !playerId || !transferListedPlayers.has(playerId);
    return true;
  });
  const reserves = visibleReserveSlots.map((slotId) => renderSlot(slotId, false)).join("");

  return `
    <div class="squad-board">
      <div class="squad-summary"><div><span>Średnia ocena składu</span><strong id="squad-average">${getAverageRating()}</strong></div><p>Liczone tylko z aktualnej podstawowej piątki.</p></div>
      <section><div class="section-heading"><span>LoL starting lineup</span><h4>Podstawowa piątka</h4></div><div class="lineup-grid">${starters}</div></section>
      <section class="reserve-section"><div class="reserve-heading"><div class="section-heading"><span>Bench slots</span><h4>Rezerwowi</h4></div><div class="squad-sale-filters"><button data-sale-filter="all" class="${squadSaleFilter === "all" ? "active" : ""}">Wszyscy</button><button data-sale-filter="listed" class="${squadSaleFilter === "listed" ? "active" : ""}">Wystawieni</button><button data-sale-filter="unlisted" class="${squadSaleFilter === "unlisted" ? "active" : ""}">Niewystawieni</button></div></div><div class="reserve-grid">${reserves || '<div class="reserve-empty">Brak zawodników w tym filtrze.</div>'}</div></section>
    </div>`;
}

function setupSquadDragAndDrop(onChange) {
  document.querySelectorAll("[data-sale-filter]").forEach((button) => button.addEventListener("click", () => {
    squadSaleFilter = button.dataset.saleFilter;
    onChange();
  }));
  document.querySelectorAll("[data-sell-player]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const reserveGrid = document.querySelector(".reserve-grid");
    const reserveScrollLeft = reserveGrid?.scrollLeft || 0;
    const playerId = button.dataset.sellPlayer;
    if (transferListedPlayers.has(playerId)) transferListedPlayers.delete(playerId);
    else transferListedPlayers.set(playerId, { listedDay: window.gameClock.day, value: squadPlayers[playerId].value });
    onChange();
    const nextReserveGrid = document.querySelector(".reserve-grid");
    if (nextReserveGrid) nextReserveGrid.scrollLeft = reserveScrollLeft;
  }));
  document.querySelectorAll(".player-card[draggable='true']").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.playerId);
      card.classList.add("player-card--dragging");
    });
    card.addEventListener("dragend", () => card.classList.remove("player-card--dragging"));
  });

  document.querySelectorAll(".squad-slot").forEach((slot) => {
    slot.addEventListener("dragover", (event) => { event.preventDefault(); slot.classList.add("squad-slot--over"); });
    slot.addEventListener("dragleave", () => slot.classList.remove("squad-slot--over"));
    slot.addEventListener("drop", (event) => {
      event.preventDefault();
      slot.classList.remove("squad-slot--over");
      const playerId = event.dataTransfer.getData("text/plain");
      const sourceSlotId = Object.keys(squadSlots).find((slotId) => squadSlots[slotId] === playerId);
      const targetSlotId = slot.dataset.slotId;
      if (!playerId || !sourceSlotId || !targetSlotId || sourceSlotId === targetSlotId) return;
      const targetPlayerId = squadSlots[targetSlotId];
      squadSlots[targetSlotId] = playerId;
      squadSlots[sourceSlotId] = targetPlayerId;
      onChange();
    });
  });
}

window.renderSquad = renderSquad;
window.setupSquadDragAndDrop = setupSquadDragAndDrop;
window.getSquadMatchProfile = function getSquadMatchProfile() {
  const starters = startingSlots.map((slotId) => ({ slotId, player: squadPlayers[squadSlots[slotId]] })).filter(({ player }) => player);
  const average = starters.reduce((sum, { player }) => sum + player.rating, 0) / Math.max(starters.length, 1);
  const roleMatches = starters.filter(({ slotId, player }) => player.role.split(" / ").includes(slotLabels[slotId])).length;
  const comfort = Math.round((roleMatches / Math.max(starters.length, 1)) * 100);
  return { rating: Math.round(average), comfort, strength: average + (comfort - 70) * 0.12 };
};
window.addSquadPlayer = function addSquadPlayer(player) {
  const playerId = `transfer-${player.name.toLocaleLowerCase("pl").replace(/[^a-z0-9]+/g, "-")}`;
  squadPlayers[playerId] = {
    name: player.name,
    role: player.position,
    style: `Transfer z ${player.team}`,
    rating: player.overall,
    value: Math.round(player.cost * 0.7),
  };

  let freeSlot = reserveSlots.find((slotId) => !squadSlots[slotId]);
  if (!freeSlot) {
    freeSlot = `reserve${reserveSlots.length + 1}`;
    reserveSlots.push(freeSlot);
    slotLabels[freeSlot] = `REZERWA ${reserveSlots.length}`;
  }
  squadSlots[freeSlot] = playerId;
};

window.gameClock.subscribe((day) => {
  [...transferListedPlayers.entries()].forEach(([playerId, listing]) => {
    if (day - listing.listedDay < 2) return;
    const player = squadPlayers[playerId];
    const slotId = Object.keys(squadSlots).find((slot) => squadSlots[slot] === playerId);
    if (!player || !slotId) return;
    squadSlots[slotId] = null;
    transferListedPlayers.delete(playerId);
    window.clubEconomy.budget += listing.value;
    window.addMail({
      id: `sale-${playerId}`,
      from: "Dyrektor sportowy",
      subject: `Sprzedano zawodnika: ${player.name}`,
      date: `Dzień ${day} • 11:00`,
      body: `${player.name} odchodzi z klubu. Oferta w wysokości ${window.clubEconomy.format(listing.value)} została zaakceptowana, a środki trafiły do budżetu.`,
    });
  });
});
