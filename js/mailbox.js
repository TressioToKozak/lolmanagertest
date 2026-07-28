const mails = [
  {
    id: "welcome",
    from: "Zarząd klubu",
    subject: "Witamy w LoL eSport Manager",
    date: "Dzień 1 • 09:00",
    unread: true,
    body:
      "Witaj trenerze! Zarząd liczy na stabilny rozwój drużyny, awans do play-offów i rozsądne zarządzanie budżetem. Zacznij od sprawdzenia składu, sztabu oraz Gaming House.",
  },
];
let selectedMailId = mails[0].id;
const mailboxListeners = [];

function notifyMailbox() {
  mailboxListeners.forEach((listener) => listener());
}

function renderMailList() {
  return mails
    .map(
      (mail) => `<button class="mail-item ${mail.id === selectedMailId ? "mail-item--active" : ""} ${mail.unread ? "mail-item--unread" : "mail-item--read"}" data-mail-id="${mail.id}"><span>${mail.from}${mail.unread ? '<i class="mail-unread-dot" aria-label="Nieprzeczytana"></i>' : ""}</span><strong>${mail.subject}</strong><small>${mail.date}</small></button>`
    )
    .join("");
}

function renderMailbox() {
  if (!mails.length) return '<div class="mailbox-board mailbox-board--empty"><div class="empty-state"><span>Skrzynka</span><h3>Brak wiadomości</h3><p>Nowe informacje pojawią się tutaj.</p></div></div>';
  const selectedMail = mails.find((mail) => mail.id === selectedMailId) || mails[0];
  if (selectedMail?.unread) {
    selectedMail.unread = false;
    notifyMailbox();
  }
  return `<div class="mailbox-board"><aside class="mail-list"><div class="mail-list__header"><span>Wiadomości</span><strong>${mails.length}</strong></div>${renderMailList()}</aside><article class="mail-view"><span>${selectedMail.from}</span><h3>${selectedMail.subject}</h3><small>${selectedMail.date}</small><p>${selectedMail.body}</p><button class="mail-delete" data-delete-mail="${selectedMail.id}" ${selectedMail.unread ? "disabled" : ""}>Usuń przeczytaną wiadomość</button></article></div>`;
};

function setupMailbox(onChange) {
  document.querySelectorAll("[data-mail-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMailId = button.dataset.mailId;
      const selectedMail = mails.find((mail) => mail.id === selectedMailId);
      if (selectedMail) selectedMail.unread = false;
      notifyMailbox();
      onChange();
    });
  });
  document.querySelector("[data-delete-mail]")?.addEventListener("click", (event) => {
    const index = mails.findIndex((mail) => mail.id === event.currentTarget.dataset.deleteMail);
    if (index < 0 || mails[index].unread) return;
    mails.splice(index, 1);
    selectedMailId = mails[0]?.id || null;
    notifyMailbox();
    onChange();
  });
}

window.renderMailbox = renderMailbox;
window.setupMailbox = setupMailbox;
window.addMail = function addMail(mail) {
  mails.unshift({ ...mail, unread: true, id: `${mail.id}-${Date.now()}` });
  notifyMailbox();
};
window.getUnreadMailCount = () => mails.filter((mail) => mail.unread).length;
window.subscribeMailbox = (listener) => mailboxListeners.push(listener);
window.gameState.register("mailbox", {
  get: () => ({ mails, selectedMailId }),
  set: (state) => { if (Array.isArray(state.mails)) mails.splice(0, mails.length, ...state.mails); selectedMailId = state.selectedMailId || mails[0]?.id; notifyMailbox(); },
});
