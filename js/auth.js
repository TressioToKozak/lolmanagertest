const authScreen = document.querySelector("[data-auth-screen]");
const gameShell = document.querySelector(".game-shell");
const authForm = document.querySelector("[data-auth-form]");
const authTitle = document.querySelector("[data-auth-title]");
const authSubmit = document.querySelector("[data-auth-submit]");
const authSwitch = document.querySelector("[data-auth-switch]");
const authName = document.querySelector("[data-auth-name]");
const authMessage = document.querySelector("[data-auth-message]");
let authMode = "login";

async function showGame(user) {
  authScreen.hidden = true;
  gameShell.hidden = false;
  document.querySelector("[data-manager-name]").textContent = user.managerName;
  await window.gameState.load();
  window.refreshActiveSection();
}

function setMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  authTitle.textContent = registering ? "Utwórz klub" : "Wróć do klubu";
  authSubmit.textContent = registering ? "Zarejestruj się" : "Zaloguj się";
  authSwitch.textContent = registering ? "Mam już konto" : "Załóż nowe konto";
  authName.hidden = !registering;
  authName.querySelector("input").required = registering;
  authMessage.textContent = "";
}

authSwitch.addEventListener("click", () => setMode(authMode === "login" ? "register" : "login"));
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "";
  authSubmit.disabled = true;
  const form = new FormData(authForm);
  try {
    const response = await fetch(`/api/${authMode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) throw new Error("Backend logowania nie jest uruchomiony. Włącz aplikację poleceniem „npm start”, zamiast otwierać sam plik HTML.");
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error);
    showGame(payload.user);
  } catch (error) {
    authMessage.textContent = error.message || "Nie udało się połączyć z serwerem.";
  } finally {
    authSubmit.disabled = false;
  }
});

document.querySelector("[data-logout]").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  gameShell.hidden = true;
  authScreen.hidden = false;
  authForm.reset();
  setMode("login");
});

fetch("/api/session").then(async (response) => {
  if (response.ok && (response.headers.get("content-type") || "").includes("application/json")) showGame((await response.json()).user);
  else authScreen.hidden = false;
}).catch(() => { authScreen.hidden = false; });
