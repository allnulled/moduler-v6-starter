module.exports = $moduler.export("#Std", function () {
  Error_extensions_from_Std: {
    Error.stackTraceLimit = 4;
    Error.create = function (input) {
      if (input instanceof Error) return input.normalizeForStd();
      if (typeof input === "string") return new Error(input).normalizeForStd();
      if (typeof input === "object")
        return Object.assign(new Error(""), input).normalizeForStd();
      return Object.assign(
        new Error(`Malformed error of type «${typeof input}» was created`),
        { input },
      );
    };
    Error.throw = function () {
      throw this;
    };
    Error.toThrower = function (input, ...args) {
      return Error.create(input).toThrower(...args);
    };
    Error.prototype.normalizeForStd = function () {
      if (!("std" in this)) this.std = {};
      if (!("history" in this.std)) this.std.history = [];
      return this;
    };
    Error.prototype.adding = function (anotherError) {
      this.normalizeForStd();
      this.std.history.push(Error.create(anotherError));
      return this;
    };
    Error.prototype.throw = function (callback = null) {
      this.normalizeForStd();
      if (typeof callback === "function") callback(this);
      throw this;
    };
    Object.defineProperty(Error.prototype, "thrown", {
      get() {
        throw this;
      },
    });
    Object.defineProperty(Error.prototype, "handle", {
      get() {
        return this.toThrower();
      },
    });
    Error.prototype.toThrower = function (callback = null, parameters = null) {
      return (error) => {
        Error.create(error);
        if (callback) callback(error, this, parameters);
        throw Error.create(error).adding(this);
      };
    };
  }
  const Std = function () {
    console.log("[*] The function Std does not do anything yet");
  };
  Object.assign(Std, {
    // 1. Resources:
    all: {},
    splitter: /\.|\//g,
    of: function (selector) {
      const parts = selector.split(this.splitter);
      const acc = [];
      let pivot = this;
      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        acc.push(part);
        if (!["object", "function"].includes(typeof pivot))
          throw new Error(
            `Cannot access property «Std${acc.map((it) => "." + it).join("")}» because «Std${acc
              .slice(0, -1)
              .map((it) => "." + it)
              .join(
                "",
              )}» should be function or object but «${typeof pivot}» was found instead on «Std»`,
          );
        if (!(part in pivot))
          throw new Error(
            `Cannot access property «Std${acc.map((it) => "." + it).join("")}» because «Std${acc
              .slice(0, -1)
              .map((it) => "." + it)
              .join("")}» does not contain any property «${part}» on «Std»`,
          );
        pivot = pivot[part];
      }
      return pivot;
    },
  });
  Object.assign(Std, {
    constants: {},
    functions: {},
    handlers: {},
    objects: {},
    descriptors: {},
    traits: {},
    interfaces: {},
    classes: {},
  });
  Object.assign(Std.all, {
    mixProperties: (Std.functions.mixProperties = function mixProperties(
      base,
      _propertyBuses,
      overridables = [],
    ) {
      const propertyBuses = Array.isArray(_propertyBuses)
        ? _propertyBuses
        : [_propertyBuses];
      Iterating_buses: for (
        let index = 0;
        index < propertyBuses.length;
        index++
      ) {
        const bus = propertyBuses[index];
        const baseProps = Object.getOwnPropertyNames(base);
        const busProps = Object.getOwnPropertyNames(bus);
        const conflictiveNames = busProps
          .filter((key) => baseProps.includes(key))
          .filter((name) => !overridables.includes(name));
        if (conflictiveNames.length)
          throw new Error(
            `Trying to mix conflictive properties «${conflictiveNames.join(", ")}» on «Std.all.mixProperties»`,
          );
        Object.defineProperties(base, Object.getOwnPropertyDescriptors(bus));
      }
      return base;
    }),
    simplestAssert: (Std.functions.simplestAssert = function simplestAssert(
      condition,
      message = "Assertion failed",
    ) {
      if (!condition) throw Error.create(message);
    }),
    triggerMethodIfExists: (Std.functions.triggerMethodIfExists =
      function triggerMethodIfExists(base, method, args = [], scope = false) {
        if (base && method in base) {
          if (scope) return base[method].call(scope, ...args);
          return base[method](...args);
        }
      }),
    createIsolationCatcher: (Std.functions.createIsolationCatcher =
      function createIsolationCatcher(message, scope = false) {
        return function (errorBrute) {
          const error = Error.create(errorBrute);
          throw error.adding(
            Std.all.renderSimpleTemplate(message, scope || this),
          );
        };
      }),
    renderSimpleTemplate: (Std.functions.renderSimpleTemplate =
      function renderSimpleTemplate(text, data = {}) {
        return text.replace(/\$\{([^}]+)\}/g, (_, key) => data[key.trim()]);
      }),
  });
  Object.assign(Std.all, {
    StringUtil: (Std.objects.StringUtil = {
      defaultAlphabet: (defaultAlphabet =
        "abcdefghijklmnopqrstuvwxyz0123456789".split("")),
      getRandomString: function getRandomString(
        len,
        alphabet = this.defaultAlphabet,
      ) {
        let out = "";
        while (out.length < len) {
          out += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return out;
      },
    }),
  });
  Object.assign(Std.all, {
    Newable: (Std.descriptors.Newable = {
      get new() {
        return new this();
      },
    }),
    Pidable: (Std.descriptors.Pidable = {
      get pid() {
        return (this._pid =
          this._pid || Std.all.StringUtil.getRandomString(10));
      },
    }),
    NewSubprocessable: (Std.descriptors.NewSubprocessable = {
      get newSubprocess() {
        return this.createSubprocess();
      },
    }),
    Configurable: (Std.traits.Configurable = {
      config: function (data) {
        Object.assign(this, data);
        return this;
      },
    }),
    Creable: (Std.traits.Creable = {
      create: function (...args) {
        return new this(...args);
      },
    }),
    Clonable: (Std.traits.Clonable = {
      clone: function (newConfig = {}) {
        return this.constructor.new.config(Object.assign(newConfig, this));
      },
    }),
  });
  Object.assign(Std.all, {
    ClassSkiller: (Std.classes.ClassSkiller = class ClassBuilder {
      static {
        Object.assign(this, {
          create: Std.all.Creable.create,
          assert: Std.functions.simplestAssert,
        });
        Object.assign(this.prototype, {
          config: Std.all.Configurable.config,
        });
        Object.defineProperties(
          this,
          Object.getOwnPropertyDescriptors(Std.all.Newable),
        );
      }
      static filters = {
        accessors: function (entry) {
          return entry[1].get || entry[1].set;
        },
        members: function (entry) {
          return !entry[1].get && !entry[1].set;
        },
      };
      static getDescriptors(target, filter = false) {
        if (!filter) return Object.getOwnPropertyDescriptors(target);
        return Object.fromEntries(
          Object.entries(Object.getOwnPropertyDescriptors(target)).filter(
            filter,
          ),
        );
      }
      static addStatic(clazz, info, overriders = []) {
        this.assert(
          ["function", "object"].includes(typeof clazz),
          `Parameter «clazz» must be function or object on «ClassBuilder.prototype.addStatic»`,
        );
        this.assert(
          typeof info === "object",
          `Parameter «info» must be object on «ClassBuilder.prototype.addStatic»`,
        );
        const properties = Object.getOwnPropertyDescriptors(info);
        const accessors = Object.fromEntries(
          Object.entries(properties).filter((it) => it[1].get || it[1].set),
        );
        const members = Object.keys(
          Object.fromEntries(
            Object.entries(properties).filter((it) => !it[1].get && !it[1].set),
          ),
        ).reduce((out, it) => {
          out[it] = info[it];
          return out;
        }, {});
        Checking_static_members: for (const newProp in members) {
          if (overriders.includes(newProp)) continue Checking_static_members;
          this.assert(!(newProp in clazz), {
            name: "ForbiddenOverrideError",
            message: `Property «${newProp}» cannot be overriden as member unless specified so in «overriders» parameter on «ClassSkiller.addStatic»`,
          });
        }
        Checking_static_accessors: for (const newProp in accessors) {
          if (overriders.includes(newProp)) continue Checking_static_accessors;
          this.assert(!(newProp in clazz), {
            name: "ForbiddenOverrideError",
            message: `Property «${newProp}» cannot be overriden as accessor unless specified so in «overriders» parameter on «ClassSkiller.addStatic»`,
          });
        }
        Object.assign(clazz, members);
        Object.defineProperties(clazz, accessors);
      }
      static addPrototype(clazz, info, overriders = []) {
        this.assert(
          ["function", "object"].includes(typeof clazz),
          `Parameter «clazz» must be function or object on «ClassBuilder.prototype.addPrototype»`,
        );
        this.assert(
          typeof info === "object",
          `Parameter «info» must be object on «ClassBuilder.prototype.addPrototype»`,
        );
        this.assert(
          info !== null,
          `Parameter «info» cannot be null on «ClassBuilder.prototype.addPrototype»`,
        );
        const properties = Object.getOwnPropertyDescriptors(info);
        const accessors = Object.fromEntries(
          Object.entries(properties).filter((it) => it[1].get || it[1].set),
        );
        const members = Object.keys(
          Object.fromEntries(
            Object.entries(properties).filter((it) => !it[1].get && !it[1].set),
          ),
        ).reduce((out, it) => {
          out[it] = info[it];
          return out;
        }, {});
        Checking_static_members: for (const newProp in members) {
          if (overriders.includes(newProp)) continue Checking_static_members;
          this.assert(!(newProp in clazz), {
            name: "ForbiddenOverrideError",
            message: `Property «${newProp}» cannot be overriden as member unless specified so in «overriders» parameter on «ClassSkiller.addPrototype»`,
          });
        }
        Checking_static_accessors: for (const newProp in accessors) {
          if (overriders.includes(newProp)) continue Checking_static_accessors;
          this.assert(!(newProp in clazz), {
            name: "ForbiddenOverrideError",
            message: `Property «${newProp}» cannot be overriden as member unless specified so in «overriders» parameter on «ClassSkiller.addPrototype»`,
          });
        }
        Este_es_el_fix_necesario_minimo_sobreescribir_prototype_en_caso_de_objeto: {
          if (typeof clazz === "object")
            Object.setPrototypeOf(
              clazz,
              (clazz.prototype = clazz.prototype || info.prototype || {}),
            );
        }
        Object.assign(clazz.prototype, members);
        Object.defineProperties(clazz.prototype, accessors);
      }
      static addInterface(base, interfaceObject) {
        this.assert(
          ["object", "function"].includes(typeof base),
          `Parameter «base» must be function or object but «${typeof base}» was found instead on «ClassSkiller.addInterface»`,
        );
        this.assert(
          base !== null,
          `Parameter «base» cannot be null on «ClassSkiller.addInterface»`,
        );
        this.assert(
          typeof interfaceObject === "object",
          `Parameter «interfaceObject» must be object but «${typeof base}» was found instead on «ClassSkiller.addInterface»`,
        );
        this.assert(
          interfaceObject !== null,
          `Parameter «interfaceObject» cannot be null on «ClassSkiller.addInterface»`,
        );
        const keys = Object.keys(interfaceObject);
        this.assert(
          keys.length !== 0,
          `Parameter «interfaceObject» cannot have 0 properties on «ClassSkiller.addInterface»`,
        );
        this.assert(
          keys.length <= 2,
          `Parameter «interfaceObject» cannot more than 2 properties on «ClassSkiller.addInterface»`,
        );
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index];
          this.assert(
            ["static", "prototype"].includes(key),
            `Parameter «interfaceObject» can only have properties «static» and «prototype» but «${key}» was found instead on «ClassSkiller.addInterface»`,
          );
        }
        if (keys.includes("static")) {
          Std.functions.mixProperties(base, interfaceObject.static);
        }
        if (typeof base === "object" && !base.prototype) {
          base.prototype = {};
        }
        if (keys.includes("prototype")) {
          Std.functions.mixProperties(
            base.prototype || {},
            interfaceObject.prototype,
          );
        }
      }
      static addInterfaces(base, others) {
        for (let index = 0; index < others.length; index++) {
          const other = others[index];
          this.addInterface(base, other);
        }
        return base;
      }
    }),
  });
  Object.assign(Std.all, {
    EmptyConstructor: (Std.interfaces.EmptyConstructor = {
      // Interface SOLO ACEPTA 2 propiedades:
      static: Std.all.mixProperties(
        {
          // Static members:
          create: Std.all.Creable.create,
        },
        [
          // Static accessors:
          Std.all.Newable,
        ],
      ),
      prototype: Std.all.mixProperties(
        {
          // Prototype members:
          clone: Std.all.Clonable.clone,
          config: Std.all.Configurable.config,
        },
        [
          // Prototype accessors:
        ],
      ),
    }),
  });
  Object.assign(Std.all, {
    Runnable: (Std.traits.Runnable = {
      runAsync: async function (cycle, cloneConfig = false, metaprocess = {}) {
        let output = undefined;
        let subject = this;
        let callback = undefined;
        const { isProgrammatic = false } = metaprocess;
        Resolve_subject: {
          if (cloneConfig) {
            subject = this.new.config(cloneConfig);
          }
        }
        Resolve_callback: {
          if (typeof cycle === "string") {
            if (!(cycle in subject))
              throw new Error(
                `Parameter «cycle» must be key in «subject» but «${cycle}» was found instead on «Runnable.runSync»`,
              );
            callback = subject[cycle];
          } else if (typeof cycle === "function") {
            callback = cycle;
          } else if (Array.isArray(cycle)) {
            callback = async function () {
              for (let index = 0; index < cycle.length; index++) {
                const step = cycle[index];
                await this.run(step, false, { isProgrammatic: true });
              }
            };
          } else
            throw new Error(
              `Parameter «cycle» must be string, function or array but «${typeof cycle}» was found instead on «Runnable.runSync»`,
            );
        }
        Resolve_action: {
          let error = undefined;
          try {
            if (!isProgrammatic)
              Std.functions.triggerMethodIfExists(
                subject,
                "onRunStart",
                [{ metaprocess }],
                subject,
              );
            output = await callback.call(subject);
            if (!isProgrammatic)
              Std.functions.triggerMethodIfExists(
                subject,
                "onRunSuccess",
                [{ metaprocess, output }],
                subject,
              );
          } catch (originalError) {
            error = Error.create(originalError);
            if (!isProgrammatic)
              error =
                Std.functions.triggerMethodIfExists(
                  subject,
                  "onRunCatch",
                  [error, { metaprocess, output }],
                  subject,
                ) || error;
            throw error;
          } finally {
            if (!isProgrammatic)
              Std.functions.triggerMethodIfExists(
                subject,
                "onRunEnd",
                [{ metaprocess, output, error }],
                subject,
              );
          }
        }
        return output;
      },
      runSync: function (cycle, cloneConfig = false, metaprocess = {}) {
        let output = undefined;
        let subject = this;
        let callback = undefined;
        const { isProgrammatic = false } = metaprocess;
        Resolve_subject: {
          if (cloneConfig) {
            subject = this.new.config(cloneConfig);
          }
        }
        Resolve_callback: {
          if (typeof cycle === "string") {
            if (!(cycle in subject))
              throw new Error(
                `Parameter «cycle» must be key in «subject» but «${cycle}» was found instead on «Runnable.runSync»`,
              );
            callback = subject[cycle];
          } else if (typeof cycle === "function") {
            callback = cycle;
          } else if (Array.isArray(cycle)) {
            callback = function () {
              for (let index = 0; index < cycle.length; index++) {
                const step = cycle[index];
                this.run(step, false, { isProgrammatic: true });
              }
            };
          } else
            throw new Error(
              `Parameter «cycle» must be string, function or array but «${typeof cycle}» was found instead on «Runnable.runSync»`,
            );
        }
        Resolve_action: {
          let error = undefined;
          try {
            if (!isProgrammatic)
              Std.functions.triggerMethodIfExists(
                subject,
                "onRunStart",
                [{ metaprocess }],
                subject,
              );
            output = callback.call(subject);
            if (!isProgrammatic)
              Std.functions.triggerMethodIfExists(
                subject,
                "onRunSuccess",
                [{ metaprocess, output }],
                subject,
              );
          } catch (originalError) {
            error = Error.create(originalError);
            if (!isProgrammatic)
              error =
                Std.functions.triggerMethodIfExists(
                  subject,
                  "onRunCatch",
                  [error, { metaprocess, output }],
                  subject,
                ) || error;
            throw error;
          } finally {
            if (!isProgrammatic)
              Std.functions.triggerMethodIfExists(
                subject,
                "onRunEnd",
                [{ metaprocess, output, error }],
                subject,
              );
          }
        }
        return output;
      },
    }), // Compuestas por: Creable, Configurable, Clonable, etc...
    Environmenter: (Std.classes.Creable = class Environmenter {
      static isBrowser = typeof window !== "undefined";
      static isNodejs = typeof global !== "undefined";
      static throw(message) {
        throw Error.create({ name: "EnvironmentalError", message });
      }
    }),
    Ansi: (Std.classes.Ansi = ((Colors) => {
      if (typeof window !== "undefined") window.AnsiColorsMv6 = Colors;
      if (typeof global !== "undefined") global.AnsiColorsMv6 = Colors;
      return Colors;
    })(
      Object.assign(
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
      ),
    )),
    Checker: (Std.classes.Checker = class Checker {
      static {
        Object.assign(this, {
          create: Std.all.Creable.create,
          check: function (value) {
            return this.new.config({ value });
          },
          createCheck: function (hooks = {}) {
            return Object.assign(
              (value) => this.new.config(hooks).config({ value }),
              {
                that: (value) => this.new.config(hooks).config({ value }),
              },
            );
          },
        });
        Object.assign(this, {
          IsInterface: class IsInterface {
            constructor(checker) {
              this.checker = checker;
              this.negated = false;
            }
            get not() {
              this.negated = !this.negated;
              return this;
            }
            array() {
              const condition = Array.isArray(this.checker.value);
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "array"],
              );
            }
            boolean() {
              const condition = typeof this.checker.value === "boolean";
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "boolean"],
              );
            }
            date() {
              const condition = this.checker.value instanceof Date;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "date"],
              );
            }
            differentFrom(complement) {
              const condition = this.checker.value !== complement;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "differentFrom"],
              );
            }
            equalTo(complement) {
              const condition = this.checker.value === complement;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "equalTo"],
              );
            }
            error() {
              const condition = this.checker.value instanceof Error;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "error"],
              );
            }
            function() {
              const condition = typeof this.checker.value === "function";
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "function"],
              );
            }
            keyOf(complement) {
              const condition = Object.keys(this.checker.value).includes(
                complement,
              );
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "keyOf"],
              );
            }
            lessOrEqualTo(complement) {
              const condition = this.checker.value <= complement;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "lessOrEqualTo"],
              );
            }
            lessThan(complement) {
              const condition = this.checker.value < complement;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "lessThan"],
              );
            }
            moreOrEqualTo(complement) {
              const condition = this.checker.value >= complement;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "moreOrEqualTo"],
              );
            }
            moreThan(complement) {
              const condition = this.checker.value > complement;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "moreThan"],
              );
            }
            normalNumber() {
              const condition =
                typeof this.checker.value === "number" &&
                !NumberisNaN(this.checker.value);
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "normalNumber"],
              );
            }
            get not() {
              this.negated = !this.negated;
              return this;
            }
            number() {
              const condition = typeof this.checker.value === "number";
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "number"],
              );
            }
            object() {
              const condition = typeof this.checker.value === "object";
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "object"],
              );
            }
            promise() {
              const condition = this.checker.value instanceof Promise;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "promise"],
              );
            }
            regex() {
              const condition = this.checker.value instanceof RegExp;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "regex"],
              );
            }
            string() {
              const condition = typeof this.checker.value === "string";
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "string"],
              );
            }
            valueOf(complement) {
              const condition = Object.values(complement).includes(
                this.checker.value,
              );
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["is", ...(this.negated ? ["not"] : []), "valueOf"],
              );
            }
          },
          HasInterface: class HasInterface {
            constructor(checker) {
              this.checker = checker;
              this.negated = false;
            }
            get not() {
              this.negated = !this.negated;
              return this;
            }
            key(id) {}
            value(value) {}
          },
          DoesInterface: class DoesInterface {
            constructor(checker) {
              this.checker = checker;
            }
            get not() {
              this.negated = !this.negated;
              return this;
            }
            throw() {
              if (typeof this.checker.value !== "function")
                throw new Error(
                  `Method «Checker.prototype.does${this.negated ? ".not" : ""}.throw» cannot be used against «${typeof this.checker.value}» only functions!`,
                );
              let condition = false;
              let catched = false;
              try {
                this.checker.value();
              } catch (error) {
                catched = error;
                condition = true;
              }
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["does", ...(this.negated ? ["not"] : []), "throw"],
                { catched },
              );
            }
            async throwAsync() {
              if (typeof this.checker.value !== "function")
                throw new Error(
                  `Method «Checker.prototype.does${this.negated ? ".not" : ""}.throwAsync» cannot be used against «${typeof this.checker.value}» only functions!`,
                );
              let condition = false;
              let catched = false;
              try {
                await this.checker.value();
              } catch (error) {
                catched = error;
                condition = true;
              }
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["does", ...(this.negated ? ["not"] : []), "throwAsync"],
                { catched },
              );
            }
            confirm() {
              if (typeof this.checker.value !== "function")
                throw new Error(
                  `Method «Checker.prototype.does${this.negated ? ".not" : ""}.confirm» cannot be used against «${typeof this.checker.value}» only functions!`,
                );
              const catched = this.checker.value();
              const condition = catched === true;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["does", ...(this.negated ? ["not"] : []), "confirm"],
                { catched },
              );
            }
            async confirmAsync() {
              if (typeof this.checker.value !== "function")
                throw new Error(
                  `Method «Checker.prototype.does${this.negated ? ".not" : ""}.confirmAsync» cannot be used against «${typeof this.checker.value}» only functions!`,
                );
              const catched = await this.checker.value();
              const condition = catched === true;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["does", ...(this.negated ? ["not"] : []), "confirmAsync"],
                { catched },
              );
            }
            return(complement) {
              if (typeof this.checker.value !== "function")
                throw new Error(
                  `Method «Checker.prototype.does${this.negated ? ".not" : ""}.return» cannot be used against «${typeof this.checker.value}» only functions!`,
                );
              const catched = this.checker.value();
              const condition =
                catched === complement && typeof catched !== "undefined";
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["does", ...(this.negated ? ["not"] : []), "return"],
                { catched },
              );
            }
            async returnAsync(complement) {
              if (typeof this.checker.value !== "function")
                throw new Error(
                  `Method «Checker.prototype.does${this.negated ? ".not" : ""}.returnAsync» cannot be used against «${typeof this.checker.value}» only functions!`,
                );
              const catched = await this.checker.value();
              const condition = catched === complement;
              return this.checker.clarify(
                this.negated ? !condition : condition,
                ["does", ...(this.negated ? ["not"] : []), "returnAsync"],
                { catched },
              );
            }
          },
        });
        // Prototype prestados:
        Object.assign(this.prototype, {
          clone: Std.all.Clonable.clone,
          config: Std.all.Configurable.config,
        });
        // Prototype propios:
        Object.assign(this.prototype, {
          clarify: function clarify(condition, predicate) {
            let output = undefined;
            let tmp = undefined;
            tmp = this.onCheckBefore(predicate, condition);
            output = typeof tmp === "undefined" ? output : tmp;
            if (condition && this.onCheckTrue) {
              tmp = this.onCheckTrue(predicate);
              output = typeof tmp === "undefined" ? output : tmp;
            } else if (this.onCheckFalse) {
              tmp = this.onCheckFalse(predicate);
              output = typeof tmp === "undefined" ? output : tmp;
            }
            tmp = this.onCheckAfter(predicate, condition);
            output = typeof tmp === "undefined" ? output : tmp;
            return typeof output === "undefined" ? this : output;
          },
          onCheckBefore: function onCheckBefore() {},
          onCheckAfter: function onCheckAfter(result, predicate) {},
          onCheckTrue: function onCheckTrue(predicate) {
            return this;
          },
          onCheckFalse: function onCheckFalse(predicate) {
            return false;
          },
          check: function check(value) {
            return this.config({ value });
          },
          its: function its(property) {
            if (typeof property === "string")
              return Checker.check(this.value[property]);
            if (!Array.isArray(property))
              throw new Error(
                `Parameter «property» must be string or array but «${typeof property}» was found on «Checker.prototype.its»`,
              );
            let pivot = this.value;
            for (let index = 0; index < property.length; index++) {
              const name = property[index];
              pivot = pivot[name];
            }
            return this.constructor.check(pivot);
          },
          that: function that(value) {
            return this.config({ value });
          },
        });
        Object.assign(this.prototype, {
          that: this.prototype.check,
        });
        Object.defineProperties(
          this,
          Object.getOwnPropertyDescriptors(Std.all.Newable),
        );
        Object.defineProperties(
          this.prototype,
          Object.getOwnPropertyDescriptors({
            get and() {
              return this.clone();
            },
            get it() {
              return this;
            },
            get is() {
              return new this.constructor.IsInterface(this);
            },
            get has() {
              return new this.constructor.HasInterface(this);
            },
            get does() {
              return new this.constructor.DoesInterface(this);
            },
          }),
        );
      }
    }),
    Asserter: (Std.classes.Asserter = class Asserter {
      static assert(condition, message) {
        if (!condition) throw new Error(message);
      }
    }),
    Validator: (Std.classes.Validator = class Validator {
      static assert(condition, message) {
        if (!condition) throw new Error(message);
      }
      static TypeRepresentation = class {
        constructor(id, definitionArgument = undefined) {
          this.id = id;
          this.definitionArgument = definitionArgument;
        }
      };
      static typology = {
        boolean: {
          equivalences: [Boolean],
          validate: function (it, definitionArgument = undefined) {
            const isSameJsType = typeof it === "boolean";
            let otherConditions = false;
            if (typeof definitionArgument === "undefined")
              otherConditions = true;
            else if (typeof definitionArgument === "boolean")
              otherConditions = it === definitionArgument;
            else
              throw new Error(
                `Required parameter «definitionArgument» to be undefined or boolean but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`,
              );
            return isSameJsType && otherConditions;
          },
        },
        number: {
          equivalences: [Number],
          validate: function (it, definitionArgument = undefined) {
            const isSameJsType = typeof it === "number";
            let otherConditions = false;
            if (typeof definitionArgument === "undefined")
              otherConditions = true;
            else if (typeof definitionArgument === "number")
              otherConditions = it === definitionArgument;
            else
              throw new Error(
                `Required parameter «definitionArgument» to be undefined or number but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`,
              );
            return isSameJsType && otherConditions;
          },
        },
        string: {
          equivalences: [String],
          validate: function (it, definitionArgument = undefined) {
            const isSameJsType = typeof it === "string";
            let otherConditions = false;
            if (typeof definitionArgument === "undefined")
              otherConditions = true;
            else if (typeof definitionArgument === "string")
              otherConditions = it === definitionArgument;
            else
              throw new Error(
                `Required parameter «definitionArgument» to be undefined or string but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`,
              );
            return isSameJsType && otherConditions;
          },
        },
        array: {
          equivalences: [Array],
          validate: function (it, definitionArgument = undefined) {
            const isSameJsType = Array.isArray(it);
            let otherConditions = false;
            if (typeof definitionArgument === "undefined")
              otherConditions = true;
            else if (typeof definitionArgument === "boolean")
              otherConditions = it === definitionArgument;
            else
              throw new Error(
                `Required parameter «definitionArgument» to be undefined or array but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`,
              );
            return isSameJsType && otherConditions;
          },
        },
        object: {
          equivalences: [Object],
          validate: function (it, definitionArgument = undefined) {
            const isSameJsType = typeof it === "object";
            let otherConditions = false;
            if (typeof definitionArgument === "undefined")
              otherConditions = true;
            else if (typeof definitionArgument === "boolean")
              otherConditions = it === definitionArgument;
            else
              throw new Error(
                `Required parameter «definitionArgument» to be undefined or object but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`,
              );
            return isSameJsType && otherConditions;
          },
        },
        function: {
          equivalences: [Function],
          validate: function (it, definitionArgument = undefined) {
            const isSameJsType = typeof it === "function";
            let otherConditions = false;
            if (typeof definitionArgument === "undefined")
              otherConditions = true;
            else
              throw new Error(
                `Required parameter «definitionArgument» to be undefined but «${typeof definitionArgument}» was found instead on «Validator.types.function»`,
              );
            return isSameJsType && otherConditions;
          },
        },
        promise: {
          equivalences: [Promise],
          validate: function (it, definitionArgument = undefined) {
            const isSameJsType = it instanceof Promise;
            let otherConditions = false;
            if (typeof definitionArgument === "undefined")
              otherConditions = true;
            else
              throw new Error(
                `Required parameter «definitionArgument» to be undefined but «${typeof definitionArgument}» was found instead on «Validator.types.promise»`,
              );
            return isSameJsType && otherConditions;
          },
        },
        date: {
          equivalences: [Date],
          validate: function (it, definitionArgument = undefined) {
            const isSameJsType = it instanceof Date;
            let otherConditions = false;
            if (typeof definitionArgument === "undefined")
              otherConditions = true;
            else
              throw new Error(
                `Required parameter «definitionArgument» to be undefined but «${typeof definitionArgument}» was found instead on «Validator.types.date»`,
              );
            return isSameJsType && otherConditions;
          },
        },
        options: {
          validate: function (it, definitionArgument = undefined) {},
        },
      };
      static validate(data, definition = {}) {
        return true;
      }
      static {
        Object.assign(this, {
          types: (() => {
            const all = {};
            for (let typeId in this.typology) {
              all[typeId] = (definitionArgument) =>
                new this.TypeRepresentation(typeId, definitionArgument);
            }
            return all;
          })(),
        });
      }
    }),
    PathResolver: (Std.classes.PathResolver = class PathResolver {
      static {
        Object.assign(this, {
          create: Std.all.Creable.create,
          isDebugging: false,
        });
        Object.assign(this.prototype, {
          clone: Std.all.Clonable.clone,
          config: Std.all.Configurable.config,
        });
        Object.defineProperties(
          this,
          Object.getOwnPropertyDescriptors(Std.all.Newable),
        );
      }

      isDebugging = this.constructor.isDebugging;

      basedir = "~";

      rootdir = "~";

      normalizationOf(input) {
        let output = input.replaceAll("\\", "/");
        if (/^[a-z]+:\/\//i.test(output)) output = output;
        if (output.startsWith("@/")) output = this.rootdir + output.slice(1);
        if (output.startsWith("./") || output.startsWith("../"))
          output = output.startsWith("./")
            ? this.basedir + output.slice(1)
            : require("path").resolve(this.basedir, output);
        if (/^[A-Z]:\//i.test(output))
          output = "/" + output[0] + output.slice(2);
        if (output.startsWith("//")) output = output.slice(1);
        if (output.startsWith("/")) output = output;
        if (this.isDebugging) {
          console.log("[*] [DEBUG] PathResolver.prototype.normalizationOf:");
          console.log("[*]    [in] " + input);
          console.log("[*]   [out] " + output);
        }
        return output;
      }

      basepathOf(input) {
        return this._relativePath(input, this.basedir, ".");
      }

      rootpathOf(input) {
        return this._relativePath(input, this.rootdir, "@");
      }

      _relativePath(_path, _anchor, prefix) {
        let output = undefined;
        let path = this.normalizationOf(_path);
        let anchor = _anchor === "/" ? "/" : _anchor.replace(/\/$/, "");
        if (path === anchor) output = prefix + "/";
        if (anchor !== "/" && !path.startsWith(anchor + "/")) output = path;
        else
          output = prefix + (anchor === "/" ? path : path.slice(anchor.length));
        return output;
      }

      setBasedir(input) {
        this.basedir = this.normalizationOf(input);
      }

      setRootdir(input) {
        this.rootdir = this.normalizationOf(input);
      }
    }),
  });
  Object.assign(Std.all, {
    Isolation: (Std.classes.Isolation = class Isolation {
      static {
        //Std.all.mixProperties(this, )
        // CURRECTA:
        //*
        Borrowed_interfaces: {
          // Statics:
          Std.all.ClassSkiller.addStatic(this, Std.all.EmptyConstructor.static);
          // Prototypes:
          Std.all.ClassSkiller.addPrototype(
            this,
            Std.all.EmptyConstructor.prototype,
          );
          Std.all.ClassSkiller.addPrototype(this, Std.all.Runnable);
        }
        Custom_interfaces: {
          // Custom interfaces:
          Std.all.ClassSkiller.addStatic(this, {
            catcher: Std.all.createIsolationCatcher,
          });
          Std.all.ClassSkiller.addPrototype(this, {
            onRunStart: undefined,
            onRunSuccess: undefined,
            onRunCatch: this.catcher("Isolation ${title} failed"),
            onRunEnd: undefined,
          });
        }
        //*/
      }
    }), // Compuesta por Runnable
    Tracer: (Std.classes.Tracer = class Tracer {
      static {
        Object.assign(this, {
          create: Std.all.Creable.create,
        });
        Object.assign(this.prototype, {
          clone: Std.all.Clonable.clone,
          config: Std.all.Configurable.config,
          run: Std.all.Runnable.run,
        });
        Object.defineProperties(
          this,
          Object.getOwnPropertyDescriptors(Std.all.Newable),
        );
      }
      isTracing = false;
      log() {}
      in() {}
      out() {}
      err() {}
      createSubtracer(configuration = {}) {
        return this.constructor.new.config(
          Object.assign({}, this, configuration),
        );
      }
    }),
  });
  Object.assign(Std.all, {
    Process: (Std.classes.Process = class Process extends Std.all.Isolation {
      static {
        Object.assign(this, {
          // create: Std.all.Creable.create,
          // catcher: Std.all.createIsolationCatcher,
        });
        Object.assign(this.prototype, {
          // clone: Std.all.Clonable.clone,
          // config: Std.all.Configurable.config,
          // run: Std.all.Runnable.run,
        });
        Object.defineProperties(this, Object.getOwnPropertyDescriptors({}));
        Object.defineProperties(
          this.prototype,
          Object.getOwnPropertyDescriptors(Std.all.NewSubprocessable),
        );
        Object.defineProperties(
          this.prototype,
          Object.getOwnPropertyDescriptors(Std.all.Pidable),
        );
      }
      createSubprocess = function createSubprocess(configurations = {}) {
        return this.constructor.new.config({
          ...configurations,
          ppid: this.pid,
        });
      };
    }), // Compuesta de Isolation
  });
  Object.assign(Std.all, {
    Tester: (Std.classes.Tester = class Tester extends Std.all.Process {
      static {
        Object.assign(this, {
          evaluateDirectory: async function evaluateDirectory(
            optionsBrute = {},
          ) {
            let options;
            const { directory, filename, filter, ignored, title, injection } =
              (options = $moduler.toolkit.normalizeOptions(optionsBrute, {
                directory: {
                  validate: (it) =>
                    typeof it === "string"
                      ? true
                      : `Parameter «directory» must be string but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
                },
                filename: {
                  default: false,
                  validate: (it) =>
                    it === false
                      ? true
                      : typeof it === "string"
                        ? true
                        : `Parameter «filename» must be string but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
                },
                ignored: {
                  default: [],
                  validate: (it) =>
                    Array.isArray(it)
                      ? true
                      : `Parameter «ignored» must be array but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
                },
                filter: {
                  default: false,
                  validate: (it) =>
                    it === false
                      ? true
                      : typeof it === "string"
                        ? true
                        : `Parameter «filter» must be string but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
                },
                title: {
                  default: false,
                  validate: (it) =>
                    typeof it === "string"
                      ? true
                      : `Parameter «title» must be string but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
                },
                injection: {
                  default: {},
                  validate: (it) =>
                    it === false
                      ? true
                      : typeof it === "object"
                        ? true
                        : `Parameter «injection» must be object but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
                },
              }));
            if (Std.all.Environmenter.isBrowser) {
              Std.all.Environmenter.throw(
                "Environment of browser is not supported right now on «Std.classes.Tester.evaluateDirectory»",
              );
            } else if (Std.all.Environmenter.isNodejs) {
              return this._evaluateDirectoryInNodejs(options);
            } else {
              Std.all.Environmenter.throw(
                "Environment must be browser or node.js on «Std.classes.Tester.evaluateDirectory»",
              );
            }
            console.log(directory);
            console.log(filename);
            console.log(filter);
            console.log(ignored);
            console.log(title);
            console.log(injection);
          },
          _evaluateDirectoryInNodejs:
            async function _evaluateDirectoryInNodejs({
              directory,
              filename,
              ignored,
              filter,
              title,
              injection,
            }) {
              const tests = await require("fs").promises.readdir(directory);
              Std.classes.Ansi.style("bgCyan,black").print(
                `[*] Std.classes.Tester found ${tests.length} tests to run on collection «${title}»`,
              );
              const errors = [];
              const preparation = [];
              const start = new Date();
              let lastMoment = start;
              const time = function () {
                const newNow = new Date();
                const difference = (newNow - lastMoment).toFixed();
                lastMoment = newNow;
                return difference + "ms";
              };
              Load_and_validation: for (
                let index = 0;
                index < tests.length;
                index++
              ) {
                const testId = tests[index];
                let testPath = `${directory}/${testId}`;
                Extract_path: {
                  if (typeof filename === "string") {
                    testPath = `${testPath}/${filename}`;
                  }
                }
                Ensure_file_exists: {
                  try {
                    if (await require("fs").promises.access(testPath)) throw {};
                  } catch (error) {
                    throw Error.create({
                      name: "MissingTestError",
                      message: `Collection of tests «${title}» is missing file «${testId}» on «Std.classes.Tester.evaluateDirectory»`,
                    });
                  }
                }
                let test;
                Extract_test: {
                  try {
                    test = require(testPath);
                  } catch (error) {
                    throw Error.create(error).adding({
                      name: "TestLoadError",
                      message: `Collection of tests «${title}» could not load using «require» test nº${index + 1}/${tests.length} of «${testId}» on «Std.classes.Tester.evaluateDirectory»`,
                    });
                  }
                }
                Validate_test: {
                  if (typeof test !== "function")
                    Error.throw({
                      name: "TestExportationError",
                      message: `Failed to load test nº${index + 1}/${tests.length} of «${testId}» because it is exporting «${typeof test}» instead of function on «Std.classes.Tester.evaluateDirectory»`,
                    });
                }
                preparation.push({
                  id: testId,
                  path: testPath,
                  callback: test,
                });
              }
              Execution: for (
                let index = 0;
                index < preparation.length;
                index++
              ) {
                const { id, path, callback } = preparation[index];
                let result;
                try {
                  result = await callback(injection);
                  Std.classes.Ansi.style("bgGreen,black").print(
                    `[*] Passed «${id}» [nº${index + 1}/${tests.length}] [${time()}]`,
                  );
                } catch (error) {
                  Std.classes.Ansi.style("bgRed,black").print(
                    `[!] Failed «${id}» [nº${index + 1}/${tests.length}] [${time()}]`,
                  );
                  Std.classes.Ansi.style("red").print(
                    `    Error: ${error.name}     `,
                  );
                  Std.classes.Ansi.style("red").print(
                    `    Message: ${error.message}   `,
                  );
                  errors.push({
                    id,
                    error: Error.create(error).adding({
                      name: "TestFailed",
                      message: `Failed «${id}» [nº${index + 1}/${tests.length}] [${time()}]`,
                    }),
                  });
                }
              }
              if (!errors.length) {
                Std.classes.Ansi.style("bgGreen,black").print(
                  `[*] Passed all tests for: ${title}`,
                );
              } else {
                Std.classes.Ansi.style("bgBlack,white,bold").print(
                  `🔴 Failed ${errors.length} tests on collection «${title}», see details:`,
                );
                const printErrors = function (list, pointer = []) {
                  for (let index = 0; index < list.length; index++) {
                    const item = list[index];
                    printError(item, pointer.concat([index]));
                  }
                };
                const printError = function (error, pointer = []) {
                  console.log(
                    `[suberror:] [${pointer.join(".")}] ${error.name}:${error.message} ${error.stack}`,
                  );
                  if (error.std?.history) {
                    printErrors(error.std.history, pointer.concat([]));
                  }
                };
                for (let index = 0; index < errors.length; index++) {
                  const details = errors[index];
                  Std.classes.Ansi.style("bgMagenta,black").print(
                    `🐞 [ERR=${index + 1}/${errors.length}] ${details.id} [TEST=${index + 1}/${tests.length}]`,
                  );
                  printError(details.error, [index]);
                }
                Std.classes.Ansi.style("bgBlack,white,bold").print(
                  `🔴 End of the ${errors.length} errors report on collection «${title}».`,
                );
              }
            },
        });
      }
    }), // Compuesta de Process
  });
  return Std;
});
