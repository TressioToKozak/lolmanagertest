const financeRows = [
  ["TOP", 'Kamil "Stone" Wójcik', 18000],
  ["JUNGLE", 'Adam "Path" Nowak', 21000],
  ["MID", 'Michał "Nova" Zieliński', 24000],
  ["ADC", 'Piotr "Arrow" Lis', 22000],
  ["SUPPORT", 'Jan "Ward" Kowal', 20000],
  ["Rezerwa", 'Bartosz "Flex" Grabowski', 9000],
  ["Rezerwa", 'Tomasz "Pulse" Wrona', 10000],
  ["Trener", "Slot trenera", 12000],
  ["Analityk", "Slot analityka", 8000],
  ["Psycholog", "Slot psychologa", 7000],
];
const monthlyIncome = [
  ["Sprzedaż biletów", 42000],
  ["Merch online", 18000],
  ["Streaming i content", 26000],
  ["Drobne granty ligowe", 14000],
];

function renderFinances() {
  const costs = financeRows.reduce((sum, [, , cost]) => sum + cost, 0);
  const income = monthlyIncome.reduce((sum, [, amount]) => sum + amount, 0);
  const profit = income - costs;
  const costRows = financeRows.map(([role, name, cost]) => `<tr><td>${role}</td><td>${name}</td><td>${window.clubEconomy.format(cost)}</td></tr>`).join("");
  const incomeRows = monthlyIncome.map(([source, amount]) => `<tr><td colspan="2">${source}</td><td>${window.clubEconomy.format(amount)}</td></tr>`).join("");
  return `<div class="management-board"><div class="finance-summary"><div class="budget-pill">Teraz mamy: <strong>${window.clubEconomy.format()}</strong></div><div class="budget-pill">Przychód: <strong>${window.clubEconomy.format(income)}</strong></div><div class="budget-pill">Koszty: <strong>-${window.clubEconomy.format(costs)}</strong></div><div class="budget-pill ${profit >= 0 ? "budget-pill--profit" : "budget-pill--loss"}">Bilans: <strong>${profit >= 0 ? "+" : "-"}${window.clubEconomy.format(Math.abs(profit))}</strong></div></div><section class="finance-panel"><div class="section-heading"><span>Miesięczny bilans</span><h4>Finanse klubu</h4></div><table class="finance-table"><thead><tr><th>Typ</th><th>Opis</th><th>Kwota / mies.</th></tr></thead><tbody>${incomeRows}${costRows}</tbody><tfoot><tr><td colspan="2">Razem</td><td>${profit >= 0 ? "+" : "-"}${window.clubEconomy.format(Math.abs(profit))}</td></tr></tfoot></table></section></div>`;
}

window.renderFinances = renderFinances;
