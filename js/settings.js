const translations = {
  pl: {
    home: "Strona główna", mailbox: "Skrzynka", squad: "Skład", staff: "Sztab", gamingHome: "Gaming House",
    transfer: "Transfery", scouting: "Skauting", tournaments: "Turnieje", leagues: "Ligi", finances: "Finanse", sponsors: "Sponsorzy", settings: "Ustawienia",
    title: "Ustawienia", subtitle: "Konto i preferencje", description: "Zarządzaj bezpieczeństwem konta oraz wyglądem gry.", appearance: "Wygląd", theme: "Motyw", dark: "Ciemny", light: "Jasny", language: "Język", polish: "Polski", english: "Angielski",
    security: "Bezpieczeństwo", passwordTitle: "Zmień hasło", currentPassword: "Aktualne hasło", newPassword: "Nowe hasło", changePassword: "Zmień hasło",
    reset: "Nowa kariera", resetTitle: "Resetuj klub", resetDescription: "Usuń postęp kariery i wróć do dnia 1. Konto oraz ustawienia pozostaną.", resetClub: "Resetuj postęp klubu", resetConfirm: "Czy na pewno chcesz usunąć cały postęp klubu?",
    danger: "Strefa niebezpieczna", deleteTitle: "Usuń konto", deleteDescription: "Ta operacja trwale usunie konto i wszystkie aktywne sesje.", confirmPassword: "Potwierdź hasłem", deleteAccount: "Usuń konto bezpowrotnie",
    passwordChanged: "Hasło zostało zmienione.", clubReset: "Klub został zresetowany.", accountDeleted: "Konto zostało usunięte.", deleteConfirm: "Czy na pewno chcesz trwale usunąć konto?",
  },
  en: {
    home: "Home", mailbox: "Mailbox", squad: "Squad", staff: "Staff", gamingHome: "Gaming House",
    transfer: "Transfers", scouting: "Scouting", tournaments: "Tournaments", leagues: "Leagues", finances: "Finances", sponsors: "Sponsors", settings: "Settings",
    title: "Settings", subtitle: "Account and preferences", description: "Manage account security and the game's appearance.", appearance: "Appearance", theme: "Theme", dark: "Dark", light: "Light", language: "Language", polish: "Polish", english: "English",
    security: "Security", passwordTitle: "Change password", currentPassword: "Current password", newPassword: "New password", changePassword: "Change password",
    reset: "New career", resetTitle: "Reset club", resetDescription: "Delete career progress and return to day 1. Your account and preferences remain.", resetClub: "Reset club progress", resetConfirm: "Are you sure you want to delete all club progress?",
    danger: "Danger zone", deleteTitle: "Delete account", deleteDescription: "This permanently removes the account and all active sessions.", confirmPassword: "Confirm with password", deleteAccount: "Delete account permanently",
    passwordChanged: "Password changed successfully.", clubReset: "Club progress has been reset.", accountDeleted: "Account deleted.", deleteConfirm: "Are you sure you want to permanently delete the account?",
  },
};
let gameLanguage = localStorage.getItem("manager-language") || "pl";
let gameTheme = localStorage.getItem("manager-theme") || "dark";
let settingsMessage = "";
let settingsError = false;

function t(key) { return translations[gameLanguage]?.[key] || translations.pl[key] || key; }
function applyPreferences() {
  document.documentElement.dataset.theme = gameTheme;
  document.documentElement.lang = gameLanguage;
  document.querySelectorAll("[data-section]").forEach((item) => {
    const badge = item.querySelector("[data-mail-badge]");
    item.firstChild.textContent = `${t(item.dataset.section)} `;
    if (badge) item.appendChild(badge);
  });
}

function renderSettings() {
  const option = (value, label, current) => `<option value="${value}" ${value === current ? "selected" : ""}>${label}</option>`;
  return `<div class="management-board settings-board"><header class="management-header"><div><span>${t("subtitle")}</span><h3>${t("title")}</h3><p>${t("description")}</p></div></header><div class="settings-grid"><section class="settings-panel"><div class="section-heading"><span>${t("appearance")}</span><h4>${t("appearance")}</h4></div><label><span>${t("theme")}</span><select data-setting-theme>${option("dark", t("dark"), gameTheme)}${option("light", t("light"), gameTheme)}</select></label><label><span>${t("language")}</span><select data-setting-language>${option("pl", t("polish"), gameLanguage)}${option("en", t("english"), gameLanguage)}</select></label></section><section class="settings-panel"><div class="section-heading"><span>${t("security")}</span><h4>${t("passwordTitle")}</h4></div><form data-password-form><label><span>${t("currentPassword")}</span><input type="password" name="currentPassword" required></label><label><span>${t("newPassword")}</span><input type="password" name="newPassword" minlength="8" required></label><button class="upgrade-button">${t("changePassword")}</button></form></section><section class="settings-panel settings-panel--reset"><div class="section-heading"><span>${t("reset")}</span><h4>${t("resetTitle")}</h4></div><p>${t("resetDescription")}</p><button class="reset-button" data-reset-club>${t("resetClub")}</button></section><section class="settings-panel settings-panel--danger"><div class="section-heading"><span>${t("danger")}</span><h4>${t("deleteTitle")}</h4></div><p>${t("deleteDescription")}</p><form data-delete-form><label><span>${t("confirmPassword")}</span><input type="password" name="password" required></label><button class="danger-button">${t("deleteAccount")}</button></form></section></div><p class="settings-message ${settingsError ? "settings-message--error" : ""}" role="status">${settingsMessage}</p></div>`;
}

async function accountRequest(url, options) {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json" } });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error);
  return payload;
}

function setupSettings(onChange) {
  document.querySelector("[data-setting-theme]")?.addEventListener("change", (event) => { gameTheme = event.target.value; localStorage.setItem("manager-theme", gameTheme); applyPreferences(); });
  document.querySelector("[data-setting-language]")?.addEventListener("change", (event) => { gameLanguage = event.target.value; localStorage.setItem("manager-language", gameLanguage); applyPreferences(); onChange(); });
  document.querySelector("[data-password-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault(); settingsMessage = "";
    try { await accountRequest("/api/account/password", { method: "PUT", body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); settingsMessage = t("passwordChanged"); settingsError = false; }
    catch (error) { settingsMessage = error.message; settingsError = true; }
    onChange();
  });
  document.querySelector("[data-reset-club]")?.addEventListener("click", async () => {
    if (!confirm(t("resetConfirm"))) return;
    await window.gameState.reset(); settingsMessage = t("clubReset"); settingsError = false; window.refreshActiveSection();
  });
  document.querySelector("[data-delete-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault(); if (!confirm(t("deleteConfirm"))) return;
    try { await accountRequest("/api/account", { method: "DELETE", body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); alert(t("accountDeleted")); window.location.reload(); }
    catch (error) { settingsMessage = error.message; settingsError = true; onChange(); }
  });
}

window.renderSettings = renderSettings;
window.setupSettings = setupSettings;
window.applyPreferences = applyPreferences;
