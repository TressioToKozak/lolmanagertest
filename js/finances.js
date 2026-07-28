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
  const costRows = financeRows.map(([role, name, cost]) => `<tr class="finance-row--cost"><td>${role}</td><td>${name}</td><td>-${window.clubEconomy.format(cost)}</td></tr>`).join("");
  const incomeRows = monthlyIncome.map(([source, amount]) => `<tr class="finance-row--income"><td>${source}</td><td>${window.clubEconomy.format(amount)}</td></tr>`).join("");
  return `<div class="management-board"><div class="finance-summary"><article class="finance-kpi finance-kpi--balance"><span>Dostępne środki</span><strong>${window.clubEconomy.format()}</strong><small>Aktualny budżet klubu</small></article><article class="finance-kpi finance-kpi--income"><span>Przychody miesięczne</span><strong>+${window.clubEconomy.format(income)}</strong><small>Wpływy operacyjne</small></article><article class="finance-kpi finance-kpi--cost"><span>Wydatki miesięczne</span><strong>-${window.clubEconomy.format(costs)}</strong><small>Pensje i utrzymanie</small></article><article class="finance-kpi ${profit >= 0 ? "finance-kpi--income" : "finance-kpi--cost"}"><span>Bilans miesięczny</span><strong>${profit >= 0 ? "+" : "-"}${window.clubEconomy.format(Math.abs(profit))}</strong><small>${profit >= 0 ? "Klub zarabia" : "Klub generuje stratę"}</small></article></div><div class="finance-columns"><section class="finance-panel"><div class="section-heading"><span>Wpływy</span><h4>Przychody</h4></div><table class="finance-table"><thead><tr><th>Źródło</th><th>Kwota / mies.</th></tr></thead><tbody>${incomeRows}</tbody></table></section><section class="finance-panel"><div class="section-heading"><span>Zobowiązania</span><h4>Wydatki</h4></div><table class="finance-table"><thead><tr><th>Typ</th><th>Opis</th><th>Kwota / mies.</th></tr></thead><tbody>${costRows}</tbody></table></section></div></div>`;
}

window.renderFinances = renderFinances;
