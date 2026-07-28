const financeRows = [
  ["TOP", 'Kamil "Stone" Wójcik', 42000],
  ["JUNGLE", 'Adam "Path" Nowak', 47000],
  ["MID", 'Michał "Nova" Zieliński', 56000],
  ["ADC", 'Piotr "Arrow" Lis', 51000],
  ["SUPPORT", 'Jan "Ward" Kowal', 44000],
  ["Rezerwa", 'Bartosz "Flex" Grabowski', 18000],
  ["Rezerwa", 'Tomasz "Pulse" Wrona', 20000],
  ["Trener", "Slot trenera", 30000],
  ["Analityk", "Slot analityka", 18000],
  ["Psycholog", "Slot psychologa", 15000],
];

function renderFinances() {
  const total = financeRows.reduce((sum, [, , cost]) => sum + cost, 0);
  const rows = financeRows.map(([role, name, cost]) => `<tr><td>${role}</td><td>${name}</td><td>${window.clubEconomy.format(cost)}</td></tr>`).join("");
  return `<div class="management-board"><div class="budget-pill">Budżet: <strong>${window.clubEconomy.format()}</strong></div><section class="finance-panel"><div class="section-heading"><span>Miesięczne koszty</span><h4>Wynagrodzenia</h4></div><table class="finance-table"><thead><tr><th>Rola</th><th>Osoba</th><th>Koszt / mies.</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="2">Razem</td><td>${window.clubEconomy.format(total)}</td></tr></tfoot></table></section></div>`;
}

window.renderFinances = renderFinances;
