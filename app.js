const content = document.querySelector("#game-content");
const navItems = document.querySelectorAll(".main-nav__item");
const gameDay = document.querySelector("[data-game-day]");
const mailBadge = document.querySelector("[data-mail-badge]");

function refreshMailboxBadge() {
  const unread = window.getUnreadMailCount();
  mailBadge.textContent = unread;
  mailBadge.hidden = unread === 0;
  document.querySelector('[data-section="mailbox"]')?.classList.toggle("main-nav__item--unread", unread > 0);
}

window.subscribeMailbox(refreshMailboxBadge);
refreshMailboxBadge();

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
  const activeItem = document.querySelector(".main-nav__item--active");
  window.renderSection(content, activeItem?.dataset.section || "home");
});
