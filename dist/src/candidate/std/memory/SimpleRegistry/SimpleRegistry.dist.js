module.exports = $moduler.import([], function () {
  return class SimpleRegistry {
    /**
     * # Class SimpleRegistry
     * - section: std.memory.SimpleRegistry
     * - file:    @/src/candidate/std/memory/SimpleRegistry/SimpleRegistry.class.js
     */
    static create(...args) {
      return new this(...args);
    }
    _define({ key, value }) {
      /**
       * # prototype._set
       * - section: std.memory.Registry.prototype._set
       * - file:    @/src/candidate/std/memory/Registry/prototype._set.js
       */
      if (key in this.all) {
        throw new Error(
          `Method «SimpleRegistry.prototype._define» is not allowed to override the value of key «${key}»`,
        );
      }
      this.all[key] = value;
    }
    _pick(parameters) {
      /**
       * # prototype._pick
       * - section: std.memory.SimpleRegistry.prototype._pick
       * - file:    @/src/candidate/std/memory/SimpleRegistry/prototype._pick.js
       */
      const { id, default: _default } = $moduler.toolkit.normalizeParameters(
        parameters,
        {
          id: {
            default: false,
            validate: (it) =>
              typeof it === "string"
                ? true
                : `Parameter «id» must be string but «${typeof it}» was found instead on «SimpleRegistry.prototype._pick»`,
          },
          default: {
            default: undefined,
          },
        },
      );
      return id in this.all ? this.all[id] : _default;
    }
    _find({ filter }) {
      /**
       * # prototype._find
       * - section: std.memory.Registry.prototype._find
       * - file:    @/src/candidate/std/memory/Registry/prototype._find.js
       */
      let matchedKeys = [],
        output = {};
      if (typeof filter === "undefined") {
        // 1. Establece output a todos en undefined
        output = this.all;
      } else if (typeof filter === "function") {
        // 2. Establece output a algunos en function
        matchedKeys = Object.keys(this.all).filter((key, index) => {
          return filter(this.all[key], key, index, matchedKeys, this.all);
        });
        // 2.1. Reconstruye el objeto con las propiedades matcheadas
        for (let index = 0; index < matchedKeys.length; index++) {
          const key = matchedKeys[index];
          output[key] = this.all[key];
        }
      } else if (typeof filter === "string") {
        return { [filter]: this._pick({ id: filter }) };
      } else {
        // 3. Lanza error en los demás casos
        throw new Error(
          `Parameter «filter» must be undefined or function but not «${typeof filter}» on «SimpleRegistry.prototype._find»`,
        );
      }
      // 4. Devuelve output
      return output;
    }
    _modify(parameters) {
      /**
       * # prototype._modify
       * - section: std.memory.SimpleRegistry.prototype._modify
       * - file:    @/src/candidate/std/memory/SimpleRegistry/prototype._modify.js
       */
      const { filter, modifier } = $moduler.toolkit.normalizeParameters(
        parameters,
        {
          filter: {
            validate: (it) =>
              ["function", "string", "undefined"].includes(typeof it) ||
              "Parameter «filter» must be function, string or undefined on «SimpleRegistry.prototype._modify»",
          },
          modifier: {
            validate: (it) =>
              typeof it === "function" ||
              "Parameter «modifier» must be function on «SimpleRegistry.prototype._modify»",
          },
        },
      );
      let matches;
      let counter = 0;
      Find_matches: {
        matches = this._find({ filter });
      }
      Iterate_matches: for (const key in matches) {
        const val = matches[key];
        const result = modifier(val, key, counter);
        Delete_or_override: if (typeof result === "undefined") {
          delete this.all[key];
        } else {
          this.all[key] = result;
        }
        counter++;
      }
      return Object.keys(matches);
    }
    _delete({ filter }) {
      /**
       * # prototype._delete
       * - section: std.memory.Registry.prototype._delete
       * - file:    @/src/candidate/std/memory/Registry/prototype._delete.js
       */
      const matches = this._find({ filter });
      Remove_matches: for (const key in matches) {
        delete this.all[key];
      }
      return Object.keys(matches);
    }
    define(key, value) {
      /**
       * # prototype.define
       * - section: std.memory.Registry.prototype.define
       * - file:    @/src/candidate/std/memory/Registry/prototype.define.js
       */
      return this._define({ key, value });
    }
    pick(id) {
      /**
       * # prototype.pick
       * - section: std.memory.SimpleRegistry.prototype.pick
       * - file:    @/src/candidate/std/memory/SimpleRegistry/prototype.pick.js
       */
      return this._pick({ id });
    }
    find(filter) {
      /**
       * # prototype.find
       * - section: std.memory.Registry.prototype.find
       * - file:    @/src/candidate/std/memory/Registry/prototype.find.js
       */
      return this._find({ filter });
    }
    modify(filter, modifier) {
      /**
       * # prototype.modify
       * - section: std.memory.SimpleRegistry.prototype.modify
       * - file:    @/src/candidate/std/memory/SimpleRegistry/prototype.modify.js
       */
      return this._modify({ filter, modifier });
    }
    delete(filter) {
      /**
       * # prototype.delete
       * - section: std.memory.Registry.prototype.delete
       * - file:    @/src/candidate/std/memory/Registry/prototype.delete.js
       */
      return this._delete({ filter });
    }
    constructor(parameters = {}, settings = {}) {
      /**
       * # constructor
       * - section: std.memory.Registry.constructor
       * - file:    @/src/candidate/std/memory/Registry/constructor.js
       */
      const { all } = $moduler.toolkit.normalizeParameters(parameters, {
        all: {
          default: () => ({}),
          validate: (it) =>
            typeof it === "object" ||
            `Parameter «all» must be object but type «${typeof it}» was found instead on «SimpleRegistry.constructor»`,
        },
      });
      this.all = all;
    }
  };
});
