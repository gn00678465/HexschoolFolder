export function execStrategyActions(actions: Common.StrategyActions) {
  [...actions].some(([flag, action]) => {
    if (flag) {
      action();
    }
    return flag;
  });
}
