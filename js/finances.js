const financeRows = [
  ["TOP", 'Kamil "Stone" Wójcik', 1400],
  ["JUNGLE", 'Adam "Path" Nowak', 1500],
  ["MID", 'Michał "Nova" Zieliński', 1700],
  ["ADC", 'Piotr "Arrow" Lis', 1600],
  ["SUPPORT", 'Jan "Ward" Kowal', 1500],
  ["Rezerwa", 'Bartosz "Flex" Grabowski', 700],
  ["Rezerwa", 'Tomasz "Pulse" Wrona', 750],
];
const monthlyIncome = [
  ["Streaming i content", 3000],
  ["Drobne granty ligowe", 2000],
];
let lastFinanceSettlementDay = 0;

function getFinanceSnapshot() {
  const staffRows = window.getStaffPayrollRows?.() || [];
  const costs = [...financeRows, ...staffRows].reduce((sum, [, , cost]) => sum + cost, 0);
  const income = monthlyIncome.reduce((sum, [, amount]) => sum + amount, 0);
  return { staffRows, costs, income, profit: income - costs };
}

function renderFinances() {
  const { staffRows, costs, income, profit } = getFinanceSnapshot();
  const costRows = [...financeRows, ...staffRows].map(([role, name, cost]) => `<tr class="finance-row--cost"><td>${role}</td><td>${name}</td><td>-${window.clubEconomy.format(cost)}</td></tr>`).join("");
  const incomeRows = monthlyIncome.map(([source, amount]) => `<tr class="finance-row--income"><td>${source}</td><td>${window.clubEconomy.format(amount)}</td></tr>`).join("");
  const daysToSettlement = 30 - (window.gameClock.day % 30 || 30);
  return `<div class="management-board"><div class="finance-summary"><article class="finance-kpi finance-kpi--balance"><span>Dostępne środki</span><strong>${window.clubEconomy.format()}</strong><small>Aktualny budżet klubu</small></article><article class="finance-kpi finance-kpi--income"><span>Przychody miesięczne</span><strong>+${window.clubEconomy.format(income)}</strong><small>Wpływy operacyjne</small></article><article class="finance-kpi finance-kpi--cost"><span>Wydatki miesięczne</span><strong>-${window.clubEconomy.format(costs)}</strong><small>Pensje i utrzymanie</small></article><article class="finance-kpi ${profit >= 0 ? "finance-kpi--income" : "finance-kpi--cost"}"><span>Bilans miesięczny</span><strong>${profit >= 0 ? "+" : "-"}${window.clubEconomy.format(Math.abs(profit))}</strong><small>Rozliczenie ${daysToSettlement === 0 ? "dzisiaj" : `za ${daysToSettlement} dni`}</small></article></div><div class="finance-columns"><section class="finance-panel"><div class="section-heading"><span>Wpływy</span><h4>Przychody</h4></div><table class="finance-table"><thead><tr><th>Źródło</th><th>Kwota / mies.</th></tr></thead><tbody>${incomeRows}</tbody></table></section><section class="finance-panel"><div class="section-heading"><span>Zobowiązania</span><h4>Wydatki</h4></div><table class="finance-table"><thead><tr><th>Typ</th><th>Opis</th><th>Kwota / mies.</th></tr></thead><tbody>${costRows}</tbody></table></section></div></div>`;
}

window.renderFinances = renderFinances;
window.gameClock.subscribe((day) => {
  if (day % 30 !== 0 || lastFinanceSettlementDay === day) return;
  const { income, costs, profit } = getFinanceSnapshot();
  window.clubEconomy.budget += profit;
  lastFinanceSettlementDay = day;
  window.addMail({ id: `finance-${day}`, from: "Księgowość", subject: `Miesięczne rozliczenie: ${profit >= 0 ? "+" : "-"}${window.clubEconomy.format(Math.abs(profit))}`, date: `Dzień ${day} • 08:00`, body: `Przychody: ${window.clubEconomy.format(income)}. Wydatki: ${window.clubEconomy.format(costs)}. Bilans został zaksięgowany w budżecie klubu.` });
});
window.gameState.register("finances", { get: () => ({ lastFinanceSettlementDay }), set: (state) => { lastFinanceSettlementDay = Number(state.lastFinanceSettlementDay) || 0; } });
