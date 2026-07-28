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
  const selectedMail = mails.find((mail) => mail.id === selectedMailId) || mails[0];
  if (selectedMail?.unread) {
    selectedMail.unread = false;
    notifyMailbox();
  }
  return `<div class="mailbox-board"><aside class="mail-list">${renderMailList()}</aside><article class="mail-view"><span>${selectedMail.from}</span><h3>${selectedMail.subject}</h3><small>${selectedMail.date}</small><p>${selectedMail.body}</p></article></div>`;
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
}

window.renderMailbox = renderMailbox;
window.setupMailbox = setupMailbox;
window.addMail = function addMail(mail) {
  mails.unshift({ ...mail, unread: true, id: `${mail.id}-${Date.now()}` });
  notifyMailbox();
};
window.getUnreadMailCount = () => mails.filter((mail) => mail.unread).length;
window.subscribeMailbox = (listener) => mailboxListeners.push(listener);
