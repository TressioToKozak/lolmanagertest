const content = document.querySelector("#game-content");
const navItems = document.querySelectorAll(".main-nav__item");
const gameDay = document.querySelector("[data-game-day]");
const mailBadge = document.querySelector("[data-mail-badge]");

// Keep only the clock at the top if stale cached markup ever injects an older bottom copy.
document.querySelectorAll(".game-clock").forEach((clock, index) => {
  if (index > 0) clock.remove();
});

function refreshMailboxBadge() {
  const unread = window.getUnreadMailCount();
  mailBadge.textContent = unread;
  mailBadge.hidden = unread === 0;
  document.querySelector('[data-section="mailbox"]')?.classList.toggle("main-nav__item--unread", unread > 0);
}

window.subscribeMailbox(refreshMailboxBadge);
refreshMailboxBadge();
window.applyPreferences();

function activateNavItem(activeItem) {
  navItems.forEach((item) => item.classList.remove("main-nav__item--active"));
  activeItem.classList.add("main-nav__item--active");
}

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    activateNavItem(item);
    window.renderSection(content, item.dataset.section);
    window.history.replaceState(null, "", item.getAttribute("href"));
  });
});

const initialItem = [...navItems].find((item) => item.getAttribute("href") === window.location.hash) || navItems[0];
activateNavItem(initialItem);
window.renderSection(content, initialItem.dataset.section);

document.querySelector("[data-next-day]")?.addEventListener("click", () => {
  window.gameClock.nextDay();
  gameDay.textContent = window.gameClock.day;
  const matchSection = window.matchCenter.activeMatch?.section;
  const matchItem = matchSection ? document.querySelector(`[data-section="${matchSection}"]`) : null;
  if (matchItem) activateNavItem(matchItem);
  const activeItem = matchItem || document.querySelector(".main-nav__item--active");
  window.renderSection(content, activeItem?.dataset.section || "home");
  document.querySelector(".match-simulation--live")?.scrollIntoView({ block: "center" });
});
