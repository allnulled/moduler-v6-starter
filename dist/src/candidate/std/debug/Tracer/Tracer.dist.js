module.exports = $moduler.import(
  [
    "@/src/candidate/std/console/AnsiColors/AnsiColors.class.js",
    "@/src/candidate/std/error/ErrorFactory/ErrorFactory.class.js",
    "@/src/candidate/std/error/ErrorHandler/ErrorHandler.class.js",
    "@/src/candidate/std/function/Isolate/Isolate.class.js",
  ],
  function ([AnsiColors, ErrorFactory, ErrorHandler, Isolate]) {
    return class Tracer {
      static create(...args) {
        return new this(...args);
      }
      constructor(id, cloneOf = null) {
        this.id = id;
        this.level = 0;
        this.isTracing = true;
        if (cloneOf)
          Object.assign(
            this,
            ObjectUtils.isolateProps(cloneOf, ["level", "isTracing"]),
          );
      }
      log(method, data = [], options = {}, innerParameters = {}) {
        if (!this.isTracing) return;
        console.log(
          `[${this.id}] [${this.level}${innerParameters.levelSymbol || ""}] ${method}${this._formatParameters(data)}`,
        );
      }
      _formatParameters(args) {
        if (!args) return "";
        let text = "";
        const list = Array.from(args);
        text += ` [${list.length} args]`;
        for (let index = 0; index < list.length; index++) {
          const item = list[index];
          if (index !== 0) text += ",";
          text += ` ${typeof item}`;
          text += ` (${index + 1})`;
        }
        return text;
      }
      in(method, data = [], options = {}) {
        const result = this.log(method, data, options, { levelSymbol: "++" });
        this.level++;
        return result;
      }
      out(method, data = [], options = {}) {
        const result = this.log(method, data, options, { levelSymbol: "--" });
        this.level--;
        return result;
      }
      static globalInstance = new this("Tracer.globalInstance");
      static {
        Export_global_instance: {
          if (typeof window !== "undefined")
            window.$tracer = this.globalInstance;
          if (typeof global !== "undefined")
            global.$tracer = this.globalInstance;
        }
      }
    };
  },
);
