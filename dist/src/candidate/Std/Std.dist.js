module.exports = $moduler.export(
  "#Std",
  ["@/src/external/pegjs/peggyjs.object.js"],
  function ([peggyjs]) {
    return (function () {
      const Std = {};

      Object.assign(Std, {
        all: {},
        objects: {},
        functions: {},
        traits: {},
        interfaces: {},
        classes: {},
        parsers: {
          peggy: peggyjs,
        },
        types: {},
      });

      Std.all.ErrorExtension = (() => {
        Error.normalize = function (input) {
          let error = undefined;
          if (typeof input === "string") {
            error = new Error(input);
          } else if (input instanceof Error) {
            error = input;
          } else if (typeof input === "object") {
            error = new Error(input.message || "no message specified");
            error.name = input.name || "Error";
          }
          if (!error.std) {
            error.std = [];
            error.std.history = [];
          }
          return error;
        };

        Error.prototype.adding = function (input) {
          Error.normalize(this);
          this.std.history.push(Error.normalize(input));
          return this;
        };

        Error.throw = function (error) {
          throw Error.normalize(error);
        };
      })();

      Wave_1_Elemental_functions_classes_and_interfaces: {
        Std.assert =
          Std.all.assert =
          Std.functions.assert =
            function assert(
              condition,
              message = "assertion error (no details specified)",
            ) {
              if (!condition)
                throw Error.normalize(message).adding({
                  name: "AssertionError",
                  message: "Some assertion failed",
                });
            };
        Std.all.NativePrototypes = Std.objects.NativePrototypes = [
          null,
          Object.prototype,
          Array.prototype,
          Function.prototype,
          String.prototype,
          Number.prototype,
        ];
        Std.all.Printer = Std.functions.Printer = class Printer {
          static debug(...args) {
            for (let index = 0; index < args.length; index++) {
              const arg = args[index];
              console.log(index + ": " + typeof arg, arg);
            }
          }
          static json(...args) {
            for (let index = 0; index < args.length; index++) {
              const arg = args[index];
              try {
                console.log(
                  index + ": " + typeof arg,
                  JSON.stringify(arg, null, 2),
                );
              } catch (error) {
                console.log(index + ": " + typeof arg, arg);
              }
            }
          }

          static exiting = false;
          static currentQuestion = null;
          static questionsCloser() {
            this.exiting = true;
            if (this.currentQuestion) {
              this.currentQuestion.close();
              this.currentQuestion = null;
            }
          }
          static {
            process.once("SIGINT", this.questionsCloser);
            process.once("SIGTERM", this.questionsCloser);
          }
          static async ask(question, options = {}, ...others) {
            if (this.exiting) {
              throw new Error("Process exiting");
            }
            this.debug(...others);
            const rl = require("readline").promises.createInterface({
              input: process.stdin,
              output: process.stdout,
            });
            this.currentQuestion = rl;
            try {
              if (this.exiting) {
                throw new Error("Process exiting");
              }
              return await rl.question(question);
            } catch (error) {
              if (error.code === "ABORT_ERR") {
                this.exiting = true;
                return;
              }
              throw error;
            } finally {
              if (this.currentQuestion === rl) {
                this.currentQuestion = null;
              }
              rl.close();
            }
          }
        };
        Std.all.triggerMethodIfExists = Std.functions.triggerMethodIfExists =
          function triggerMethodIfExists(
            base,
            method,
            args = [],
            scope = false,
          ) {
            Std.all.Tracer?.globalInstance.in(
              "Std.functions.triggerMethodIfExists",
              arguments || [],
            );
            let output = undefined;
            if (base && typeof base[method] === "function") {
              if (scope) return base[method].call(scope, ...args);
              output = base[method](...args);
            }
            Std.all.Tracer?.globalInstance.out(
              "Std.functions.triggerMethodIfExists",
              arguments || [],
            );
            return output;
          };
        Std.all.Ansi = Std.classes.Ansi = ((Colors) => {
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
                typeof window !== "undefined" &&
                typeof document !== "undefined",
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
                  open(text) {},
                };
              },
              nodejsStylesReductor: function (out, it) {
                if (!(it in this.available)) {
                  return out;
                }
                const code = this.available[it];
                out += `\x1b[${code[0]}m`;
                return out;
              },
              nodejsStyle: function (config) {
                const styles = config.split(",");
                return {
                  text: (text) => {
                    const begin = styles.reduce(
                      this.nodejsStylesReductor.bind(this),
                      "",
                    );
                    const end = this.endToken;
                    return `${begin}${text}${end}`;
                  },
                  print(text) {
                    console.log(this.text(text));
                  },
                  open: (text = "") => {
                    console.log(
                      styles.reduce(this.nodejsStylesReductor.bind(this), "") +
                        text,
                    );
                  },
                };
              },
              style: Object.assign(
                function (config = "red,bold,underline") {
                  return this.isBrowser
                    ? this.browserStyle(config)
                    : this.nodejsStyle(config);
                },
                {
                  close: function () {
                    console.log("\u001b[0m");
                  },
                },
              ),
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
        );
        Std.all.CreableInterface = Std.interfaces.CreableInterface =
          // @interface:CreableInterface
          {
            prototype: {
              get new() {
                Std.all.Tracer?.globalInstance.log(
                  "CreableInterface.prototype.new",
                  arguments || [],
                );
                return this.constructor.create();
              },
            },
            static: {
              get new() {
                Std.all.Tracer?.globalInstance.log(
                  "CreableInterface.static.new",
                  arguments || [],
                );
                return this.create();
              },
              create: function (config = {}, constructorArgs = []) {
                Std.all.Tracer?.globalInstance.in(
                  "CreableInterface.static.create",
                  arguments || [],
                );
                const instanze = new this(...constructorArgs);
                let output = instanze;
                Apply_new_configurations: {
                  instanze.config(config);
                }
                Trigger_hook_on_create_if_any: {
                  if (instanze.onCreate) {
                    output =
                      instanze.onCreate({ parent: this, config }) || output;
                  }
                }
                Std.all.Tracer?.globalInstance.out(
                  "CreableInterface.static.create",
                  arguments || [],
                );
                return output;
              },
            },
          };
        Std.all.ClonableInterface = Std.interfaces.ClonableInterface =
          // @interface:ClonableInterface
          {
            prototype: {
              get newClone() {
                Std.all.Tracer?.globalInstance.log(
                  "ClonableInterface.prototype.newClone",
                  arguments || [],
                );
                return this.clone();
              },
              clone: function (config = {}) {
                Std.all.Tracer?.globalInstance.in(
                  "ClonableInterface.prototype.clone",
                  arguments || [],
                );
                Validate_unclonable_properties: {
                  if (this.unclonableProperties) {
                    for (
                      let index = 0;
                      index < this.unclonableProperties.length;
                      index++
                    ) {
                      const unclonableProperty =
                        this.unclonableProperties[index];
                      if (!(unclonableProperty in config)) {
                        Std.all.Tracer?.globalInstance.error(
                          "ClonableInterface.prototype.clone",
                          arguments || [],
                        );
                        throw new Error(
                          `Cannot clone without specifying property «${unclonableProperty}» on «ClonableInterface.prototype.clone»`,
                        );
                      }
                    }
                  }
                }
                Std.all.Tracer?.globalInstance.out(
                  "ClonableInterface.prototype.clone",
                  arguments || [],
                );
                return this.new.config(config);
              },
            },
            static: {},
          };
        Std.all.ConfigurableInterface = Std.interfaces.ConfigurableInterface =
          // @interface:ConfigurableInterface
          {
            prototype: {
              config: function (props = {}) {
                Std.all.Tracer?.globalInstance.log(
                  "ConfigurableInterface.prototype.config",
                  arguments || [],
                );
                return Object.assign(this, props);
              },
            },
            static: {},
          };
        Std.all.InstantiableInterface = Std.interfaces.InstantiableInterface = // @interface:InstantiableInterface
          $moduler.toolkit.makeInterface([
            Std.interfaces.CreableInterface,
            Std.interfaces.ConfigurableInterface,
            Std.interfaces.ClonableInterface,
          ]);
        Std.all.BooleanUtil = Std.classes.BooleanUtil = class BooleanUtil {
          static areEqual(...args) {
            let previous = args[0];
            for (let index = 1; index < args.length; index++) {
              const arg = args[index];
              if (arg !== previous) return false;
              previous = arg;
            }
            return true;
          }
        };
        Std.all.ObjectReflector =
          Std.classes.ObjectReflector = class ObjectReflector {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  {
                    static: {
                      getAllProperties: function getAllProperties(
                        object,
                        stopOnPrototypes = [],
                        ignoreJsPrototypes = true,
                      ) {
                        const properties = new Set();
                        Iterating_properties: while (object) {
                          for (const property of Reflect.ownKeys(object)) {
                            properties.add(property);
                          }
                          object = Object.getPrototypeOf(object);
                          if (
                            (ignoreJsPrototypes &&
                              Std.objects.NativePrototypes.includes(object)) ||
                            stopOnPrototypes.includes(object)
                          )
                            break Iterating_properties;
                        }
                        return [...properties];
                      },
                    },
                    prototype: {},
                  },
                ],
                this,
              );
            }
          };
        Std.all.FunctionReflector =
          Std.classes.FunctionReflector = class FunctionReflector {
            static {
              $moduler.toolkit.makeClass(
                [Std.interfaces.InstantiableInterface],
                this,
              );
            }
          };
        Std.all.ClassReflector =
          Std.classes.ClassReflector = class ClassReflector {
            static {
              $moduler.toolkit.makeClass(
                [Std.interfaces.InstantiableInterface],
                this,
              );
            }
          };
      }
      Wave_2_Utility_interfaces: {
        Std.all.IntrospectorInterface = Std.interfaces.IntrospectorInterface =
          // @interface:IntrospectorInterface
          {
            prototype: {},
            static: {
              get: function get(data, key) {
                return key.reduce((output, property) => {
                  return output?.[property];
                }, data);
              },
              set: function set(data, key, value) {
                let output = data;
                key.slice(0, -1).forEach((property) => {
                  output[property] ??= {};
                  output = output[property];
                });
                output[key[key.length - 1]] = value;
                return data;
              },
              has: function has(data, key) {
                return key.every((property) => {
                  if (
                    data == null ||
                    !Object.prototype.hasOwnProperty.call(data, property)
                  ) {
                    return false;
                  }
                  data = data[property];
                  return true;
                });
              },
              initialize: function initialize(data, key, value) {
                let output = data;
                key.slice(0, -1).forEach((property) => {
                  output[property] ??= {};
                  output = output[property];
                });
                const lastKey = key[key.length - 1];
                if (!(lastKey in output)) output[lastKey] = value;
                return data;
              },
            },
          };
        Std.all.IntrospectableInterfaceFactory =
          Std.interfaces.IntrospectableInterfaceFactory =
            function IntrospectableInterfaceFactory(
              introspectableField,
              getName = "get",
              setName = "set",
              hasName = "has",
              initializeName = "initialize",
              listName = "list",
            ) {
              // @factory:IntrospectableInterfaceFactory
              return {
                // @interface:IntrospectableInterface
                prototype: {
                  [getName]: function get(key) {
                    return Std.all.Introspector.get(
                      this[introspectableField],
                      key.split("/"),
                    );
                  },
                  [setName]: function set(key, value) {
                    return Std.all.Introspector.set(
                      this[introspectableField],
                      key.split("/"),
                      value,
                    );
                  },
                  [hasName]: function has(key) {
                    return Std.all.Introspector.has(
                      this[introspectableField],
                      key.split("/"),
                    );
                  },
                  [initializeName]: function initialize(key, value) {
                    return Std.all.Introspector.initialize(
                      this[introspectableField],
                      key.split("/"),
                      value,
                    );
                  },
                  [listName]: function list() {
                    return this[introspectableField];
                  },
                },
                static: {},
              };
            };
        Std.all.RunnableInterface = Std.interfaces.RunnableInterface =
          // @interface:RunnableInterface
          {
            static: {},
            prototype: {
              runAsync: async function (
                cycle,
                cloneConfig = false,
                metaprocess = {},
              ) {
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
                        `Parameter «cycle» when string it must be key in «this» but «${cycle}» was found instead on «RunnableInterface.prototype.runAsync »`,
                      );
                    if (typeof subject[cycle] === "function")
                      callback = subject[cycle];
                    else callback = () => this.runAsync(subject[cycle]);
                  } else if (typeof cycle === "function") {
                    callback = cycle;
                  } else if (Array.isArray(cycle)) {
                    callback = async function () {
                      for (let index = 0; index < cycle.length; index++) {
                        const step = cycle[index];
                        const result = await this.runAsync(step, false, {
                          isProgrammatic: true,
                        });
                        if (typeof result !== "undefined") return result;
                      }
                    };
                  } else
                    throw new Error(
                      `Parameter «cycle» must be string, function or array but «${typeof cycle}» was found instead on «RunnableInterface.prototype.runAsync »`,
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
                    error = Error.normalize(originalError);
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
                        `Parameter «cycle» when string it must be key in «this» but «${cycle}» was found instead on «RunnableInterface.prototype.runSync»`,
                      );
                    if (typeof subject[cycle] === "function")
                      callback = subject[cycle];
                    else callback = () => this.runAsync(subject[cycle]);
                  } else if (typeof cycle === "function") {
                    callback = cycle;
                  } else if (Array.isArray(cycle)) {
                    callback = function () {
                      for (let index = 0; index < cycle.length; index++) {
                        const step = cycle[index];
                        const result = this.runSync(step, false, {
                          isProgrammatic: true,
                        });
                        if (typeof result !== "undefined") return result;
                      }
                    };
                  } else
                    throw new Error(
                      `Parameter «cycle» must be string, function or array but «${typeof cycle}» was found instead on «RunnableInterface.prototype.runSync»`,
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
                    error = Error.normalize(originalError);
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
            },
          };
        Std.all.EnvironmenterInterface = Std.interfaces.EnvironmenterInterface =
          {
            static: {
              isBrowser: typeof window !== "undefined",
              isNodejs: typeof global !== "undefined",
            },
          };
        Std.all.TracerInterface = Std.interfaces.TracerInterface =
          // @interface:TracerInterface
          {
            prototype: {
              isTracing: false,
              parentTracer: null,
              level: null,
              onTraceMessageFormat(operation, method, args = []) {
                let id = this.id || "";
                if (id) id = `[${id}] `;
                return `${id}[${" ".repeat(this.level + (operation === "out" ? -1 : 0))}${operation === "in" ? ">" : operation === "out" ? "<" : operation === "log" ? "=" : "!"}] ${method}`;
              },
              onTraceArgumentsFormat: function (args, message) {
                let output = "";
                output += `${message}`.padEnd(50, " ");
                output += args.length ? ` with 0-${args.length - 1}:` : "";
                output += Array.from(args)
                  .map((arg, index) => {
                    let part = "";
                    part += ` @${index}`;
                    if (typeof arg === "string") {
                      if (args.length && arg.length < 25) {
                        part += ` ${JSON.stringify(arg)}`;
                      } else if (arg.length) {
                        part += ` ${typeof arg}`;
                        part += ` [length:${arg.length}]`;
                      } else {
                        part += ` ""`;
                      }
                    } else if (Array.isArray(arg)) {
                      if (arg.length) {
                        part += ` [${arg.length}`;
                        if (arg.length < 20) {
                          part += `=${arg.map((row) => typeof row).join(",")}`;
                        }
                        part += `]`;
                      } else {
                        part += ` []`;
                      }
                    } else if (typeof arg === "object" && arg !== null) {
                      part += ``;
                      const keys = Object.keys(arg);
                      if (keys.length && keys.length < 10) {
                        part += ` object [keys=${keys.join(",")}]`;
                      } else if (keys.length) {
                        part += ` object [keys:${keys.length}]`;
                      } else {
                        part += ` {}`;
                      }
                    } else if (typeof arg === "number") {
                      part += ` ${arg}`;
                    } else if (typeof arg === "boolean") {
                      part += ` ${arg}`;
                    }
                    return part;
                  })
                  .join(" |");
                return output;
              },
              log: function (method, args = []) {
                if (!this.isTracing) return false;
                const message = this.onTraceMessageFormat("log", method, args);
                Std.all.Ansi.style("blackBright").print(
                  this.onTraceArgumentsFormat(args, message),
                );
              },
              in: function (method, args = []) {
                if (!this.isTracing) return false;
                const message = this.onTraceMessageFormat("in", method, args);
                this.level = this.level || 0;
                this.level++;
                Std.all.Ansi.style("cyan").print(
                  this.onTraceArgumentsFormat(args, message),
                );
              },
              out: function (method, args = []) {
                if (!this.isTracing) return false;
                const message = this.onTraceMessageFormat("out", method, args);
                this.level = this.level || 0;
                this.level--;
                Std.all.Ansi.style("blackBright").print(
                  this.onTraceArgumentsFormat(args, message),
                );
              },
              error: function (method, args = []) {
                // if(!this.isTracing) return false;
                const message = this.onTraceMessageFormat(
                  "error",
                  method,
                  args,
                );
                this.level = this.level || 0;
                this.level--;
                Std.all.Ansi.style("red,bold").print(
                  this.onTraceArgumentsFormat(args, message),
                );
              },
            },
            static: {},
          };
        Std.all.CheckerInterface = Std.interfaces.CheckerInterface =
          // @interface:CheckerInterface
          {
            prototype: {
              check: function (condition, ...otherParameters) {
                Std.all.Tracer?.globalInstance.in(
                  "CheckerInterface.prototype.check",
                  arguments || [],
                );
                Std.functions.triggerMethodIfExists(
                  this,
                  "onCheckStart",
                  otherParameters,
                );
                if (condition) {
                  Std.functions.triggerMethodIfExists(
                    this,
                    "onCheckSuccess",
                    otherParameters,
                  );
                } else {
                  Std.functions.triggerMethodIfExists(
                    this,
                    "onCheckError",
                    otherParameters,
                  );
                }
                Std.functions.triggerMethodIfExists(
                  this,
                  "onCheckEnd",
                  otherParameters,
                );
                Std.all.Tracer?.globalInstance.out(
                  "CheckerInterface.prototype.check",
                  arguments || [],
                );
                return condition;
              },
            },
            static: {},
          };
        Std.all.AsserterInterface = Std.interfaces.AsserterInterface =
          // @interface:AsserterInterface
          {
            prototype: {
              matchesError: function (expectedError, error) {
                if (expectedError === false) return true;
                if (typeof expectedError === "function") {
                  return expectedError(error);
                } else if (typeof expectedError === "object") {
                  if (expectedError.name && expectedError.name !== error.name)
                    return false;
                  if (
                    expectedError.message &&
                    expectedError.message !== error.message
                  )
                    return false;
                  return true;
                } else if (typeof expectedError === "string") {
                  if (
                    ![expectedError.name, expectedError.message].includes(
                      expectedError,
                    )
                  )
                    return false;
                  return true;
                } else
                  throw new Error(
                    "Parameter «expectedError» must be function, object or string",
                  );
              },
              assert: function (
                condition,
                message = "untitled error",
                ...otherParameters
              ) {
                Std.all.Tracer?.globalInstance.in(
                  "AsserterInterface.prototype.assert",
                  arguments || [],
                );
                const eventParameters = [condition, message].concat(
                  otherParameters,
                );
                Std.functions.triggerMethodIfExists(
                  this,
                  "onAssertStart",
                  eventParameters,
                );
                if (condition) {
                  Std.functions.triggerMethodIfExists(
                    this,
                    "onAssertSuccess",
                    eventParameters,
                  );
                } else {
                  Std.functions.triggerMethodIfExists(
                    this,
                    "onAssertError",
                    eventParameters,
                  );
                }
                Std.functions.triggerMethodIfExists(
                  this,
                  "onAssertEnd",
                  eventParameters,
                );
                if (!condition) {
                  const error = new Error(message);
                  error.name = "AssertionError";
                  Std.all.Tracer?.globalInstance.error(
                    "AsserterInterface.prototype.assert",
                    arguments || [],
                  );
                  throw error;
                }
                Std.all.Tracer?.globalInstance.out(
                  "AsserterInterface.prototype.assert",
                  arguments || [],
                );
                return true;
              },
              assertThrowsSync: function (
                callback,
                message = "",
                expectedError = false,
              ) {
                Std.all.Tracer?.globalInstance.in(
                  "AsserterInterface.prototype.assertThrowsSync",
                  arguments || [],
                );
                let thrownError = false;
                const fakeError = new Error();
                try {
                  callback();
                  throw fakeError;
                } catch (error) {
                  if (error !== fakeError) {
                    thrownError = error;
                  }
                }
                if (!thrownError) {
                  Std.all.Tracer?.globalInstance.error(
                    "AsserterInterface.prototype.assert",
                    arguments || [],
                  );
                  throw new Error(
                    `Method «assertThrowsSync» expected callback to throw but it did not on: ${message}`,
                  );
                }
                if (!this.matchesError(expectedError, thrownError)) {
                  Std.all.Tracer?.globalInstance.error(
                    "AsserterInterface.prototype.assert",
                    arguments || [],
                  );
                  throw new Error(
                    `Method «assertThrowsSync» expected one error but got another:\n  - expected: ${expectedError.name} | ${expectedError.message}\n  - current:  ${thrownError.name} | ${thrownError.message}`,
                  );
                }
                Std.all.Tracer?.globalInstance.out(
                  "AsserterInterface.prototype.assert",
                  arguments || [],
                );
                return true;
              },
              assertThrowsAsync: async function (
                callback,
                message = "",
                expectedError = false,
              ) {
                Std.all.Tracer?.globalInstance.in(
                  "AsserterInterface.prototype.assertThrowsAsync",
                  arguments || [],
                );
                let thrownError = false;
                const fakeError = new Error();
                try {
                  await callback();
                  throw fakeError;
                } catch (error) {
                  if (error !== fakeError) {
                    thrownError = error;
                  }
                }
                if (!thrownError) {
                  Std.all.Tracer?.globalInstance.error(
                    "AsserterInterface.prototype.assertThrowsAsync",
                    arguments || [],
                  );
                  throw new Error(
                    `Method «assertThrowsAsync» expected callback to throw but it did not on: ${message}`,
                  );
                }
                if (!this.matchesError(expectedError, thrownError)) {
                  Std.all.Tracer?.globalInstance.error(
                    "AsserterInterface.prototype.assertThrowsAsync",
                    arguments || [],
                  );
                  throw new Error(
                    `Method «assertThrowsSync» expected one error but got another:\n  - expected: ${expectedError.name} | ${expectedError.message}\n  - current:  ${thrownError.name} | ${thrownError.message}`,
                  );
                }
                Std.all.Tracer?.globalInstance.out(
                  "AsserterInterface.prototype.assertThrowsAsync",
                  arguments || [],
                );
                return true;
              },
              assertDoesNotThrowSync: function (callback, message = "") {
                Std.all.Tracer?.globalInstance.in(
                  "AsserterInterface.prototype.assertThrowsAsync",
                  arguments || [],
                );
                let thrownError = false;
                const fakeError = new Error();
                try {
                  callback();
                  throw fakeError;
                } catch (error) {
                  if (error !== fakeError) {
                    thrownError = error;
                  }
                }
                if (thrownError) {
                  Std.all.Tracer?.globalInstance.error(
                    "AsserterInterface.prototype.assertDoesNotThrowSync",
                    arguments || [],
                  );
                  throw thrownError;
                }
                Std.all.Tracer?.globalInstance.out(
                  "AsserterInterface.prototype.assertDoesNotThrowSync",
                  arguments || [],
                );
                return true;
              },
              assertDoesNotThrowAsync: function (callback, message = "") {
                Std.all.Tracer?.globalInstance.in(
                  "AsserterInterface.prototype.assertDoesNotThrowAsync",
                  arguments || [],
                );
                let thrownError = false;
                const fakeError = new Error();
                try {
                  callback();
                  throw fakeError;
                } catch (error) {
                  if (error !== fakeError) {
                    thrownError = error;
                  }
                }
                if (thrownError) {
                  Std.all.Tracer?.globalInstance.error(
                    "AsserterInterface.prototype.assertDoesNotThrowAsync",
                    arguments || [],
                  );
                  throw thrownError;
                }
                Std.all.Tracer?.globalInstance.out(
                  "AsserterInterface.prototype.assertDoesNotThrowAsync",
                  arguments || [],
                );
                return true;
              },
            },
            static: {},
          };
        Std.all.TesterInterface = Std.interfaces.TesterInterface = {
          static: {
            evaluateDirectory: async function evaluateDirectory(
              optionsBrute = {},
            ) {
              Std.all.Tracer?.globalInstance.in(
                "TesterInterface.static.evaluateDirectory",
                arguments || [],
              );
              let output;
              let options;
              try {
                Directory_evaluation: {
                  const {
                    directory,
                    filename,
                    filter,
                    ignored,
                    title,
                    injection,
                  } = (options = $moduler.toolkit.normalizeOptions(
                    optionsBrute,
                    {
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
                            : typeof it === "function"
                              ? true
                              : `Parameter «filter» must be function but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
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
                    },
                  ));
                  if (Std.all.Environmenter.isBrowser) {
                    Std.all.Tracer?.globalInstance.error(
                      "TesterInterface.static.evaluateDirectory",
                      arguments || [],
                    );
                    Std.all.Environmenter.throw(
                      "Environment of browser is not supported right now on «Std.classes.Tester.evaluateDirectory»",
                    );
                  }
                  const tests = await require("fs").promises.readdir(directory);
                  Std.classes.Ansi.style("bgCyan,black").print(
                    `[*] Std.classes.Tester found ${tests.length} tests to run on collection «${title}»`,
                  );
                  const errors = [];
                  const start = new Date();
                  let preparation = [];
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
                        if (await require("fs").promises.access(testPath))
                          throw {};
                      } catch (error) {
                        Std.all.Tracer?.globalInstance.error(
                          "TesterInterface.static.evaluateDirectory",
                          arguments || [],
                        );
                        throw Error.normalize({
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
                        Std.all.Tracer?.globalInstance.error(
                          "TesterInterface.static.evaluateDirectory",
                          arguments || [],
                        );
                        throw Error.normalize(error).adding({
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
                  Filter_tests: {
                    if (filter) {
                      Option_of_filter: {
                        preparation = preparation.filter(filter);
                      }
                    }
                    if (ignored) {
                      Option_of_ignored: {
                        preparation = preparation.filter((test) => {
                          Iterating_ignored: for (
                            let indexIgnored = 0;
                            indexIgnored < ignored.length;
                            indexIgnored++
                          ) {
                            const ignoreSelector = ignored[indexIgnored];
                            let isMatch = false;
                            if (typeof ignoreSelector === "string") {
                              if (ignoreSelector.startsWith("^")) {
                                if (
                                  test.id.startsWith(ignoreSelector.substr(1))
                                ) {
                                  return false;
                                }
                              } else if (test.id.includes(ignoreSelector)) {
                                return false;
                              }
                            } else
                              throw Error.throw({
                                name: "TestIgnoredBadSelectorTypeError",
                                message: `Parameter «ignored» at index «${indexIgnored}» must be string on «Tester.evaluateDirectoryInNodejs»`,
                              });
                          }
                          return true;
                        });
                      }
                    }
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
                        error: Error.normalize(error).adding({
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
                        `[Error=${pointer.join(".")}] ${error.name}: ${error.message}`,
                      );
                      console.log(error.stack);
                      if (error.std?.history) {
                        printErrors(error.std.history, pointer.concat([]));
                      }
                      Print_syntax_error_details: if (error.location) {
                        //break Print_syntax_error_details;
                        console.log("Location", error.location);
                        console.log("Found", error.found);
                        console.log("Expected");
                        console.log(
                          error.expected
                            .map((it, index) => {
                              if (it?.type === "class")
                                return `${JSON.stringify(it.parts)} (class)`;
                              if (it?.type === "literal")
                                return `${JSON.stringify(it.text)} (literal)`;
                              return it;
                            })
                            .filter((it, index, all) => {
                              return all.indexOf(it) === index;
                            })
                            .reverse()
                            .map((it, index) => {
                              return `   - ${index + 1}. ${it}`;
                            })
                            .join("\n"),
                        );
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
                }
                Std.all.Tracer?.globalInstance.out(
                  "TesterInterface.static.evaluateDirectory",
                  arguments || [],
                );
              } catch (error) {
                Std.all.Tracer?.globalInstance.error(
                  "TesterInterface.static.evaluateDirectory",
                  arguments || [],
                );
              }
            },
            evaluateCallback: async function evaluateCallback(callback) {},
          },
          prototype: {},
        };
        Std.all.PropertiesMergerInterface =
          Std.interfaces.PropertiesMergerInterface = {
            static: {
              mergeByPropertiesList: function mergeByPropertiesList(
                instructions,
                input = [],
              ) {
                const output = {};
                // @PASO 1. Procesamos primero las propiedades más generales.
                const ordered = [...instructions].sort((a, b) => {
                  return a[0].length - b[0].length;
                });
                // @PASO . Cada instrucción reduce los valores de todos los inputs.
                for (const [key, merger] of ordered) {
                  let value = undefined;
                  for (const item of input) {
                    value = merger(
                      value,
                      Std.classes.Introspector.get(item, key),
                    );
                  }
                  Std.classes.Introspector.set(output, key, value);
                }
                return output;
              },
            },
          };
        Std.all.UrlerInterface = Std.interfaces.UrlerInterface = {
          static: {},
          prototype: {
            isDebugging: this.constructor.isDebugging,
            basedir: "~",
            rootdir: "~",
            normalizationOf(input) {
              let output = input.replaceAll("\\", "/");
              if (/^[a-z]+:\/\//i.test(output)) output = output;
              if (output.startsWith("@/"))
                output = this.rootdir + output.slice(1);
              if (output.startsWith("./") || output.startsWith("../"))
                output = output.startsWith("./")
                  ? this.basedir + output.slice(1)
                  : require("path").resolve(this.basedir, output);
              if (/^[A-Z]:\//i.test(output))
                output = "/" + output[0] + output.slice(2);
              if (output.startsWith("//")) output = output.slice(1);
              if (output.startsWith("/")) output = output;
              if (this.isDebugging) {
                console.log(
                  "[*] [DEBUG] PathResolver.prototype.normalizationOf:",
                );
                console.log("[*]    [in] " + input);
                console.log("[*]   [out] " + output);
              }
              return output;
            },
            basepathOf(input) {
              return this._relativePath(input, this.basedir, ".");
            },
            rootpathOf(input) {
              return this._relativePath(input, this.rootdir, "@");
            },
            _relativePath(_path, _anchor, prefix) {
              let output = undefined;
              let path = this.normalizationOf(_path);
              let anchor = _anchor === "/" ? "/" : _anchor.replace(/\/$/, "");
              if (path === anchor) output = prefix + "/";
              if (anchor !== "/" && !path.startsWith(anchor + "/"))
                output = path;
              else
                output =
                  prefix + (anchor === "/" ? path : path.slice(anchor.length));
              return output;
            },
            setBasedir(input) {
              this.basedir = this.normalizationOf(input);
            },
            setRootdir(input) {
              this.rootdir = this.normalizationOf(input);
            },
          },
        };
        Std.all.ValidationStepInterface =
          Std.interfaces.ValidationStepInterface =
            // @interface:ValidationStepInterface
            {
              prototype: {
                onCreate: function () {
                  this.dataPointer = [];
                  this.validatorPointer = [];
                },
              },
              static: {},
            };
        Std.all.ValidationStateInterface =
          Std.interfaces.ValidationStateInterface =
            // @interface:ValidationStepInterface
            {
              static: {},
              prototype: {
                newStep: function newStep(step) {
                  if (!this.steps) this.steps = [];
                  this.steps.push(step);
                },
                onCreate: function () {
                  this.result = Std.all.ValidationResult.new;
                },
              },
            };
        Std.all.ValidationResultInterface =
          Std.interfaces.ValidationResultInterface =
            // @interface:ValidationResultInterface
            {
              static: {},
              prototype: {
                onCreate: function () {
                  this.output = {};
                  this.deambiguation = null;
                  this.errors = [];
                },
              },
            };
        Std.all.TypesValidatorInterface =
          Std.interfaces.TypesValidatorInterface =
            // @interface:TypesValidatorInterface
            {
              prototype: {},
              static: {
                validateData: async function validateData(
                  validator,
                  data,
                  stateBrute = false,
                  stepBrute = false,
                ) {
                  Std.all.Tracer?.globalInstance.in(
                    "TypesValidator.validateData",
                    arguments || [],
                  );
                  let state, step;
                  All_validation: {
                    Step_1_Initialize: {
                      state =
                        stateBrute ||
                        Std.classes.ValidationState.new.config({
                          data,
                          validator,
                        });
                      step =
                        stepBrute ||
                        Std.classes.ValidationStep.new.config({
                          dataSubset: data,
                          validatorSubset: validator,
                        });
                      Std.assert(
                        state instanceof Std.classes.ValidationState,
                        `Parameter «state» must be instance of «Std.classes.ValidationState» on «TypesValidatorInterface.static.validateData»`,
                      );
                    }
                    Step_2_Digest_validation: {
                      Skip_on_optionality: {
                        if (
                          validator.optional === true &&
                          typeof data === "undefined"
                        ) {
                          step.result = {
                            "*type": "object",
                            value: data,
                            validated: true,
                            because: "optional value",
                            fails: [
                              Error.normalize({
                                name: "ValidationWarning",
                                message: `Property «data.${step.dataPointer.join(".")}» is optional and undefined`,
                              }),
                            ],
                          };
                          break Step_2_Digest_validation;
                        }
                      }
                      Validate_specific_type: {
                        let localError = null;
                        let localValidation = {
                          hasError: function () {
                            return localError !== null;
                          },
                          getError: function () {
                            return localError;
                          },
                          setError: function (error) {
                            localError = error;
                          },
                        };
                        try {
                          if (validator.grammar === "object type") {
                            await this.validateTypeObject(
                              validator,
                              data,
                              step,
                              state,
                            );
                          } else if (validator.grammar === "array type") {
                            await this.validateTypeArray(
                              validator,
                              data,
                              step,
                              state,
                            );
                          } else if (validator.grammar === "type id") {
                            await this.validateTypeId(
                              validator,
                              data,
                              step,
                              state,
                            );
                          } else
                            throw Error.normalize({
                              name: "ValidationError",
                              message: `Validator contains grammar «${validator.grammar}» which is not known`,
                            });
                        } catch (error) {
                          localError = error;
                        }
                        if (validator.appendix) {
                          await this.validateTypeAppendix(
                            validator,
                            data,
                            step,
                            state,
                            localValidation,
                          );
                        }
                        if (localError !== null) {
                          Std.all.Tracer?.globalInstance.error(
                            "TypesValidator.validateData",
                            arguments || [],
                          );
                          throw localError;
                        }
                      }
                    }
                  }
                  Final_step_Return: {
                    Std.all.Introspector.set(
                      state.result,
                      step.dataPointer,
                      step.result,
                    );
                    Std.all.Tracer?.globalInstance.out(
                      "TypesValidator.validateData",
                      arguments || [],
                    );
                    return step.result;
                  }
                  /*
  --------------------------
  5 gens / 3 methods:
  {}          - validateTypeObject
  []          - validateTypeArray
  ()          - [-]
  type(__,__) - validateTypeId
  type        - validateTypeId
  1 prefix / 1 method:
  !           - applyNegation
  3 suffixes / 3 methods:
  ?           - applyOptionality
  & __        - applyLogicalAnd
  | __        - applyLogicalOr
  --------------------------
  //*/
                },
                validateTypeObject: async function validateTypeObject(
                  validator,
                  data,
                  step,
                  state,
                ) {
                  const keys = Object.keys(validator.properties || {});
                  const validation = {};
                  Validating_properties: for (
                    let index = 0;
                    index < keys.length;
                    index++
                  ) {
                    let subvalidation;
                    const key = keys[index];
                    const subvalidator = validator.properties[key];
                    Skip_by_optionalProperty: {
                      if (
                        subvalidator.optionalProperty === true &&
                        typeof data[key] === "undefined"
                      ) {
                        subvalidation = {
                          "*type": "object",
                          value: data[key],
                          validated: true,
                          because: "optional property",
                          fails: [
                            Error.normalize({
                              name: "ValidationWarning",
                              message: `Property «${keys.slice(0, index).join(".")}» is optional and missing`,
                            }),
                          ],
                        };
                        continue Validating_properties;
                      }
                    }
                    try {
                      subvalidation = await this.validateData(
                        validator.properties[key],
                        data[key],
                        state,
                        step.newClone.config({
                          dataPointer: step.dataPointer.concat([key]),
                          validatorPointer: step.dataPointer.concat([
                            "properties",
                            key,
                          ]),
                        }),
                      );
                    } catch (error) {
                      throw error;
                    }
                    validation[key] = subvalidation;
                  }
                  return (step.result = validation);
                },
                validateTypeArray: async function validateTypeArray(
                  validator,
                  data,
                  step,
                  state,
                ) {
                  Std.all.Printer.debug(validator, data, step, state);
                  const validation = {};
                  for (let index = 0; index < validator.length; index++) {
                    const item = validator[index];
                    const subvalidation = await this.validateData(
                      item,
                      data[index],
                      state,
                      step.newClone.config({
                        dataPointer: step.dataPointer.concat([index]),
                        validatorPointer: step.validatorPointer.concat([index]),
                      }),
                    );
                    validation[index] = subvalidation;
                  }
                  return (step.result = validation);
                },
                validateTypeId: function validateTypeId(
                  validator,
                  data,
                  step,
                  state,
                ) {
                  const TypeClass = Std.types[validator.id];
                  //console.log(validator, data, step, state);
                  return (step.result = TypeClass.abstraction.onValidateData(
                    data,
                    validator,
                    step,
                    state,
                  ));
                },
                validateTypeAppendix: async function validateTypeAppendix(
                  validator,
                  data,
                  step,
                  state,
                  localValidation,
                ) {
                  Std.all.Tracer?.globalInstance.in(
                    "TypesValidator.validateTypeAppendix",
                    arguments || [],
                  );
                  let output = step.result ? [step.result] : [];
                  // await Std.all.Printer.ask("Entramos en validateData", localValidation, output);
                  Decide_logical_and_or_concatenation_final_result: {
                    Si_ya_venia_acertando_limpiamos: {
                      if (
                        validator.appendix?.[0].operator === "|" &&
                        localValidation.getError() === null
                      ) {
                        console.log("Ha pasado | porque venía limpia de antes");
                        localValidation.setError(null);
                        break Decide_logical_and_or_concatenation_final_result;
                      }
                    }
                    Iterating_appendix: for (
                      let indexAppendment = 0;
                      indexAppendment < validator.appendix.length;
                      indexAppendment++
                    ) {
                      const subvalidator = validator.appendix[indexAppendment];
                      const { operator, complement } = subvalidator;
                      let result = undefined;
                      if (operator === "|") {
                        try {
                          result = await this.validateData(
                            subvalidator.complement,
                            data,
                            state,
                            step.newClone.config({
                              dataPointer: step.dataPointer.concat([]),
                              validatorPointer: step.validatorPointer.concat([
                                "appendix",
                                indexAppendment,
                                "complement",
                              ]),
                            }),
                          );
                          Si_pasa_lo_limpiamos_y_devolvemos: {
                            console.log("Ha pasado |");
                            output.push(result);
                            localValidation.setError(null);
                            break Iterating_appendix;
                          }
                        } catch (error) {
                          console.log("Ha fallado |");
                          output.push(error);
                          localValidation.setError(
                            Error.normalize(error)
                              .adding(localValidation.getError())
                              .adding({
                                name: "ValidationError",
                                message: "Failed «|» operation",
                              }),
                          );
                        }
                      } else if (operator === "&") {
                        Si_tenia_un_error_lo_lanzamos: {
                          if (localValidation.getError() !== null) {
                            Std.all.Tracer?.globalInstance.error(
                              "TypesValidator.validateTypeAppendix",
                              arguments || [],
                            );
                            throw Error.normalize(
                              localValidation.getError(),
                            ).adding({
                              name: "ValidationError",
                              message: `Logical «${operator}» appendix at index «${indexAppendment}» is not accomplished`,
                            });
                          }
                        }
                        try {
                          result = await this.validateData(
                            subvalidator.complement,
                            data,
                            state,
                            step.newClone.config({
                              dataPointer: step.dataPointer.concat([]),
                              validatorPointer: step.validatorPointer.concat([
                                "appendix",
                                indexAppendment,
                                "complement",
                              ]),
                            }),
                          );
                          output.push(result);
                          console.log("Ha pasado &");
                        } catch (error) {
                          console.log("Ha fallado &");
                          output.push(error);
                          localValidation.setError(
                            Error.normalize(error)
                              .adding(localValidation.getError())
                              .adding({
                                name: "ValidationError",
                                message: "Failed «&» operation",
                              }),
                          );
                        }
                      }
                    }
                  }
                  // await Std.all.Printer.ask("Salimos de validateData", localValidation, output);
                  if (localValidation.getError() !== null) {
                    Std.all.Tracer?.globalInstance.error(
                      "TypesValidator.validateTypeAppendix",
                      arguments || [],
                    );
                    throw localValidation.getError();
                  }
                  Std.all.Tracer?.globalInstance.out(
                    "TypesValidator.validateTypeAppendix",
                    arguments || [],
                  );
                  return (step.result = output);
                },
              },
            };
        Std.all.TypesCatalogInterface = Std.interfaces.TypesCatalogInterface =
          // @interface:TypesCatalogInterface
          {
            prototype: {
              onCreate: function TypesCatalogInterface_onCreate() {
                this.all = this.constructor.createBasicTypesCatalog({});
              },
            },
            static: {
              createBasicTypesCatalog: function createBasicTypesCatalog(
                props = {},
              ) {
                return Object.create(Std.objects.BasicTypes, props);
              },
            },
          };
      }
      Wave_3_Utility_classes: {
        Std.all.Introspector = Std.classes.Introspector = class Introspector {
          static {
            $moduler.toolkit.makeClass(
              [Std.interfaces.IntrospectorInterface],
              this,
            );
          }
        };
        Std.all.Urler = Std.classes.Urler = class Urler {
          static {
            $moduler.toolkit.makeClass(
              [
                Std.interfaces.InstantiableInterface,
                Std.interfaces.UrlerInterface,
              ],
              this,
            );
          }
        };
        Std.all.Environmenter =
          Std.classes.Environmenter = class Environmenter {
            static {
              $moduler.toolkit.makeClass(
                [Std.interfaces.EnvironmenterInterface],
                this,
              );
            }
          };
        Std.all.Tracer = Std.classes.Tracer = class Tracer {
          static {
            $moduler.toolkit.makeClass(
              [
                Std.interfaces.InstantiableInterface,
                Std.interfaces.TracerInterface,
              ],
              this,
            );
          }
          static globalInstance = this.new.config({
            id: "main",
            isTracing: true,
          });
        };
        Std.all.Checker = Std.classes.Checker = class Checker {
          static {
            $moduler.toolkit.makeClass(
              [
                Std.interfaces.InstantiableInterface,
                Std.interfaces.CheckerInterface,
              ],
              this,
            );
          }
        };
        Std.all.Asserter = Std.classes.Asserter = class Asserter {
          static {
            $moduler.toolkit.makeClass(
              [
                Std.interfaces.InstantiableInterface,
                Std.interfaces.AsserterInterface,
              ],
              this,
            );
          }
        };
        Std.all.PropertiesMerger =
          Std.classes.PropertiesMerger = class PropertiesMerger {
            static {
              $moduler.toolkit.makeClass(
                [Std.interfaces.PropertiesMergerInterface],
                this,
              );
            }
          };
        Std.all.Tester = Std.classes.Tester = class Tester {
          static {
            $moduler.toolkit.makeClass(
              [
                Std.interfaces.InstantiableInterface,
                Std.interfaces.RunnableInterface,
                Std.interfaces.CheckerInterface,
                Std.interfaces.AsserterInterface,
                Std.interfaces.TesterInterface,
              ],
              this,
            );
          }
        };
      }
      Wave_4_Types_system: {
        Std.all.BasicTypes = Std.objects.BasicTypes = {
          boolean: (Std.types.boolean = class Type_boolean {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  (Std.interfaces.TypeBooleanInterface =
                    // @interface:TypeBooleanInterface
                    {
                      prototype: {},
                      static: {
                        abstraction: {
                          onValidateData(input, validator, step, state) {
                            if (typeof input !== "boolean") {
                              throw Error.normalize({
                                name: "ValidationError",
                                message: `Required «input» to be boolean but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»`,
                              });
                            }
                            return {
                              "*type": "boolean",
                              value: input,
                              validated: true,
                            };
                          },
                        },
                      },
                    }),
                ],
                this,
              );
            }
          }),
          number: (Std.types.number = class Type_number {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  (Std.interfaces.TypeNumberInterface = {
                    // @interface:TypeNumberInterface
                    prototype: {},
                    static: {
                      abstraction: {
                        onValidateData(input, validator, step, state) {
                          if (typeof input !== "number") {
                            throw Error.normalize({
                              name: "ValidationError",
                              message: `Required «input» to be number but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»`,
                            });
                          }
                          return {
                            "*type": "number",
                            value: input,
                            validated: true,
                          };
                        },
                      },
                    },
                  }),
                ],
                this,
              );
            }
          }),
          string: (Std.types.string = class Type_string {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  (Std.interfaces.TypeStringInterface = {
                    // @interface:TypeStringInterface
                    prototype: {},
                    static: {
                      abstraction: {
                        onValidateData(input, validator, step, state) {
                          if (typeof input !== "string") {
                            throw Error.normalize({
                              name: "ValidationError",
                              message: `Required «input» to be string but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»`,
                            });
                          }
                          return {
                            "*type": "string",
                            value: input,
                            validated: true,
                          };
                        },
                      },
                    },
                  }),
                ],
                this,
              );
            }
          }),
          array: (Std.types.array = class Type_array {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  (Std.interfaces.TypeArrayInterface =
                    // @interface:TypeArrayInterface
                    {
                      prototype: {},
                      static: {
                        abstraction: {
                          onValidateData(input, validator, step, state) {
                            if (!Array.isArray(input)) {
                              throw Error.normalize({
                                name: "ValidationError",
                                message: `Required «input» to be array but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»`,
                              });
                            }
                            return {
                              "*type": "array",
                              value: input,
                              validated: true,
                            };
                          },
                        },
                      },
                    }),
                ],
                this,
              );
            }
          }),
          object: (Std.types.object = class Type_object {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  (Std.interfaces.TypeObjectInterface = {
                    // @interface:TypeObjectInterface
                    prototype: {},
                    static: {
                      abstraction: {
                        onValidateData(input, validator, step, state) {
                          if (typeof input !== "object") {
                            throw Error.normalize({
                              name: "ValidationError",
                              message: `Required «input» to be object but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»`,
                            });
                          }
                          return {
                            "*type": "object",
                            value: input,
                            validated: true,
                          };
                        },
                      },
                    },
                  }),
                ],
                this,
              );
            }
          }),
          function: (Std.types.function = class Type_function {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  (Std.interfaces.TypeFunctionInterface = {
                    // @interface:TypeFunctionInterface
                    prototype: {},
                    static: {
                      abstraction: {
                        onValidateData(input, validator, step, state) {
                          if (typeof input !== "function") {
                            throw Error.normalize({
                              name: "ValidationError",
                              message: `Required «input» to be function but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»`,
                            });
                          }
                          return {
                            "*type": "function",
                            value: input,
                            validated: true,
                          };
                        },
                      },
                    },
                  }),
                ],
                this,
              );
            }
          }),
          null: (Std.types.null = class Type_null {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  (Std.interfaces.TypeNullInterface =
                    // @interface:TypeNullInterface
                    {
                      prototype: {},
                      static: {
                        abstraction: {
                          onValidateData(input, validator, step, state) {
                            if (input !== null) {
                              throw Error.normalize({
                                name: "ValidationError",
                                message: `Required «input» to be null but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»`,
                              });
                            }
                            return {
                              "*type": "null",
                              value: input,
                              validated: true,
                            };
                          },
                        },
                      },
                    }),
                ],
                this,
              );
            }
          }),
        };
        Std.all.TypesParser = Std.classes.TypesParser =
          Std.parsers.peggy.generate(
            "Types_script = ast:Evaluable { return ast }" +
              "\n" +
              "" +
              "\n" +
              "Evaluable = " +
              "\n" +
              "  body:Prevaluable_2" +
              "\n" +
              "  appendix:Type_appendixes*" +
              "\n" +
              "    { return { ...body, appendix: appendix?.length && appendix || undefined } }" +
              "\n" +
              "" +
              "\n" +
              "Prevaluable_2 = " +
              "\n" +
              "  negation:Type_negation?" +
              "\n" +
              "  core:Prevaluable" +
              "\n" +
              "  parameters:Type_parameters?" +
              "\n" +
              "  modifiers:Type_modifiers?" +
              "\n" +
              "    { return { ...core, negation: negation || undefined, parameters: parameters || undefined, ...modifiers || undefined } }" +
              "\n" +
              "" +
              "\n" +
              "Prevaluable = Type_group / Type_atom / Type_object / Type_array" +
              "\n" +
              "" +
              "\n" +
              "Type_object =" +
              "\n" +
              '  token1:(_ "{" _)' +
              "\n" +
              "  props:Type_object_properties?" +
              "\n" +
              '  token2:(_ "}")' +
              "\n" +
              '    { return { grammar: "object type", properties: props || undefined } }' +
              "\n" +
              "" +
              "\n" +
              "Type_array =" +
              "\n" +
              '  token1:(_ "[" _)' +
              "\n" +
              "  items:Type_array_items?" +
              "\n" +
              '  token2:(_ "]")' +
              "\n" +
              '    { return { grammar: "array type", items: items || undefined } }' +
              "\n" +
              "" +
              "\n" +
              "Type_object_properties =" +
              "\n" +
              "  p_1:Type_object_property_first" +
              "\n" +
              "  p_n:Type_object_property_other*" +
              "\n" +
              "    { return Object.fromEntries([p_1].concat(p_n || [])) }" +
              "\n" +
              "Type_object_property_first = _" +
              "\n" +
              '  k:Property_name _ optionalProperty:Optional_sign? _ ":" _' +
              "\n" +
              "  property:Evaluable" +
              "\n" +
              "    { return [k,{...property, optionalProperty}] }" +
              "\n" +
              'Type_object_property_other = _ "," _' +
              "\n" +
              "  prop:Type_object_property_first" +
              "\n" +
              "    { return prop }" +
              "\n" +
              "" +
              "\n" +
              "Type_array_items =" +
              "\n" +
              "  p_1:Type_array_item_first" +
              "\n" +
              "  p_n:Type_array_item_other*" +
              "\n" +
              "    { return [p_1].concat(p_n || []) }" +
              "\n" +
              "Type_array_item_first = _ v:Evaluable { return v }" +
              "\n" +
              'Type_array_item_other = _ "," _ v:Evaluable { return v }' +
              "\n" +
              "" +
              "\n" +
              "Property_name = Property_chars" +
              "\n" +
              "" +
              "\n" +
              "Type_group = " +
              "\n" +
              '  token1:(_ "(" _)' +
              "\n" +
              "  atom:Evaluable" +
              "\n" +
              '  token3:(_ ")" _)' +
              "\n" +
              "    { return atom }" +
              "\n" +
              "" +
              "\n" +
              "Type_atom = " +
              "\n" +
              "  id:Type_identifier" +
              "\n" +
              '    { return { grammar: "type id", id } }' +
              "\n" +
              "" +
              "\n" +
              'Type_negation = _ "!" _ { return "!" }' +
              "\n" +
              "" +
              "\n" +
              "Type_appendixes = And_or_appendix" +
              "\n" +
              "" +
              "\n" +
              'Optional_sign = it:(_ "?")? { return it ? true : undefined }' +
              "\n" +
              'Question_mark = _ "?" { return { optional: true } }' +
              "\n" +
              "" +
              "\n" +
              "And_or_appendix = _" +
              "\n" +
              '  operator:("&" / "|") _' +
              "\n" +
              "  complement:Prevaluable_2" +
              "\n" +
              '    { return { grammar: "type appendix", operator, complement }}' +
              "\n" +
              "" +
              "\n" +
              "Type_identifier = _ Variable_name Variable_accessors*" +
              "\n" +
              "    { return text().trim() }" +
              "\n" +
              "" +
              "\n" +
              "Type_parameters =" +
              "\n" +
              '  token1:(_ "(" _)' +
              "\n" +
              "  list:Type_array_items?" +
              "\n" +
              '  token3:(_ ")" _)' +
              "\n" +
              "    { return list }" +
              "\n" +
              "" +
              "\n" +
              "Type_modifiers = modifier:(Question_mark)" +
              "\n" +
              "    { return modifier }" +
              "\n" +
              "" +
              "\n" +
              "Property_chars = [A-Za-z_$] [A-Za-z0-9_$]* { return text() }" +
              "\n" +
              "" +
              "\n" +
              "Variable_name = Unforbidden_tokens { return text() }" +
              "\n" +
              "" +
              "\n" +
              "Variable_accessors = Variable_accessor_by_dot+" +
              "\n" +
              "" +
              "\n" +
              'Variable_accessor_by_dot = "." name:Variable_name { return name }' +
              "\n" +
              "" +
              "\n" +
              "Comments = Comment_oneline / Comment_multiline" +
              "\n" +
              'Comment_oneline = __* "//" (!(___).)* {}' +
              "\n" +
              'Comment_multiline = __* "/*" (!("*/").)* "*/" {}' +
              "\n" +
              "" +
              "\n" +
              "Unforbidden_tokens = ((!Forbidden_tokens).)+ { return text() }" +
              "\n" +
              'Forbidden_tokens = "("' +
              "\n" +
              '  / ")"' +
              "\n" +
              '  / "|"' +
              "\n" +
              '  / "&"' +
              "\n" +
              '  / "{"' +
              "\n" +
              '  / "}"' +
              "\n" +
              '  / ","' +
              "\n" +
              '  / "."' +
              "\n" +
              '  / "!"' +
              "\n" +
              '  / ":"' +
              "\n" +
              '  / "/*"' +
              "\n" +
              '  / "["' +
              "\n" +
              '  / "]"' +
              "\n" +
              '  / "?"' +
              "\n" +
              '  / "*"' +
              "\n" +
              '  / "+"' +
              "\n" +
              '  / "//"' +
              "\n" +
              '  / "\\n" {}' +
              "\n" +
              "" +
              "\n" +
              "_ = one_space*" +
              "\n" +
              "one_space = __ / ___ / Comments" +
              "\n" +
              '__ = "\\t" / " "' +
              "\n" +
              "New_line = ___" +
              "\n" +
              '___ = "\\r\\n" / "\\r" / "\\n"',
            {
              output: "parser", // also: "source", "parser"
            },
          );
        Std.all.ValidationStep =
          Std.classes.ValidationStep = class ValidationStep {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  Std.interfaces.ValidationStepInterface,
                ],
                this,
              );
            }
          };
        Std.all.ValidationState =
          Std.classes.ValidationState = class ValidationState {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  Std.interfaces.ValidationStateInterface,
                ],
                this,
              );
            }
          };
        Std.all.ValidationResult =
          Std.classes.ValidationResult = class ValidationResult {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  Std.interfaces.ValidationResultInterface,
                ],
                this,
              );
            }
          };
        Std.all.TypesValidator =
          Std.classes.TypesValidator = class TypesValidator {
            static {
              $moduler.toolkit.makeClass(
                [
                  Std.interfaces.InstantiableInterface,
                  Std.interfaces.TypesValidatorInterface,
                ],
                this,
              );
            }
          };
        Std.all.TypesCatalog = Std.classes.TypesCatalog = class TypesCatalog {
          static {
            $moduler.toolkit.makeClass(
              [
                Std.interfaces.InstantiableInterface,
                Std.interfaces.IntrospectableInterfaceFactory(
                  "all",
                  "getType",
                  "setType",
                  "hasType",
                  "initializeType",
                  "listTypes",
                ),
                Std.interfaces.TypesCatalogInterface,
              ],
              this,
            );
            Instancia_global: {
              this.globalInstance = this.new;
              globalThis.$types = this.globalInstance.all;
            }
          }
        };
      }
      Wave_5_Filesystem: {
      }

      return Std;
    })();
  },
);
