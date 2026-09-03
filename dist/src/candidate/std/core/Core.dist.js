module.exports = $moduler.import([], function () {
  const AnsiColors = Object.assign(
    {
      available: {
        // estilos
        bold: [1, 22],
        italic: [3, 23],
        underline: [4, 24],
        blink: [5, 25],
        inverse: [7, 27],
        strike: [9, 29],
        // colores
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        // fondos
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        // brillantes
        blackBright: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39],
        // fondos brillantes
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49],
      },
      endToken: "\x1b[0m",
      squad: {
        tl: "┌",
        tr: "┐",
        bl: "└",
        br: "┘",
      },
      line: {
        h: "─",
        v: "│",
      },
      isBrowser:
        typeof window !== "undefined" && typeof document !== "undefined",
      isNodejs: typeof global !== "undefined",
      browserColor(it) {
        if (it === "green") return "#0F0";
        return it;
      },
      browserStyle: function (config) {
        const styles = config.split(",");
        return {
          browserColor: this.browserColor,
          text: (text) => {
            let css = "";
            Iterating_styles: for (
              let index = 0;
              index < styles.length;
              index++
            ) {
              const it = styles[index];
              if (!(it in this.available)) continue Iterating_styles;
              switch (it) {
                case "bold":
                  css += "font-weight:bold;";
                  break;
                case "italic":
                  css += "font-style:italic;";
                  break;
                case "underline":
                  css += "text-decoration:underline;";
                  break;
                case "strike":
                  css += "text-decoration:line-through;";
                  break;
                case "blink":
                  break;
                case "inverse":
                  break;
                default:
                  css += it.startsWith("bg")
                    ? `background-color:${this.browserColor(it.slice(2))};`
                    : `color:${this.browserColor(it)};`;
              }
            }
            return [`%c${text}%c`, css];
          },
          print(text) {
            console.log(...this.text(text), "");
          },
        };
      },
      nodejsStyle: function (config) {
        const styles = config.split(",");
        return {
          text: (text) => {
            const begin = styles.reduce((out, it) => {
              if (!(it in this.available)) {
                return out;
              }
              const code = this.available[it];
              out += `\x1b[${code[0]}m`;
              return out;
            }, "");
            const end = this.endToken;
            return `${begin}${text}${end}`;
          },
          print(text) {
            console.log(this.text(text));
          },
        };
      },
      style: function (config = "red,bold,underline") {
        return this.isBrowser
          ? this.browserStyle(config)
          : this.nodejsStyle(config);
      },
      stripAnsi: function (str) {
        return str.replace(/\x1b\[[0-9;]*m/g, "");
      },
      wrapAnsi: function (str, maxWidth) {
        return require("wrap-ansi").default(str, maxWidth, {
          hard: true,
        });
      },
      box: function (text, maxWidth = 110) {
        const lines = this.wrapAnsi(text, maxWidth).split("\n");
        const cleanLines = lines.map((l) => this.stripAnsi(l));
        const width = Math.max(...cleanLines.map((l) => l.length));
        const top = "┌" + "─".repeat(width + 2) + "┐";
        const bottom = "└" + "─".repeat(width + 2) + "┘";
        const body = lines
          .map((line) => {
            const clean = this.stripAnsi(line);
            const pad = width - clean.length;
            return "│ " + line + " ".repeat(pad) + " │";
          })
          .join("\n");
        return `${top}\n${body}\n${bottom}`;
      },
    },
    {
      table: function table(listOfColumns, options = {}) {
        const Table = require("cli-table3");
        const table = new Table(options);
        table.push(...listOfColumns);
        return table.toString();
      },
      borderlessTable: function borderlessTable(
        listOfColumns,
        optionsObject = {},
      ) {
        return this.alignTable(listOfColumns, 2, optionsObject);
      },
      visibleLength(str) {
        return require("strip-ansi").default(str).length;
      },
      alignTable(rows, gap = 2, max = {}) {
        for (let indexRow = 0; indexRow < rows.length; indexRow++) {
          const row = rows[indexRow];
          for (let indexCol = 0; indexCol < row.length; indexCol++) {
            const cell = row[indexCol];
            const cellLen = this.visibleLength(cell);
            if (!(indexCol in max)) {
              max[indexCol] = 5;
            }
            if (max[indexCol] < cellLen) {
              max[indexCol] = cellLen;
            }
          }
        }
        let out = "";
        for (let indexRow = 0; indexRow < rows.length; indexRow++) {
          const row = rows[indexRow];
          for (let indexCol = 0; indexCol < row.length; indexCol++) {
            const cell = row[indexCol];
            const currCellLen = this.visibleLength(cell);
            const cellLen = max[indexCol];
            const col = cell + " ".repeat(cellLen - currCellLen);
            if (indexCol !== 0) {
              out += " │ ";
            }
            out += col;
          }
          out += "\n";
        }
        return out.trimEnd();
      },
      padLinesToMax: function padLinesToMax(text) {
        const lines = text.split("\n");
        let out = "";
        let max = 0;
        for (let index = 0; index < lines.length; index++) {
          const line = lines[index];
          if (max < line.length) {
            max = line.length;
          }
        }
        for (let index = 0; index < lines.length; index++) {
          const line = lines[index];
          const padded = line.padEnd(max, " ");
          if (index !== 0) out += "\n";
          out += padded;
        }
        return out;
      },
    },
  );
  const Timeout = class Timeout {
    static of(milliseconds) {
      return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
      });
    }
  };
  const ErrorFactory = class ErrorFactory {
    static get new() {
      return new ErrorFactory();
    }
    constructor(base = new Error()) {
      this._error = base;
    }
    name(name) {
      this._error.name = name;
      return this;
    }
    message(message) {
      this._error.message = message;
      return this;
    }
    history(history) {
      this._error.history = history;
      return this;
    }
    add(error) {
      this._error.history = this._error.history || [];
      this._error.history.push(
        typeof error === "string" ? new Error(error) : error,
      );
      return this;
    }
    throw() {
      throw this._error;
    }
    build() {
      return this._error;
    }
  };
  const ErrorHandler = class ErrorHandler {
    constructor(error) {
      this.error = error;
      this.normalize(error);
    }
    static Lazy = class Lazy {
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
        const actions = this._actions
          .concat([])
          .map((action) => (errorHandler) => {
            const m = action[0];
            return errorHandler[m](...action.splice(1));
          });
        return function (error) {
          const handler = ErrorHandler.pick(error);
          return actions.map((action) => action(handler));
        };
      }
    };
    static get lazy() {
      return new this.Lazy();
    }
    static pick(...args) {
      return new ErrorHandler(...args);
    }
    static rethrow(error) {
      return ErrorHandler.pick(error).rethrow();
    }
    static add(newError) {
      return (error) => {
        ErrorHandler.pick(error).add(newError).rethrow();
      };
    }
    rethrow(error) {
      throw (this.error = error || this.error);
    }
    print() {
      console.log(this.error);
      return this;
    }
    silence() {
      return this;
    }
    add(anotherError) {
      this.error.history.push(
        typeof anotherError === "string"
          ? new Error(anotherError)
          : anotherError,
      );
      return this;
    }
    normalize(error) {
      if (error instanceof Error) {
        error.history = error.history || [];
      }
    }
  };
  const Isolate = class Isolate {
    utils = {
      IsolationError: class IsolationError extends Error {
        constructor(...args) {
          super(...args);
          this.name = "IsolationError";
        }
      },
      assert(condition, message) {
        if (!condition) throw new this.IsolationError(message);
      },
    };
    static Sync = class IsolateSync extends Isolate {
      run(data = null) {
        if (typeof data === "function") this.callback = data;
        this.utils.assert(
          typeof this.callback === "function",
          "Cannot run «IsolateSync» because property «callback» is not a function on «IsolateSync.prototype.run»",
        );
        const context = this.getContext(data);
        try {
          if (this._before) this._before(context);
          context.output = this.callback(context);
          if (this._after) this._after(context);
          return context.output;
        } catch (error) {
          this.handle(error, context);
        } finally {
          if (this._finally) this._finally(context);
        }
      }
    };
    static Async = class IsolateAsync extends Isolate {
      async run(data = null) {
        if (typeof data === "function") this.callback = data;
        this.utils.assert(
          typeof this.callback === "function",
          "Cannot run «IsolateAsync» because property «callback» is not a function on «IsolateAsync.prototype.run»",
        );
        const context = this.getContext(data);
        let hadError = undefined;
        try {
          if (this._before) this._before(context);
          context.output = this.callback(context);
          if (this._after) this._after(context);
          return context.output;
        } catch (error) {
          hadError = error;
          this.handle(error, context);
        } finally {
          if (this._finally) this._finally(context);
          if (hadError) throw hadError;
        }
      }
    };
    static get sync() {
      return new this.Sync();
    }
    static get async() {
      return new this.Async();
    }
    get rethrow() {
      this._silence = false;
      return this;
    }
    get silence() {
      // @CUIDADITO con usar esta función, chaval. Puede ser catatostrico.
      this._silence = true;
      this._print = false;
      return this;
    }
    get print() {
      this._print = true;
      return this;
    }
    getContext() {
      return {
        config: this._config,
        params: this._params,
        locals: this._locals,
      };
    }
    function(callback) {
      this.utils.assert(
        typeof callback === "function",
        `Parameter «callback» must be function on «Isolate.prototype.function»`,
      );
      this.callback = callback;
      return this;
    }
    config(config) {
      this.utils.assert(
        typeof config === "object",
        `Parameter «config» must be object on «Isolate.prototype.config»`,
      );
      this._config = config;
      return this;
    }
    params(params) {
      this.utils.assert(
        typeof params === "object",
        `Parameter «params» must be object on «Isolate.prototype.params»`,
      );
      this._params = params;
      return this;
    }
    locals(locals) {
      this.utils.assert(
        typeof locals === "object",
        `Parameter «locals» must be object on «Isolate.prototype.locals»`,
      );
      this._locals = locals;
      return this;
    }
    handle(error) {
      if (this._error)
        (error.history = error.history || []).push(...this._error);
      if (this._print) console.log(error);
      if (this._catch) this._catch(error, this.getContext());
      if (this._silence !== true) throw error;
    }
    info(data) {
      this.utils.assert(
        typeof data === "function",
        `Parameter «data» must be function on «Isolate.prototype.info»`,
      );
      this._info = data;
      return this;
    }
    before(beforeHandler) {
      this.utils.assert(
        typeof beforeHandler === "function",
        `Parameter «finallyHandler» must be function on «Isolate.prototype.before»`,
      );
      this._before = beforeHandler;
      return this;
    }
    after(afterHandler) {
      this.utils.assert(
        typeof afterHandler === "function",
        `Parameter «finallyHandler» must be function on «Isolate.prototype.after»`,
      );
      this._after = afterHandler;
      return this;
    }
    finally(finallyHandler) {
      this.utils.assert(
        typeof finallyHandler === "function",
        `Parameter «finallyHandler» must be function on «Isolate.prototype.finally»`,
      );
      this._finally = finallyHandler;
      return this;
    }
    catch(catchHandler) {
      this.utils.assert(
        typeof catchHandler === "function",
        `Parameter «catchHandler» must be function on «Isolate.prototype.catch»`,
      );
      this._catch = catchHandler;
      return this;
    }
    error(errorOrMessage) {
      (this._error = this._error || []).push(
        typeof errorOrMessage === "string"
          ? new Error(errorOrMessage)
          : errorOrMessage,
      );
      return this;
    }
    run(callback) {
      throw new Error("Method «run» must be overriden from «Isolate»");
    }
  };
  const Tracer = class Tracer {
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
        if (typeof window !== "undefined") window.$tracer = this.globalInstance;
        if (typeof global !== "undefined") global.$tracer = this.globalInstance;
      }
    }
  };
  return { ErrorFactory, ErrorHandler, Isolate, AnsiColors, Timeout, Tracer };
});
