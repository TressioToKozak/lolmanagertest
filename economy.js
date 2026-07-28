window.clubEconomy = {
  budget: 500000,
  format(amount = this.budget) {
    if (Math.abs(amount) >= 1000000) {
      return `€${(amount / 1000000).toFixed(3).replace(/\.?0+$/, "")}M`;
    }

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
