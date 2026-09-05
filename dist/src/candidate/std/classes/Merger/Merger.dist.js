module.exports = $moduler.import([], function () {
  return class Merger {
    static byStrategy(strategies, list, options) {
      return this._byStrategy({ strategies, list, options });
    }
    static _byStrategy({ strategies, list }) {
      const output = {};
      for (const source of list) {
        for (const key of Object.keys(source)) {
          if (!(key in output)) {
            output[key] = [];
          }
          output[key].push(source[key]);
        }
      }
      for (const key of Object.keys(output)) {
        if (key in strategies) {
          output[key] = strategies[key](output[key]);
        }
      }
      return output;
    }
  };
});
