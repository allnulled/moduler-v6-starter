class Lazy {
  constructor() {
    this._actions = [];
  }
  add(...args) {
    this._actions.push(["add", ...args]);
    return this;
  }
  print(...args) {
    this._actions.push(["print", ...args]);
    return this;
  }
  silence(...args) {
    this._actions.push(["silence", ...args]);
    return this;
  }
  rethrow(...args) {
    this._actions.push(["rethrow", ...args]);
    return this;
  }
  get handler() {
    const actions = this._actions.concat([]).map(action => errorHandler => {
      const m = action[0];
      return errorHandler[m](...action.splice(1));
    });
    return function(error) {
      const handler = ErrorHandler.pick(error);
      return actions.map(action => action(handler));
    };
  }
}