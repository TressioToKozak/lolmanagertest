const mails = [
  {
    id: "welcome",
    from: "Zarząd klubu",
    subject: "Witamy w LoL eSport Manager",
    date: "Dzisiaj, 09:00",
    body:
      "Witaj trenerze! Zarząd liczy na stabilny rozwój drużyny, awans do play-offów i rozsądne zarządzanie budżetem. Zacznij od sprawdzenia składu, sztabu oraz Gaming House.",
  },
  {
    id: "media-day",
    from: "Liga",
    subject: "Media day przed startem splitu",
    date: "Wczoraj, 17:30",
    body: "Przypominamy o obowiązkowej sesji medialnej. Zadbaj o morale zawodników i przygotuj krótką wypowiedź o celach na sezon.",
  },
];
let selectedMailId = mails[0].id;

function renderMailList() {
  return mails
    .map(
      (mail) => `<button class="mail-item ${mail.id === selectedMailId ? "mail-item--active" : ""}" data-mail-id="${mail.id}"><span>${mail.from}</span><strong>${mail.subject}</strong><small>${mail.date}</small></button>`
    )
    .join("");
}

function renderMailbox() {
  const selectedMail = mails.find((mail) => mail.id === selectedMailId) || mails[0];
  return `<div class="mailbox-board"><aside class="mail-list">${renderMailList()}</aside><article class="mail-view"><span>${selectedMail.from}</span><h3>${selectedMail.subject}</h3><small>${selectedMail.date}</small><p>${selectedMail.body}</p></article></div>`;
};

function setupMailbox(onChange) {
  document.querySelectorAll("[data-mail-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMailId = button.dataset.mailId;
      onChange();
    });
  });
}

window.renderMailbox = renderMailbox;
window.setupMailbox = setupMailbox;
window.addMail = function addMail(mail) {
  mails.unshift({ ...mail, id: `${mail.id}-${Date.now()}` });
};
