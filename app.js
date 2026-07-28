import { renderSection } from "./render.js";

const content = document.querySelector("#game-content");
const navItems = document.querySelectorAll(".main-nav__item");

function activateNavItem(activeItem) {
  navItems.forEach((item) => item.classList.remove("main-nav__item--active"));
  activeItem.classList.add("main-nav__item--active");
}

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    activateNavItem(item);
    renderSection(content, item.dataset.section);
    window.history.replaceState(null, "", item.getAttribute("href"));
  });
});

const initialItem = [...navItems].find((item) => item.getAttribute("href") === window.location.hash) || navItems[0];
activateNavItem(initialItem);
renderSection(content, initialItem.dataset.section);
