window.clubEconomy = {
  budget: 2400000,
  format(amount = this.budget) {
    return `€${(amount / 1000).toFixed(0)}k`;
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
