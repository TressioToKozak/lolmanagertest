window.clubEconomy = {
  budget: 500000,
  format(amount = this.budget) {
    if (Math.abs(amount) >= 1000000) {
      return `€${(amount / 1000000).toFixed(3).replace(/\.?0+$/, "")}M`;
    }

    if (Math.abs(amount) < 1000) return `€${amount}`;
    const thousands = amount / 1000;
    return `€${(Number.isInteger(thousands) ? thousands.toFixed(0) : thousands.toFixed(1))}k`;
  },
  canAfford(cost) {
    return this.budget >= cost;
  },
  spend(cost) {
    if (!this.canAfford(cost)) return false;
    this.budget -= cost;
    return true;
  },
};
window.gameState.register("economy", { get: () => ({ budget: window.clubEconomy.budget }), set: (state) => { window.clubEconomy.budget = Number(state.budget) || 0; } });
