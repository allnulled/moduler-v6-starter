(function (mod) {
  if (typeof $moduler === "undefined") {
    if (typeof window !== "undefined") window["$moduler"] = mod.globalInstance;
    if (typeof global !== "undefined") global["$moduler"] = mod.globalInstance;
  }
  if (typeof ModulerV6 === "undefined") {
    if (typeof window !== "undefined") window["ModulerV6"] = mod;
    if (typeof global !== "undefined") global["ModulerV6"] = mod;
  }
  return ModulerV6;
  // if (typeof module !== 'undefined') module.exports = mod;
})(
  function () {
    return class ModulerV6 {
      /**
       * @name ModulerV6
       * @type class
       * @description ...
       */

      /**
       * @name ModulerV6.static.Tracer
       * @type
       * @description
       */
      static Tracer = class Tracer {
        /**
         * @name ModulerV6.Tracer.static.create
         * @type
         * @description
         */
        static create(...args) {
          return new this(...args);
        }
        /**
         * @name ModulerV6.Tracer.constructor
         * @type
         * @description
         */
        constructor(id = null, parent = null) {
          this.level = 0;
          if (parent) {
            // Propiedades heredades:
            this.level = parent.level;
          }
          this.id = id || "mv6-" + ModulerV6._getRandomString(5);
        }
        /**
         * @name ModulerV6.Tracer.prototype.trace
         * @type
         * @description
         */
        trace = Object.assign(
          (method) => {
            console.log(`[·] [${this.id}] [${this.level}] [=] ${method}`);
          },
          {
            in: (method) => {
              this.level++;
              if (this.isTracing)
                console.log(`[·] [${this.id}] [${this.level}] [+] ${method}`);
            },
            out: (method) => {
              this.level--;
              if (this.isTracing)
                console.log(`[·] [${this.id}] [${this.level}] [-] ${method}`);
            },
            error: (method, error, levelDiff = 0) => {
              this.level += levelDiff;
              if (this.isTracing)
                console.log(
                  `[!] [${this.id}] [${this.level}] [!] ${method}`,
                  error,
                );
            },
            errorHandler: (method, levelDiff) => {
              return (error) => this.trace.error(method, error, levelDiff);
            },
          },
        );
        /**
         * @name ModulerV6.Tracer.prototype.log
         * @type
         * @description
         */
        log = this.trace;
        /**
         * @name ModulerV6.Tracer.prototype.isTracing
         * @type
         * @description
         */
        isTracing = true;
        /**
         * @name ModulerV6.Tracer.prototype.createSubtracer
         * @type
         * @description
         */
        createSubtracer() {}
        createSubtracer(id) {}
      };
      /**
       * @name ModulerV6.static.tracer
       * @type
       * @description
       */
      static tracer = this.Tracer.create("ModulerV6");
      /**
       * @name ModulerV6.static.createResolvable
       * @type
       * @description
       */
      static createResolvable() {
        let promise, resolve, reject;
        promise = new Promise((_resolve, _reject) => {
          resolve = _resolve;
          reject = _reject;
        });
        return { promise, resolve, reject };
      }
      /**
       * @name ModulerV6.static.onLoaded
       * @type
       * @description
       */
      static onLoaded = this.createResolvable();
      /**
       * @name ModulerV6.static.Runtime
       * @type
       * @description
       */
      static Runtime = class Runtime {
        /**
         * @name ModulerV6.Runtime.Runtime.class
         * @type
         * @description
         */
        constructor(owner) {
          // this.owner = owner;
        }
        static onLoaded = ModulerV6.createResolvable();
        cache = {
          isLoaded: false,
        };
        get env() {
          return ModulerV6.globalInstance.settings.data?.env || "unknown";
        }
        get isDev() {
          if (typeof this.cache.isDev === "boolean") return this.cache.isDev;
          if (ModulerV6.globalInstance.settings.data?.env)
            return (this.cache.isDev =
              ModulerV6.globalInstance.settings.data?.env === "dev");
        }
        get isTest() {
          if (typeof this.cache.isTest === "boolean") return this.cache.isTest;
          if (ModulerV6.globalInstance.settings.data?.env)
            return (this.cache.isTest =
              ModulerV6.globalInstance.settings.data?.env === "test");
        }
        get isProd() {
          if (typeof this.cache.isProd === "boolean") return this.cache.isProd;
          if (ModulerV6.globalInstance.settings.data?.env)
            return (this.cache.isProd =
              ModulerV6.globalInstance.settings.data?.env === "prod");
        }
        get isBrowser() {
          if (typeof this.cache.isBrowser === "boolean")
            return this.cache.isBrowser;
          return (this.cache.isBrowser =
            typeof window !== "undefined" &&
            typeof window.location !== "undefined");
        }
        get isNodejs() {
          if (typeof this.cache.isNodejs === "boolean")
            return this.cache.isNodejs;
          return (this.cache.isNodejs =
            typeof require !== "undefined" && typeof __dirname !== "undefined");
        }
        get hasCompilerV6() {
          return typeof CompilerV6 !== "undefined";
        }
        get hasDevBinaryV6() {
          return typeof DevBinaryV6 !== "undefined";
        }
        get getRootdir() {
          return ModulerV6.globalInstance.rootdir;
        }
        get getBasedir() {
          return ModulerV6.globalInstance.basedir;
        }
        get moduler() {
          return ModulerV6.globalInstance;
        }
        get compiler() {
          return CompilerV6.globalInstance;
        }
        get devbin() {
          return DevBinaryV6.globalInstance;
        }
        isInRefrescador() {
          throw new Error("Not supported yet");
        }
        isInModule(someModuler) {
          throw new Error("Not supported yet");
        }
        load() {
          if (this.cache.isLoaded) {
            return this.cache.isLoaded;
          }
          return Promise.all([ModulerV6.globalInstance.settings.load()]).then(
            (output) => {
              this.cache.isLoaded = output;
              return this;
            },
          );
        }
        static load() {
          return this.globalInstance.load();
        }
        static globalInstance = new this();
        static {
          // Con esto conseguimos cargar los settings en tanto que ModulerV6.globalInstance esté listo
          (async () => {
            await ModulerV6.onLoaded.promise;
            await Runtime.load();
            Runtime.onLoaded.resolve();
          })();
        }
      };
      /**
       * @name ModulerV6.AssertionError
       * @type
       * @description
       */
      static AssertionError = class AssertionError extends Error {
        constructor(message) {
          super(message);
          this.name = "AssertionError";
        }
      };
      /**
       * @name ModulerV6.CssManager
       * @type
       * @description
       */
      static CssManager =
        /**
         * @name ModulerV6.CssManager
         * @type
         * @description
         */
        class CssManager {
          /**
           * @name ModulerV6.CssManager.constructor
           * @type
           * @description
           */
          constructor(moduler, cloneOfCssManager = null) {
            this.trace("constructor", arguments);
            this.assert(
              typeof moduler === "object",
              `Parameter «moduler» must be object on «CssManager.constructor»`,
            );
            this.assert(
              moduler instanceof ModulerV6,
              `Parameter «moduler» must be instance of ModulerV6 on «CssManager.constructor»`,
            );
            /**
             * @name ModulerV6.CssManager.prototype.moduler
             * @type
             * @description
             */
            this.moduler = moduler;
            /**
             * @name ModulerV6.CssManager.prototype.sheets
             * @type
             * @description
             */
            this.sheets = {};
            /**
             * @name ModulerV6.CssManager.prototype.parser
             * @type
             * @description
             */
            this.parser = TextParserV1.create(
              ModulerV6.defaultGrammars.forCssOnRuntime,
            );
            /**
             * @name ModulerV6.CssManager.prototype._isTracing
             * @type
             * @description
             */
            this._isTracing = true;
          }
          /**
           * @name ModulerV6.CssManager.prototype._addRecursively
           * @type
           * @description
           */
          async _addRecursively(fileBrute, addEvent = { sheets: {} }) {
            let file, source, tokens;
            Normalize_filepath: {
              file = this.moduler.rootdirOf(fileBrute);
            }
            Return_cached_if_so: {
              if (file in this.sheets) {
                return this.sheets[file];
              }
              if (file in addEvent.sheets) {
                return addEvent.sheets[file];
              }
            }
            Start_cache: {
              addEvent.sheets[file] = { priority: undefined };
            }
            Load_source: {
              source = await this._fetchSheet(file);
              addEvent.sheets[file].source = source;
            }
            Extract_tokens: {
              tokens = await this._extractRequires(source, file);
              addEvent.sheets[file].tokens = tokens.formatted;
            }
            Load_requires: {
              const loadedRequires = [];
              for (let index = 0; index < tokens.formatted.length; index++) {
                const requiresToken = tokens.formatted[index];
                const requiresPathBrute = JSON.parse(requiresToken.inner);
                const requiresPath = this.moduler.rootdirOf(requiresPathBrute);
                loadedRequires.push(requiresPath);
                const submoduler = this.cloneForFile(requiresPath);
                if (!(requiresPath in this.sheets)) {
                  await submoduler.css._addRecursively(requiresPath);
                }
              }
              addEvent.sheets[file].requires = loadedRequires;
            }
            Define_priority_now: {
              addEvent.sheets[file].priority = Object.keys(this.sheets).length;
            }
            return Object.assign(this.sheets, addEvent.sheets);
          }
          /**
           * @name ModulerV6.CssManager.prototype._fetchSheet
           * @type
           * @description
           */
          _fetchSheet(file) {
            return this.moduler._readPath(file);
          }
          /**
           * @name ModulerV6.CssManager.prototype._extractRequires
           * @type
           * @description
           */
          _extractRequires(source, file) {
            const matches = this.parser.parse(source);
            matches.file = {
              original: file,
              absolute: this.moduler.normalizationOf(file),
              basedir: this.moduler.basedir,
              based: this.moduler.basedirOf(file),
              rootdir: this.moduler.rootdir,
              rooted: this.moduler.rootdirOf(file),
            };
            return matches;
          }
          /**
           * @name ModulerV6.CssManager.prototype.trace
           * @type
           * @description
           */
          trace(method, args = [], forceLog = false) {
            if (this._isTracing || forceLog) {
              console.log(
                `[css-manager][${method}] ${args.length} args: ${[...args].map((arg) => typeof arg).join(",")}`,
              );
            }
          }
          /**
           * @name ModulerV6.CssManager.prototype.assert
           * @type
           * @description
           */
          assert(condition, message) {
            if (!condition) throw new Error(message);
          }
          /**
           * @name ModulerV6.CssManager.prototype.add
           * @type
           * @description
           */
          async add(input) {
            let output = undefined;
            if (typeof input === "string") {
              output = await this._addRecursively(input);
            } else if (Array.isArray(input)) {
              output = [];
              for (let index = 0; index < input.length; index++) {
                const item = input[index];
                this.moduler.assert(
                  typeof item === "string",
                  `Parameter «arguments[0][${index}]» must be string too on «CssManager.prototype.add»`,
                );
                const result = await this._addRecursively(item);
                output.push(result);
              }
            } else {
              throw new Error(
                `Parameter «arguments[0]» can only be string or array on «CssManager.prototype.add»`,
              );
            }
            return output;
          }
          /**
           * @name ModulerV6.CssManager.prototype.remove
           * @type
           * @description
           */
          remove(file) {}
          /**
           * @name ModulerV6.CssManager.prototype.synchronize
           * @type
           * @description
           */
          synchronize() {
            let outputCss = "";
            const sorted = this.getSortedSheets()
              .map((sheet) => {
                return `\n/*!file:${JSON.stringify(sheet.id)}*/\n${sheet.source}`;
              })
              .join("\n")
              .replace(/\/\*\@requires\:/g, "/*!requires:");
            return sorted;
          }
          /**
           * @name ModulerV6.CssManager.prototype.cloneForFile
           * @type
           * @description
           */
          cloneForFile(file) {
            const submoduler = this.moduler.cloneForFile(file);
            Synchronized_inheritance_between_css_managers: {
              // @ATENTION: Este es el hack que hace que todo vaya ok:
              submoduler.css.sheets = this.sheets;
            }
            return submoduler;
          }
          /**
           * @name ModulerV6.CssManager.prototype.getSortedSheets
           * @type
           * @description
           */
          getSortedSheets() {
            return Object.keys(this.sheets)
              .map((id) => {
                return {
                  id,
                  ...this.sheets[id],
                };
              })
              .sort((a, b) => {
                return a.priority - b.priority;
              });
          }
        };
      /**
       * @name ModulerV6.static.SectionsManager
       * @type
       * @description
       */
      static SectionsManager = class SectionsManager {
        constructor(root = {}) {
          this.root = root;
        }

        _assert(condition, message) {
          if (!condition) throw new Error(message);
        }

        _isPropertoid(it) {
          return ["object", "function"].includes(typeof it);
        }

        isNull(it) {
          return it === null;
        }

        _hasKey(obj, prop) {
          return prop in obj;
        }

        _splitPropertyPath(path) {
          return path.split("/").filter(Boolean);
        }

        _getPropertyAndHolder(
          path,
          throwOnMissing = true,
          commingFromMethod = "_getPropertyAndHolder",
        ) {
          const keys = this._splitPropertyPath(path);
          const last = keys.pop();
          let obj = this.root;
          let counter = -1;
          for (const key of keys) {
            counter++;
            if (this.isNull(obj[key]) || !this._isPropertoid(obj[key])) {
              if (throwOnMissing) {
                throw new Error(
                  `Missing iterable intermediate property «${key}» at index «${counter}» of path «${path}» on «SectionsManager.prototype._getPropertyAndHolder called from method «SectionsManager.prototype.${commingFromMethod}»`,
                );
              }
              obj[key] = {};
            }
            obj = obj[key];
          }
          return { obj, last };
        }

        has(path) {
          // @DESCRIPTION: devuelve true si está definida la ruta de propiedad, false si no
          const ref = this._getPropertyAndHolder(path, false, "has");
          if (!this._isPropertoid(ref.obj)) return false;
          return ref.last in ref.obj;
        }

        get(path, defaultValue = Error) {
          // @DESCRIPTION: o devuelve el valor, o el valor por defecto, que en caso de ser Error, lanza un error, que es la conducta por defecto.
          const ref = this._getPropertyAndHolder(path, false, "get");
          this._assert(
            this._isPropertoid(ref.obj),
            `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.get»`,
          );
          if (!this._hasKey(ref.obj, ref.last)) {
            if (defaultValue === Error)
              throw new Error(
                `Could not find section property «${ref.last}» in path «${path}» on «SectionsManager.prototype.get»`,
              );
            return defaultValue;
          }
          return ref.obj[ref.last];
        }

        set(path, value) {
          // @DESCRIPTION: sobreescribe la propiedad de la ruta con el valor
          const ref = this._getPropertyAndHolder(path, false, "set");
          this._assert(
            this._isPropertoid(ref.obj),
            `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.set»`,
          );
          return (ref.obj[ref.last] = value);
        }

        initialize(path, value) {
          // @DESCRIPTION: rellena la propiedad de la ruta con el valor si está sin definir o en su defecto devuelve la definición anterior
          const ref = this._getPropertyAndHolder(path, false, "initialize");
          this._assert(
            this._isPropertoid(ref.obj),
            `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.initialize»`,
          );
          if (this._hasKey(ref.obj, ref.last)) return ref.obj[ref.last];
          return (ref.obj[ref.last] = value);
        }

        overwrite(path, values = {}) {
          // @DESCRIPTION: sobreescribe las propiedades de la ruta (objeto o función) con las propiedades del valor
          const ref = this._getPropertyAndHolder(path, false, "overwrite");
          this._assert(
            this._isPropertoid(ref.obj),
            `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.overwrite»`,
          );
          return Object.assign((ref.obj[ref.last] ??= {}), values);
        }

        fill(path, values = {}) {
          // @DESCRIPTION: rellena las propiedades de la ruta (objeto o función) con las propiedades del valor, e ignora la propiedad en caso de colisión
          const ref = this._getPropertyAndHolder(path, false, "fill");
          this._assert(
            this._isPropertoid(ref.obj),
            `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.fill»`,
          );
          return (ref.obj[ref.last] = Object.assign(
            {},
            values,
            (ref.obj[ref.last] ??= {}),
          ));
        }

        expand(path, values = {}) {
          // @DESCRIPTION: rellena las propiedades de la ruta (objeto o función) con las propiedades del valor, y lanza error en caso de colisión
          const ref = this._getPropertyAndHolder(path, false, "expand");
          Initialize_if_it_is_empty: {
            this._assert(
              this._isPropertoid(ref.obj),
              `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.expand»`,
            );
            if (!this._hasKey(ref.obj, ref.last)) {
              ref.obj[ref.last] = {};
            }
          }
          Check_it_has_no_common_properties_before_overwriting: {
            this._assert(
              this._isPropertoid(ref.obj[ref.last]),
              `Could not expand last property «${ref.last}» in path «${path}» with more properties because the previous value is of type «${typeof ref.obj[ref.last]}» on «SectionsManager.prototype.expand»`,
            );
            const val = ref.obj[ref.last];
            for (let prop in values) {
              this._assert(
                !this._hasKey(val, prop),
                `Property «${prop}» under path «${path}» cannot be expanded because it is already initialized on «SectionsManager.prototype.expand»`,
              );
            }
          }
          Overwrite: {
            return Object.assign(ref.obj[ref.last], values);
          }
        }

        delete(path) {
          // @DESCRIPTION: elimina 1 propiedad de un objeto o
          const ref = this._getPropertyAndHolder(path, false, "delete");
          if (["object", "function"].includes(typeof ref.obj)) {
            if (ref.obj === null) {
              throw new Error(
                `Cannot delete property «${ref.last}» of a null value of path «${path}» on «SectionsManager.prototype.delete»`,
              );
            } else if (ref.obj instanceof Array) {
              ref.obj.splice(ref.last, 1);
            } else {
              delete ref.obj[ref.last];
            }
          } else {
            throw new Error(
              `Cannot delete property «${ref.last}» of a holder of type «${typeof ref.obj}» of path «${path}» on «SectionsManager.prototype.delete»`,
            );
          }
          return ref.obj[ref.last];
        }

        reset() {
          this.root = {};
          return this;
        }
      };
      /**
       * @name ModulerV6.static.Settings
       * @type
       * @description
       */
      static Settings = class ModulerV6Settings {
        /**
         * @name ModulerV6.Settings
         * @type
         * @description
         */
        /**
         * @name ModulerV6.Settings.constructor
         * @type
         * @description
         */
        constructor(moduler) {
          /**
           * @name ModulerV6.Settings.prototype.moduler
           * @type
           * @description
           */
          this.moduler = moduler;
          /**
           * @name ModulerV6.Settings.prototype.data
           * @type
           * @description
           *
           * @property loop.port - `Integer` - Puerto en el que quieres poner a la instancia de refrescador escuchando.
           *
           */
          this.data = null;
        }
        /**
         * @name ModulerV6.Settings.prototype.load
         * @type
         * @description
         */
        async load(forceReload = false) {
          if (!forceReload && this.data) {
            return this.data;
          }
          try {
            const settings = await this.moduler.import(
              "@/dist/www/dev/settings.dist.js",
            );
            return (this.data =
              typeof settings === "function"
                ? await settings.call(this)
                : settings);
          } catch (error) {
            console.log("[!] Could not load settings because:", error);
          }
        }
        /**
         * @name ModulerV6.Settings.prototype.loadSilently
         * @type
         * @description
         */
        async loadSilently(...args) {
          try {
            return await this.load(...args);
          } catch (error) {
            return error;
          }
        }
        /**
         * @name ModulerV6.Settings.prototype.get
         * @type
         * @description
         */
        async get(property = null, forceReload = false) {
          await this.load(forceReload);
          if (!property) return this.data;
          return this.data[property];
        }
      };

      /**
       * @name ModulerV6.static.Toolkit
       * @type
       * @description
       */
      static Toolkit = class Toolkit {
        static create(...args) {
          return new this(...args);
        }
        constructor(moduler) {
          /**
           * @name ModulerV6.Toolkit.prototype.moduler
           * @type
           * @description
           */
          this.moduler = moduler;
        }

        /**
         * @name ModulerV6.Toolkit.prototype.normalizeParams
         * @type
         * @description
         */
        normalizeParams(params = {}) {
          return params;
        }
        /**
         * @name ModulerV6.Toolkit.prototype.normalizeOptions
         * @type
         * @description
         */
        normalizeOptions(options = {}) {
          const normalization = Object.assign({}, options);
          if (typeof normalization.tracer === "undefined") {
            normalization.tracer = this.moduler.tracer;
          }
          return normalization;
        }
      };
      /**
       * @name ModulerV6.Parser
       * @type
       * @description
       */
      static Parser = (function (mod) {
        if (typeof window !== "undefined") window["TextParserV1"] = mod;
        if (typeof global !== "undefined") global["TextParserV1"] = mod;
        // if (typeof module !== 'undefined') module.exports = mod;
        return mod;
      })(
        function () {
          // @source: https://github.com/allnulled/text-parser-v1/blob/main/text-parser-v1.js
          const TextParserV1 = class TextParserV1 {
            static default = this;
            static symbols = {
              PARENTHESYS_BALANCE: {},
            };
            static create(grammars) {
              return new this(grammars);
            }
            debug(...args) {
              console.log("[DEBUG]", ...args);
            }
            assert(condition, message) {
              if (!condition) throw new Error(message);
            }
            constructor(grammars = []) {
              for (let index = 0; index < grammars.length; index++) {
                const grammar = grammars[index];
                if (typeof grammar[2] === "undefined" || grammar[2] === null) {
                  grammar[2] = (it) => it;
                }
                if (typeof grammar[3] === "undefined" || grammar[3] === null) {
                  grammar[3] = {
                    allowInside: false,
                    includeAppendix: undefined,
                  };
                }
                this.assert(
                  typeof grammar === "object",
                  `Grammar «${index}» must be object`,
                );
                this.assert(
                  typeof grammar[0] === "string",
                  `Item «0» in grammar «${index}» must be string`,
                );
                this.assert(
                  typeof grammar[1] === "string" ||
                    typeof grammar[1] === "object",
                  `Item «1» in grammar «${index}» must be string or object`,
                );
                this.assert(
                  typeof grammar[2] === "function",
                  `Item «2» in grammar «${index}» must be function`,
                );
                this.assert(
                  typeof grammar[3] === "object",
                  `Item «3» in grammar «${index}» must be object`,
                );
                if (
                  "allowInside" in grammar[3] &&
                  typeof grammar[3].allowInside !== "undefined"
                ) {
                  this.assert(
                    typeof grammar[3].allowInside === "boolean",
                    `Property «allowInside» in item «3» in grammar «${index}» must be boolean or none`,
                  );
                }
                if (
                  "includeAppendix" in grammar[3] &&
                  typeof grammar[3].includeAppendix !== "undefined"
                ) {
                  if (Array.isArray(grammar[3].includeAppendix)) {
                    for (
                      let appendixIndex = 0;
                      appendixIndex < grammar[3].includeAppendix.length;
                      appendixIndex++
                    ) {
                      this.assert(
                        ["string", "function"].includes(
                          typeof grammar[3].includeAppendix[appendixIndex],
                        ),
                        `Property «includeAppendix» in item «3» in grammar «${index}» and in index «${appendixIndex}» must be string or function or none`,
                      );
                    }
                  } else {
                    this.assert(
                      ["string", "function"].includes(
                        typeof grammar[3].includeAppendix,
                      ),
                      `Property «includeAppendix» in item «3» in grammar «${index}» must be array, string or function or none`,
                    );
                  }
                }
              }
              this.grammars = grammars;
            }
            parse(text) {
              const tokens = this._extractTokens(text);
              const output = this._processTokens(text, tokens);
              return output;
            }
            _getAppendixOffset(text, grammar, currentPosition, ender) {
              const allAppendixes = Array.isArray(grammar[3].includeAppendix)
                ? grammar[3].includeAppendix
                : [grammar[3].includeAppendix];
              for (
                let appendixIndex = 0;
                appendixIndex < allAppendixes.length;
                appendixIndex++
              ) {
                const oneAppendix = allAppendixes[appendixIndex];
                if (
                  text.startsWith(oneAppendix, currentPosition + ender.length)
                ) {
                  return oneAppendix.length;
                }
              }
              return 0;
            }
            _pushToken({
              state,
              starter,
              currentPosition,
              countingFrom,
              enderLength,
              text,
              extraOffset,
            }) {
              const lastPosition = currentPosition + enderLength + extraOffset;
              return state.output.push({
                type: starter,
                location: [state.position, lastPosition],
                text: text.substring(state.position, lastPosition),
                inner: text.substring(countingFrom, currentPosition),
                outer: text.substring(state.position, lastPosition),
              });
            }
            _processTokens(text, tokens) {
              const formattedOutput = {
                size: text.length,
                text,
                tokens,
                formatted: [],
              };
              Iterating_tokens: for (
                let indexToken = 0;
                indexToken < tokens.length;
                indexToken++
              ) {
                const token = tokens[indexToken];
                Iterating_grammars: for (
                  let indexGrammar = 0;
                  indexGrammar < this.grammars.length;
                  indexGrammar++
                ) {
                  const grammar = this.grammars[indexGrammar];
                  if (grammar[0] === token.type) {
                    const formattedToken = grammar[2].call(
                      this,
                      token,
                      formattedOutput,
                      indexToken,
                      grammar,
                      indexGrammar,
                      text,
                    );
                    formattedOutput.formatted.push(formattedToken);
                    break Iterating_grammars;
                  }
                }
              }
              return formattedOutput;
            }
            _extractTokens(text) {
              const state = {
                position: 0,
                output: [],
              };
              Iterating_text: while (state.position < text.length) {
                Iterating_grammars: for (
                  let index = 0;
                  index < this.grammars.length;
                  index++
                ) {
                  const grammar = this.grammars[index];
                  const [starter, ender, formatter, options] = grammar;
                  const isMatchingStarter = text.startsWith(
                    starter,
                    state.position,
                  );
                  On_not_matched: if (!isMatchingStarter) {
                    continue Iterating_grammars;
                  }
                  const countingFrom = state.position + starter.length;
                  let offset = 0;
                  let wasEnded = false;
                  Processing_match: if (typeof ender === "string") {
                    // Cambiada la condición de < a <= para la options.enderCanBeEOF:
                    while (countingFrom + offset <= text.length) {
                      const currentPosition = countingFrom + offset;
                      const isMatchingEnder =
                        text.startsWith(ender, currentPosition) ||
                        (currentPosition === text.length &&
                          options.enderCanBeEOF === true);
                      if (isMatchingEnder) {
                        wasEnded = true;
                        this._pushToken({
                          state,
                          starter,
                          currentPosition,
                          countingFrom,
                          text,
                          enderLength: ender.length,
                          extraOffset: this._getAppendixOffset(
                            text,
                            grammar,
                            currentPosition,
                            ender,
                          ),
                        });
                        break Processing_match;
                      }
                      offset++;
                    }
                    if (!wasEnded)
                      throw new Error(
                        `Unclosed starter of grammar «${starter}» reached end of text but «${ender}» was not found on grammar index «${index}»`,
                      );
                  } else if (
                    ender === this.constructor.symbols.PARENTHESYS_BALANCE
                  ) {
                    let openedParenthesys = 1;
                    let wasEnded = false;
                    while (countingFrom + offset < text.length) {
                      const currentPosition = countingFrom + offset;
                      // @TODO: meterse dentro de los strings y escapar paréntesis internos
                      if (text[currentPosition] === "(") {
                        openedParenthesys++;
                      } else if (text[currentPosition] === ")") {
                        openedParenthesys--;
                        if (openedParenthesys === 0) {
                          wasEnded = true;
                          this._pushToken({
                            state,
                            starter,
                            currentPosition,
                            countingFrom,
                            text,
                            enderLength: 0,
                            extraOffset: this._getAppendixOffset(
                              text,
                              grammar,
                              currentPosition,
                              ender,
                            ),
                          });
                          break Processing_match;
                        }
                      }
                      offset++;
                    }
                    if (!wasEnded)
                      throw new Error(
                        `Unclosed starter of grammar «${starter}» reached end of text but the first parenthesys was not closed on grammar index «${index}»`,
                      );
                  } else {
                    throw new Error(
                      `Ender (2nd argument) of grammar «${starter}» at grammar index «${index}» has not valid type: «${typeof ender}»`,
                    );
                  }
                  if (options.allowInside) {
                    state.position += starter.length;
                  } else {
                    state.position += offset;
                  }
                }
                state.position++;
              }
              return state.output;
            }
          };
          return TextParserV1;
        }.call(),
      );

      /**
       * @name ModulerV6.nativeGrammars
       * @type ?
       * @description ?
       * @parameter ?
       * @return ?
       */
      static nativeGrammars = {
        InjectSource: [
          "$" + "compiler.inject.source(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return {
              syntax: "Inject Source",
              inner: token.inner,
              location: token.location,
            };
          },
        ],
        InjectString: [
          "$" + "compiler.inject.string(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return {
              syntax: "Inject String",
              inner: token.inner,
              location: token.location,
            };
          },
        ],
        InjectTemplate: [
          "$" + "compiler.inject.template(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Inject Template", ...token };
          },
        ],
        InjectModule: [
          "$" + "compiler.inject.module(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Inject Module", ...token };
          },
        ],
        ImportJs: [
          "$" + "moduler.import(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Import", ...token };
          },
          { allowInside: true },
        ],
        ExportJs: [
          "$" + "moduler.export(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Export", ...token };
          },
          { allowInside: true },
        ],
        //*
        SectionGet: [
          "$" + "moduler.section.get(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Section Get", ...token };
          },
          { allowInside: true },
        ],
        SectionSet: [
          "$" + "moduler.section.set(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Section Set", ...token };
          },
          { allowInside: true },
        ],
        SectionOverwrite: [
          "$" + "moduler.section.overwrite(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Section Overwrite", ...token };
          },
          { allowInside: true },
        ],
        SectionExpand: [
          "$" + "moduler.section.expand(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Section Expand", ...token };
          },
          { allowInside: true },
        ],
        SectionFill: [
          "$" + "moduler.section.fill(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Section Fill", ...token };
          },
          { allowInside: true },
        ],
        SectionHas: [
          "$" + "moduler.section.has(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Section Has", ...token };
          },
          { allowInside: true },
        ],
        SectionInitialize: [
          "$" + "moduler.section.initialize(",
          this.Parser.symbols.PARENTHESYS_BALANCE,
          function (token) {
            return { syntax: "Moduler Section Initialize", ...token };
          },
          { allowInside: true },
        ],
        //*/
        EmbeddedFormFieldOpener: [
          "/" + "*=¿",
          "*/",
          function (token) {
            return { syntax: "Embedded Form Field Opener", ...token };
          },
          {},
        ],
        EmbeddedFormFieldCloser: [
          "/" + "*?*/",
          "",
          function (token) {
            return { syntax: "Embedded Form Field Closer", ...token };
          },
          {},
        ],
        MultilineCommentValueInjection: [
          "/" + "*%=",
          "*/",
          function (token) {
            return { syntax: "Multiline Comment Value Injection", ...token };
          },
          { includeAppendix: ['"template"', "0", "() {}"] },
        ],
        MultilineCommentCodeInjection: [
          "/" + "*%",
          "*/",
          function (token) {
            return { syntax: "Multiline Comment Code Injection", ...token };
          },
          { includeAppendix: ['"template"', "0", "() {}"] },
        ],
        AtRequires: [
          "/" + "*@requires:",
          "*/",
          function (token) {
            return { syntax: "@Requires", ...token };
          },
        ],
        AtInjects: [
          "/" + "*@injects:",
          "*/",
          function (token) {
            return {
              syntax: "@Injects",
              inner: token.inner,
              location: token.location,
            };
          },
        ],

        // JavadocComment: ["/"+"**", "*/", function (token) {return { syntax: "Javadoc Comment", ...token, };}, {allowInside:true}],

        // Markdown related syntaxes:
        MultilineMarkdownComment: [
          "/" + "**@:",
          "*/",
          function (token) {
            return { syntax: "Multiline Markdown Comment", ...token };
          },
        ],
        NewParagraphMarkdownComment: [
          "/" + "//@@:",
          "\n",
          function (token) {
            return { syntax: "New Paragraph Markdown Comment", ...token };
          },
          { enderCanBeEOF: true },
        ],
        NewLineMarkdownComment: [
          "/" + "//@:",
          "\n",
          function (token) {
            return { syntax: "New Line Markdown Comment", ...token };
          },
          { enderCanBeEOF: true },
        ],
        PrecisedTabulationMarkdownComment: [
          "/" + "//@~",
          "\n",
          function (token) {
            return { syntax: "Precised Tabulation Markdown Comment", ...token };
          },
          { enderCanBeEOF: true },
        ],
        IncreasedTabulationMarkdownComment: [
          "/" + "//@+",
          "\n",
          function (token) {
            return {
              syntax: "Increased Tabulation Markdown Comment",
              ...token,
            };
          },
          { enderCanBeEOF: true },
        ],
        DecreasedTabulationMarkdownComment: [
          "/" + "//@-",
          "\n",
          function (token) {
            return {
              syntax: "Decreased Tabulation Markdown Comment",
              ...token,
            };
          },
          { enderCanBeEOF: true },
        ],
        InlineMarkdownComment: [
          "/" + "//@&:",
          "\n",
          function (token) {
            return { syntax: "Inline Markdown Comment", ...token };
          },
          { enderCanBeEOF: true },
        ],
        UnspacedInlineMarkdownComment: [
          "/" + "//@&&:",
          "\n",
          function (token) {
            return { syntax: "Unspaced Inline Markdown Comment", ...token };
          },
          { enderCanBeEOF: true },
        ],
      };
      /**
       * @name ModulerV6.defaultGrammars
       * @type ?
       * @description ?
       * @parameter ?
       * @return ?
       */
      static defaultGrammars = {
        forJs: [
          this.nativeGrammars.InjectSource,
          this.nativeGrammars.InjectString,
          this.nativeGrammars.InjectTemplate,
          this.nativeGrammars.InjectModule,
          this.nativeGrammars.ImportJs,
          this.nativeGrammars.ExportJs,
          /*
    this.nativeGrammars.MultilineCommentValueInjection,
    this.nativeGrammars.MultilineCommentCodeInjection,
    //*/
          this.nativeGrammars.AtRequires,
          this.nativeGrammars.AtInjects,
          /////////////////// this.nativeGrammars.JavadocComment,
          // Sections management grammars:
          /*
    this.nativeGrammars.SectionGet,
    this.nativeGrammars.SectionSet,
    this.nativeGrammars.SectionOverwrite,
    this.nativeGrammars.SectionExpand,
    this.nativeGrammars.SectionFill,
    this.nativeGrammars.SectionHas,
    this.nativeGrammars.SectionInitialize,
    //*/
          ////////////////////////////////////////
          // Markdown grammars:
          this.nativeGrammars.MultilineMarkdownComment,
          this.nativeGrammars.NewParagraphMarkdownComment,
          this.nativeGrammars.NewLineMarkdownComment,
          this.nativeGrammars.PrecisedTabulationMarkdownComment,
          this.nativeGrammars.IncreasedTabulationMarkdownComment,
          this.nativeGrammars.DecreasedTabulationMarkdownComment,
          this.nativeGrammars.InlineMarkdownComment,
          this.nativeGrammars.UnspacedInlineMarkdownComment,
          ////////////////////////////////////////
        ],
        forCss: [
          this.nativeGrammars.InjectSource,
          this.nativeGrammars.InjectString,
          this.nativeGrammars.InjectTemplate,
          this.nativeGrammars.ImportJs,
          this.nativeGrammars.ExportJs,
          /*
    this.nativeGrammars.MultilineCommentValueInjection,
    this.nativeGrammars.MultilineCommentCodeInjection,
    //*/
          this.nativeGrammars.AtRequires,
          this.nativeGrammars.AtInjects,
          /////////////////// this.nativeGrammars.JavadocComment,
        ],
        forMd: [
          this.nativeGrammars.InjectSource,
          this.nativeGrammars.InjectString,
          this.nativeGrammars.ImportJs,
          this.nativeGrammars.ExportJs,
          this.nativeGrammars.MultilineCommentValueInjection,
          this.nativeGrammars.AtRequires,
          this.nativeGrammars.AtInjects,
          /////////////////// this.nativeGrammars.JavadocComment,
        ],
        forHtml: [
          this.nativeGrammars.InjectSource,
          this.nativeGrammars.AtInjects,
        ],
        forCssOnRuntime: [this.nativeGrammars.AtRequires],
        forTemplateComments: [
          this.nativeGrammars.MultilineCommentValueInjection,
          this.nativeGrammars.MultilineCommentCodeInjection,
        ],
        forEmbeddedForms: [
          this.nativeGrammars.EmbeddedFormFieldOpener,
          this.nativeGrammars.EmbeddedFormFieldCloser,
        ],
      };

      /**
       * @name ModulerV6.assert
       * @type
       * @description
       */
      static assert(condition, message) {
        if (!condition) throw new this.AssertionError(message);
      }
      /**
       * @name ModulerV6.static.trify
       * @type
       * @description
       */
      static async trify(callback, ...args) {
        try {
          return await callback(...args);
        } catch (error) {
          return null;
        }
      }
      /**
       * @name ModulerV6.static._alphabet
       * @type
       * @description
       */
      static _alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      /**
       * @name ModulerV6.static._getRandomString
       * @type
       * @description
       */
      static _getRandomString(len = 10) {
        let out = "";
        while (out.length < len) {
          out += this._getRandomCharacter();
        }
        return out;
      }
      /**
       * @name ModulerV6.static._getRandomCharacter
       * @type
       * @description
       */
      static _getRandomCharacter(alphabet = this._alphabet) {
        return alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      /**
       * @name ModulerV6.static.includeScript
       * @type
       * @description
       */
      static includeScript = Object.assign(
        (src) => {
          this.assert(
            this.isBrowser,
            `ModulerV6.includeScript cannot include scripts in environments that are not browser and so file «${src}» cannot be loaded`,
          );
          return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve();
            script.onerror = (error) => reject(error);
            document.head.appendChild(script);
          });
        },
        {
          try: (...args) => this.trify(this.includeScript, ...args),
        },
      );
      /**
       * @name ModulerV6.static.includeStyle
       * @type
       * @description
       */
      static includeStyle = Object.assign(
        (src) => {
          this.assert(
            this.isBrowser,
            `ModulerV6.includeStyle cannot include styles in environments that are not browser and so file «${src}» cannot be loaded`,
          );
          return new Promise((resolve, reject) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = src;
            link.onload = () => resolve();
            link.onerror = (error) => reject(error);
            document.head.appendChild(link);
          });
        },
        {
          try: (...args) => this.trify(this.includeStyle, ...args),
        },
      );
      /**
       * @name ModulerV6.isBrowser
       * @type
       * @description
       */
      static isBrowser = typeof window !== "undefined";
      /**
       * @name ModulerV6.static.isGithubIo
       * @type
       * @description
       */
      static isGithubIo() {
        if (!this.isBrowser) return false;
        if (!/\.github\.io$/i.test(window.location.hostname)) return false;
        return window.location.pathname.split("/").filter(Boolean)[0];
      }
      /**
       * @name ModulerV6.symbols
       * @type
       * @description
       */
      static symbols = {
        REGEX_FOR_SLASH_AT_THE_END: /(\\|\/)$/g,
        REGEX_FOR_PROTOCOL_BASED_PATH: /^([A-Za-z0-9\-\_\$]*)\:\/\//g,
        REGEX_FOR_ABSOLUTE_WINDOWS_PATH: /^(([A-Za-z]:(\\|\/))|((\\|\/){2}))/g,
      };
      /**
       * @name ModulerV6.getEnvironmentDirectory
       * @type
       * @description
       */
      static getEnvironmentDirectory() {
        this.tracer.trace("ModulerV6.static.getEnvironmentDirectory");
        if (this.isBrowser) {
          Apply_github_io_configurations_if_so: {
            const projectName = this.isGithubIo();
            if (projectName) return `${window.location.origin}/${projectName}`;
          }
          return window.location.origin;
        } else {
          return process.cwd();
        }
      }
      /**
       * @name ModulerV6.static.bindToRefrescador
       * @type
       * @description
       */
      static async bindToRefrescador() {
        if (!this.isBrowser) return -2;
        if (this.isGithubIo()) return -3;
        await this.includeScript.try("/socket.io-client.js");
        await this.includeScript.try("/client.js");
        return "bound successfully";
      }
      /**
       * @name ModulerV6.static.updateAllHtmlLinks
       * @type
       * @description
       */
      static updateAllHtmlLinks() {
        if (!this.isBrowser) {
          console.error(
            "[!] ModulerV6.updateAllHtmlLinks can only be used in browser",
          );
          return -2;
        }
        const allAnchors = document.body.querySelectorAll("a");
        console.log(
          `[*] ModulerV6 found ${allAnchors.length} anchors to update its link`,
        );
        allAnchors.forEach((el) => {
          const dataHref = el.getAttribute("data-mv6-href");
          if (dataHref?.startsWith("@/")) {
            el.setAttribute("href", $moduler.normalizationOf(dataHref));
          }
        });
      }
      /**
       * @name ModulerV6.static.create
       * @type
       * @description
       */
      static create(...args) {
        return new this(...args);
      }

      /**
       * @name ModulerV6.prototype.tracer
       * @type
       * @description
       */
      tracer = this.constructor.Tracer.create("ModulerV6.globalInstance");
      /**
       * @name ModulerV6.prototype._formatImportParameters
       * @type
       * @description
       */
      _formatImportParameters(signature) {
        this.assert(
          Array.isArray(signature),
          "Parameter «signature» must be array on «ModulerV6.prototype._formatImportParameters»",
        );
        this.assert(
          signature.length !== 0,
          "ModulerV6.prototype.import cannot have 0 arguments",
        );
        if (signature.length === 1) {
          if (typeof signature[0] === "string") {
            // By file or id
            const isId = signature[0].startsWith("#");
            return {
              id: isId ? signature[0] : null,
              file: !isId ? signature[0] : null,
              dependencies: [],
              factory: null,
            };
          } else if (typeof signature[0] === "object") {
            // By dependencies
            return {
              id: null,
              file: null,
              dependencies: signature[0],
              factory: null,
            };
          } else if (typeof signature[0] === "function") {
            // By pure factory
            return {
              id: null,
              file: null,
              dependencies: [],
              factory: signature[0],
            };
          } else {
            this.assert(
              false,
              `ModulerV6.prototype.import used with 1 argument does not support the signature: ${typeof signature[0]}`,
            );
          }
        } else if (signature.length === 2) {
          if (
            typeof signature[0] === "object" &&
            typeof signature[1] === "function"
          ) {
            // By factory with module injection
            return {
              id: null,
              file: null,
              dependencies: signature[0],
              factory: signature[1],
            };
          } else {
            this.assert(
              false,
              `ModulerV6.prototype.import used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}`,
            );
          }
        } else {
          this.assert(
            false,
            `ModulerV6.prototype.import cannot have ${signature.length} arguments`,
          );
        }
      }
      /**
       * @name ModulerV6.prototype._formatExportParameters
       * @type
       * @description
       */
      _formatExportParameters(signature) {
        this.assert(
          Array.isArray(signature),
          "Parameter «signature» must be array on «ModulerV6.prototype._formatExportParameters»",
        );
        this.assert(
          signature.length !== 0,
          "ModulerV6.prototype.export cannot have 0 arguments",
        );
        this.assert(
          signature.length !== 1,
          "ModulerV6.prototype.export cannot have 1 argument only",
        );
        this.assert(
          typeof signature[0] === "string",
          "ModulerV6.prototype.export first argument must be a string",
        );
        this.assert(
          signature[0].startsWith("#"),
          "ModulerV6.prototype.export first argument must be a string starting with «#»",
        );
        if (signature.length === 2) {
          if (
            typeof signature[0] === "string" &&
            typeof signature[1] === "function"
          ) {
            // Factory module to name
            return {
              id: signature[0],
              file: null,
              dependencies: [],
              factory: signature[1],
            };
          } else if (
            typeof signature[0] === "string" &&
            typeof signature[1] === "string"
          ) {
            // Dependency to name
            return {
              id: signature[0],
              file: signature[1],
              dependencies: [],
              factory: null,
            };
          } else if (
            typeof signature[0] === "string" &&
            typeof signature[1] === "object"
          ) {
            // Dependencies collection to name
            return {
              id: signature[0],
              file: null,
              dependencies: signature[1],
              factory: null,
            };
          } else {
            this.assert(
              false,
              `ModulerV6.prototype.export used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}`,
            );
          }
        } else if (signature.length === 3) {
          if (
            typeof signature[0] === "string" &&
            typeof signature[1] === "object" &&
            typeof signature[2] === "function"
          ) {
            // Factory module with dependencies to name
            return {
              id: signature[0],
              file: null,
              dependencies: signature[1],
              factory: signature[2],
            };
          } else {
            this.assert(
              false,
              `ModulerV6.prototype.export used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}, ${typeof signature[2]}`,
            );
          }
        } else {
          this.assert(
            false,
            `ModulerV6.prototype.export cannot have ${signature.length} arguments`,
          );
        }
      }
      /**
       * @name ModulerV6.prototype._joinPaths
       * @type
       * @description
       */
      _joinPaths(subpathsInput, origin = false) {
        this.assert(
          Array.isArray(subpathsInput),
          `Parameter «subpaths» must be array on «ModulerV6.prototype._joinPaths»`,
        );
        this.assert(
          subpathsInput.length !== 0,
          `Parameter «subpaths.length» cannot be 0 on «ModulerV6.prototype._joinPaths»`,
        );
        let out = "",
          activatedOptions = {};
        const subpaths = [].concat(subpathsInput);
        Correct_filesymbols: {
          this.assert(
            typeof subpaths[0] === "string",
            `Parameter «subpaths[0]» must be string but «${typeof subpaths[0]}» was found instead on «ModulerV6.prototype._joinPaths»`,
          );
          const [_subpath, _activatedOptions] = this._removeSymbolsFromFilepath(
            subpaths[0],
            true,
          );
          subpaths[0] = _subpath;
          activatedOptions = _activatedOptions;
        }
        Join_paths_overwritting_when_required: for (
          let index = 0;
          index < subpaths.length;
          index++
        ) {
          const subpath = subpaths[index];
          this.assert(
            typeof subpath === "string",
            `Parameter «subpaths[${index}]» must be string too on «ModulerV6.prototype._joinPaths»`,
          );
          this.assert(
            subpath !== "",
            `Parameter «subpaths[${index}]» cannot be empty string on «ModulerV6.prototype._joinPaths»`,
          );
          if (subpath.includes("://")) {
            // @case Ruta por protocolo
            this.assert(
              subpath.match(
                this.constructor.symbols.REGEX_FOR_PROTOCOL_BASED_PATH,
              ),
              `Paths can only have «://» at the begining, and preceded only by a protocol id, if any in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`,
            );
            out = subpath;
          } else if (
            subpath.includes(":\\") ||
            subpath.includes(":/") ||
            subpath.startsWith("\\\\") ||
            subpath.startsWith("//")
          ) {
            // @case Ruta absoluta estilo Windows
            this.assert(
              subpath.match(
                this.constructor.symbols.REGEX_FOR_ABSOLUTE_WINDOWS_PATH,
              ),
              `Paths can only have «:\\|:/|\\\\|//» at the begining, and preceded only by a standard Windows disk unit identifier, if any in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`,
            );
            out = subpath;
          } else if (subpath.startsWith("/")) {
            // @case Ruta absoluta estilo Linux
            out = subpath;
          } else if (subpath.startsWith("./")) {
            // @case Ruta relativa al basedir
            this.assert(
              typeof this.basedir === "string",
              `Cannot use «./» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`,
            );
            out = this._appendPathSeparator(this.basedir) + subpath.substr(2);
          } else if (subpath.startsWith("../")) {
            // @case Ruta relativa al basedir pero directorio superior
            this.assert(
              typeof this.basedir === "string",
              `Cannot use «../» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`,
            );
            out =
              this._appendPathSeparator(this.basedir, "..") + subpath.substr(3);
          } else if (subpath.startsWith("@/")) {
            // @case Ruta relativa al rootdir
            this.assert(
              typeof this.rootdir === "string",
              `Cannot use «@/» expression because «this.rootdir» is «${typeof this.rootdir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`,
            );
            out = this._appendPathSeparator(this.rootdir) + subpath.substr(2);
          } else {
            // @case Cualquier otra ruta
            if (out.length) {
              out = this._appendPathSeparator(out) + subpath;
            } else {
              out = subpath;
            }
          }
        }
        Resolve_one_and_two_dots: {
          //    C:/una/ruta/absoluta.js
          //    C:\una\ruta\absoluta.js
          //    \\una\ruta\absoluta.js
          //    /una/ruta/absoluta.js
          //    ://una/ruta/absoluta.js
          //    http://una/ruta/absoluta.js
          //    ./una/ruta/relativa.js
          //    ../una/ruta/relativa.js
          //    @/una/ruta/relativa.js
          //    una/ruta/relativa.js
          const parts = this.splitPath(out);
          const newParts = [];
          for (let index = 0; index < parts.length; index++) {
            const part = parts[index];
            if (part === "..") {
              newParts.pop();
            } else if (part === ".") {
              // @OK.
            } else {
              newParts.push(part);
            }
          }
          out = newParts.join("/");
        }
        if (activatedOptions.justTry) {
          out = `!${out}`;
        }
        return out;
      }
      /**
       * @name ModulerV6.prototype.splitPath
       * @type
       * @description
       */
      splitPath(path) {
        const out = [""];
        let index = 0;
        while (index < path.length) {
          const ch = path[index];
          if (ch === "/" || ch === "\\") {
            out.push("");
          } else {
            out[out.length - 1] += ch;
          }
          index++;
        }
        return out;
      }
      /**
       * @name ModulerV6.prototype._appendPathSeparator
       * @type
       * @description
       */
      _appendPathSeparator(subpath) {
        return (
          subpath.replace(
            this.constructor.symbols.REGEX_FOR_SLASH_AT_THE_END,
            "",
          ) + "/"
        );
      }
      /**
       * @name ModulerV6.prototype._readFile
       * @type
       * @description
       */
      _readFile(file) {
        return require("fs").promises.readFile(
          this.normalizationOf(file),
          "utf8",
        );
      }
      /**
       * @name CompilerV6.prototype._readUrl
       * @type
       * @description
       */
      _readUrl(url) {
        return fetch(this.normalizationOf(url), {
          method: "GET",
        }).then((response) => {
          if (!response.ok) {
            throw Object.assign(
              new Error(
                `[!] Could not read URL because of HTTP ${response.status} Error: ${response.statusText}`,
              ),
              { name: "FetchError" },
            );
          }
          return response.text();
        });
      }
      /**
       * @name ModulerV6.prototype._readPath
       * @type
       * @description
       */
      _readPath(url, options = {}) {
        return (
          this.runtime.isBrowser ? this._readUrl(url) : this._readFile(url)
        ).then((it) => {
          if (this.settings.data?.traceExternalSources) {
            console.log(`[*] Read from external source «${url}»:`);
            console.log("--------------------:");
            console.log(it);
            console.log("--------------------/");
          }
          return it;
        });
      }
      /**
       * @name ModulerV6.prototype._wrapInTry
       * @type
       * @description
       */
      _wrapInTry(source, parameters = {}, file = null) {
        let js = "";
        js += `try {\n`;
        js += `  ${source}\n`;
        js += `} catch(error) {\n`;
        js += `  console.error("Injection source failed somewhere:", ${JSON.stringify(source)});\n`;
        js += `  console.error("Injection parameters:", ${JSON.stringify(Object.keys(parameters).map((id) => id + ":" + typeof parameters[id]))});\n`;
        if (file !== null) {
          js += `  console.error("Injected file:", ${JSON.stringify(file)});\n`;
        }
        js += `  console.error("Injection failed:", error);\n`;
        js += `}`;
        return js;
      }
      /**
       * @name ModulerV6.prototype._createAsyncFunction
       * @type
       * @description
       */
      _createAsyncFunction(source, parameters = []) {
        return new async function () {}.constructor(...parameters, source);
      }
      /**
       * @name ModulerV6.prototype._importFile
       * @type
       * @description
       */
      _importFile(filepathInput) {
        let filepath, filepathMask, isInstr, isJson;
        const [filepathBrute, activeOptions] = this._removeSymbolsFromFilepath(
          filepathInput,
          true,
        );
        isJson = filepathBrute.endsWith(".json");
        Normalize_file: {
          filepath = filepathMask = this.normalizationOf(filepathBrute);
        }
        Use_instrumentalized_if_conditions_are_met: {
          if (isJson) {
            // console.log("[*] Dismissed instrumentalization for reason 4: the file is a json not a js");
            break Use_instrumentalized_if_conditions_are_met;
          }
          if (!(this.runtime.isDev || this.runtime.isTest)) {
            // console.log("[*] Dismissed instrumentalization for reason 1: the environment is not «dev» or «test»");
            break Use_instrumentalized_if_conditions_are_met;
          }
          if (!this.settings.data?.instrumentalize?.length) {
            // console.log("[*] Dismissed instrumentalization for reason 2: settings were not provided because file «@/dist/www/dev/settings.dist.js» is missing or «ModulerV6.prototype.settings.loadSilently» was not awaited before the first «ModulerV6.prototype.{import,export}» call");
            break Use_instrumentalized_if_conditions_are_met;
          }
          if (
            !this.settings.data.instrumentalize
              .map((file) => this.normalizationOf(file))
              .includes(filepath)
          ) {
            // console.log("[*] Dismissed instrumentalization for reason 3: the file is not added to ModulerV6.prototype.settings.data.instrumentalize");
            break Use_instrumentalized_if_conditions_are_met;
          }
          isInstr = true;
          filepath = filepath.replace(/\.js$/g, ".instr.js");
        }
        console.log("[*] ModulerV6 imports: " + this.rootdirOf(filepath));
        Evaluate_file_and_export_results: {
          if (isJson) {
            return (this.modules[filepathMask] = this._readPath(filepathBrute)
              .catch((error) => {
                if (activeOptions.justTry) return undefined;
                throw error;
              })
              .then((content) => {
                if (typeof content === "undefined") return undefined;
                return JSON.parse(content);
              }));
          }
          let firstHolder = {};
          let originalHolder = firstHolder;
          const moduleHolder = {
            get exports() {
              return originalHolder;
            },
            set exports(value) {
              originalHolder = value;
            },
          };
          return this.evaluateFile(
            filepath,
            {
              module: moduleHolder,
              exports: moduleHolder.exports,
              $moduler: this.cloneForFile(filepath),
            },
            {
              onMissingResource:
                activeOptions.justTry === true ? () => undefined : false,
            },
          ).then((result) => {
            let output = undefined;
            // @ATENCIÓN: sí, parece que esta lógica es necesaria
            const returnsUndefined = () => typeof result === "undefined";
            const isSameEmptyObject = () =>
              moduleHolder.exports === firstHolder &&
              Object.keys(firstHolder).length === 0;
            if (!returnsUndefined()) {
              output = moduleHolder.exports = result;
            } else if (!isSameEmptyObject()) {
              output = moduleHolder.exports;
            }
            return (this.modules[filepathMask] = output);
          });
        }
      }
      /**
       * @name ModulerV6.prototype._importFactory
       * @type
       * @description
       */
      _importFactory(factory, dependencies = []) {
        let output = undefined;
        let firstHolder = {};
        let originalHolder = firstHolder;
        const moduleHolder = {
          get exports() {
            return originalHolder;
          },
          set exports(anotherOutput) {
            originalHolder = anotherOutput;
          },
        };
        const syncResult = factory(dependencies, {
          module: moduleHolder,
          exports: moduleHolder.exports,
          $moduler: this,
        });
        if (syncResult instanceof Promise) {
          return syncResult.then((result) => {
            output = undefined;
            const returnsUndefined = () => typeof result === "undefined";
            const isSameEmptyObject = () =>
              moduleHolder.exports === firstHolder &&
              Object.keys(firstHolder).length === 0;
            if (!returnsUndefined()) {
              output = moduleHolder.exports = result;
            } else if (!isSameEmptyObject()) {
              output = moduleHolder.exports;
            }
            return output;
          });
        } else {
          output = undefined;
          const result = syncResult;
          const returnsUndefined = () => typeof result === "undefined";
          const isSameEmptyObject = () =>
            moduleHolder.exports === firstHolder &&
            Object.keys(firstHolder).length === 0;
          if (!returnsUndefined()) {
            output = moduleHolder.exports = result;
          } else if (!isSameEmptyObject()) {
            output = moduleHolder.exports;
          }
        }
        return output;
      }
      /**
       * @name ModulerV6.prototype._importSectionByMap
       * @type
       * @description
       */
      _importSectionByMap(sectionId, returnsOnMissing = undefined) {
        if (!this.settings.data?.sectionsMap) {
          return returnsOnMissing;
        }
        const originalMap = this.settings.data.sectionsMap;
        if (!(sectionId in originalMap)) {
          return returnsOnMissing;
        }
        const sectionPath = originalMap[sectionId];
        return this.import(sectionPath);
      }
      /**
       * @name ModulerV6.prototype._removeSymbolsFromFilepath
       * @type
       * @description
       */
      _removeSymbolsFromFilepath(filepathInput, returnData = false) {
        let output = filepathInput;
        const activeOptions = {};
        Remove_justTry_prefix: {
          if (output.startsWith("!")) {
            output = output.substr(1);
            activeOptions.justTry = true;
          }
        }
        if (returnData) {
          return [output, activeOptions];
        }
        return output;
      }

      /**
       * @name ModulerV6.prototype.assert
       * @type
       * @description
       */
      assert(condition, message) {
        return this.constructor.assert(condition, message);
      }
      /**
       * @name ModulerV6.prototype.trify
       * @type
       * @description
       */
      trify = this.constructor.trify;
      /**
       * @name ModulerV6.prototype.createAssertFunction
       * @type
       * @description
       */
      createAssertFunction() {
        return (...args) => this.assert(...args);
      }
      /**
       * @name ModulerV6.prototype.setBasedir
       * @type
       * @description
       */
      setBasedir(basedir) {
        this.basedir = this.normalizationOf(basedir);
        if (this.compiler) {
          this.compiler.basedir = this.basedir;
        }
      }
      /**
       * @name ModulerV6.prototype.setRootdir
       * @type
       * @description
       */
      setRootdir(rootdir) {
        this.rootdir = this.normalizationOf(rootdir);
        if (this.compiler) {
          this.compiler.rootdir = this.rootdir;
        }
      }
      /**
       * @name ModulerV6.prototype.normalizationOf
       * @type
       * @description
       */
      normalizationOf(subpath) {
        this.assert(
          typeof subpath === "string",
          `Parameter «subpath» must be string on «ModulerV6.prototype.normalizationOf»`,
        );
        return this._joinPaths([subpath], "normalizationOf");
      }
      /**
       * @name ModulerV6.prototype.basedirOf
       * @type
       * @description
       */
      basedirOf(subpath) {
        const normalized = this._joinPaths([subpath], "basedirOf");
        const basedirSeparated = this._appendPathSeparator(this.basedir);
        if (normalized.startsWith(basedirSeparated)) {
          return normalized.replace(basedirSeparated, "./");
        }
        return normalized;
      }
      /**
       * @name ModulerV6.prototype.rootdirOf
       * @type
       * @description
       */
      rootdirOf(subpath) {
        const normalized = this._joinPaths([subpath], "rootdirOf");
        const rootdirSeparated = this._appendPathSeparator(this.rootdir);
        if (normalized.startsWith(rootdirSeparated)) {
          return normalized.replace(rootdirSeparated, "@/");
        }
        return normalized;
      }
      /**
       * @name ModulerV6.prototype.cloneForFile
       * @type
       * @description
       */
      cloneForFile(filepath) {
        const dirpath = this._joinPaths([filepath, ".."]);
        return new ModulerV6(dirpath, this);
      }

      /**
       * @name ModulerV6.prototype.evaluateFile
       * @type
       * @description
       */
      evaluateFile(file, injections = {}, options = {}) {
        return this._readPath(file, options)
          .catch((error) => {
            if (options.onMissingResource)
              return options.onMissingResource(error);
            throw error;
          })
          .then((source) => {
            return this.evaluateSource(source, injections, file);
          });
      }
      /**
       * @name ModulerV6.prototype.evaluateSource
       * @type
       * @description
       */
      evaluateSource(source, injections = {}, file = null) {
        if (typeof source === "undefined") return undefined;
        this.assert(
          typeof source === "string",
          `Parameter «source» must be string but «${typeof source}» was passed instead on «ModulerV6.prototype.evaluateSource»`,
        );
        this.assert(
          typeof injections === "object",
          `Parameter «injections» must be object but «${typeof injections}» was passed instead on «ModulerV6.prototype.evaluateSource»`,
        );
        this.assert(
          !Array.isArray(injections),
          `Parameter «injections» must be object but not array on «ModulerV6.prototype.evaluateSource»`,
        );
        this.assert(
          injections !== null,
          `Parameter «injections» must be object but not null on «ModulerV6.prototype.evaluateSource»`,
        );
        // @CUIDADO-FALSÍSIMO:
        En_teoria_es_el_polifiler_de_estar_en_un_entorno_package_json_type_module_que_yo_no_lo_tengo_pero_bueno: {
          if (!this.constructor.isBrowser) {
            injections.require = require;
            injections.__dirname = __dirname;
          }
        }
        const allKeys = Object.keys(injections);
        const allObjects = Object.values(injections);
        const finalSource = this._wrapInTry(source, injections, file);
        const asyncFunction = this._createAsyncFunction(finalSource, allKeys);
        return asyncFunction(...allObjects);
      }
      /**
       * @name ModulerV6.prototype.import
       * @type
       * @description
       */
      import(...signature) {
        let filepath, dependencies;
        const parameters = this._formatImportParameters(signature);
        const {
          id: _id = null,
          file: _file = null,
          dependencies: _dependencies = null,
          factory: _factory = null,
        } = parameters;
        Resolve_as_section: {
          // Si no tiene id, aquí no entra:
          if (!_id) break Resolve_as_section;
          // Si está cargada la sección, la devuelve:
          As_loaded_section: {
            if (this.section.has(_id)) {
              return this.section.get(_id);
            }
          }
          // Si está mapeada la sección, la carga y la devuelve:
          As_mapped_section: {
            const uniqueFailure = {};
            const sectionByMap = this._importSectionByMap(_id, uniqueFailure);
            this.assert(
              sectionByMap !== uniqueFailure,
              `No section named «${_id}» on «ModulerV6.prototype.import»`,
            );
            return sectionByMap;
          }
        }
        Resolve_as_file: {
          if (_file) {
            // Si tiene file, o devuelve el file cacheado, o lo cachea y lo devuelve:
            filepath = this.normalizationOf(_file);
            if (filepath in this.modules) {
              return this.modules[filepath];
            }
            return this._importFile(filepath);
          }
        }
        Here_is_only_factory: {
          Resolve_dependencies: {
            if (_dependencies && _dependencies.length) {
              // Si tiene dependencies, las carga:
              dependencies = Promise.all(
                _dependencies.map((dependency) => {
                  // @CHATGPT-PATCH: para poder importar secciones como dependencias reusa recursivamente el import (antes era el _importFile solo);
                  return this.import(dependency);
                }),
              );
              if (!_factory) {
                return dependencies;
              }
            }
          }
          Resolve_factory: {
            if (_factory && dependencies) {
              return dependencies.then((resolvedDependencies) =>
                this._importFactory(_factory, resolvedDependencies),
              );
            } else if (_factory && !dependencies) {
              return this._importFactory(_factory, []);
            } else if (dependencies) {
              return dependencies;
            } else {
              throw new Error(
                "This error should never happen by design (8210)",
              );
            }
          }
        }
        throw new Error("This error should never happen by design (4993)");
      }
      /**
       * @name ModulerV6.prototype.export
       * @type
       * @description
       */
      export(...signature) {
        let filepath, dependencies, output;
        const parameters = this._formatExportParameters(signature);
        // @TODO: algoritmo del export
        const {
          id: _id = null,
          file: _file = null,
          dependencies: _dependencies = null,
          factory: _factory = null,
        } = parameters;
        this.assert(
          this.section instanceof ModulerV6.SectionsManager,
          `For some random reason, the section manager global instance is not available on «ModulerV6.prototype.export»`,
        );
        this.assert(
          !this.section.has(_id),
          `Cannot export section by id «${_id}» because it already exists on «ModulerV6.prototype.export»`,
        );
        Resolving_module: {
          const signatureCopy = [...signature];
          signatureCopy.splice(0, 1);
          output = this.import(...signatureCopy);
        }
        if (output === null) {
          this.section.set(_id, output);
        } else if (["object"].includes(typeof output)) {
          this.section.expand(_id, output);
        } else {
          this.section.set(_id, output);
        }
        return output;
      }

      /**
       * @name ModulerV6.static.globalSectionsManagerInstance
       * @type
       * @description
       */
      static globalSectionsManagerInstance = new this.SectionsManager({});
      /**
       * @name ModulerV6.prototype.get.section
       * @type
       * @description
       */
      section = this.constructor.globalSectionsManagerInstance;
      /**
       * @name ModulerV6.constructor
       * @type
       * @description
       */
      constructor(basedirArg = null, cloneOf = null) {
        const basedir =
          basedirArg === null
            ? this.constructor.getEnvironmentDirectory()
            : basedirArg;
        this.assert(
          typeof basedir === "string",
          `Parameter «basedir» must be string and not «${typeof basedir}» on «ModulerV6.constructor»`,
        );
        this.assert(
          typeof cloneOf === "object",
          `Parameter «cloneOf» must be object or null not «${typeof cloneOf}» on «ModulerV6.constructor»`,
        );
        /**
         * @name ModulerV6.prototype.basedir
         * @type
         * @description
         */
        this.assert(
          typeof basedir === "string",
          `Parameter «basedir» must be string on «Moduler.constructor»`,
        );
        this.basedir = basedir;
        /**
         * @name ModulerV6.prototype.rootdir
         * @type
         * @description
         */
        this.rootdir = cloneOf ? cloneOf.rootdir : basedir;
        /**
         * @name ModulerV6.prototype.modules
         * @type
         * @description
         */
        this.modules = cloneOf ? cloneOf.modules : {};
        /**
         * @name ModulerV6.prototype.compiler
         * @type
         * @description
         */
        this.compiler = null;
        /**
         * @name CompilerV6.prototype.grammars
         * @type
         * @description
         */
        this.grammars = {
          forJs: this.constructor.defaultGrammars.forJs,
          forCss: this.constructor.defaultGrammars.forCss,
          forMd: this.constructor.defaultGrammars.forMd,
          forHtml: this.constructor.defaultGrammars.forHtml,
          forTemplateComments:
            this.constructor.defaultGrammars.forTemplateComments,
          forEmbeddedForms: this.constructor.defaultGrammars.forEmbeddedForms,
        };
        /**
         * @name ModulerV6.prototype.parser
         * @type
         * @description
         */
        this.parser = {
          forJs: this.constructor.Parser.create(this.grammars.forJs),
          forCss: this.constructor.Parser.create(this.grammars.forCss),
          forMd: this.constructor.Parser.create(this.grammars.forMd),
          forHtml: this.constructor.Parser.create(this.grammars.forHtml),
          forTemplateComments: this.constructor.Parser.create(
            this.grammars.forTemplateComments,
          ),
          forEmbeddedForms: this.constructor.Parser.create(
            this.grammars.forEmbeddedForms,
          ),
        };
        /**
         * @name ModulerV6.prototype.css
         * @type
         * @description
         */
        // @SCREWING: esto no permitía fijar el basedir vía cloneForFile
        // this.css = cloneOf ? cloneOf.css : new ModulerV6.CssManager(this);
        this.css = new ModulerV6.CssManager(this);
        /**
         * @name ModulerV6.prototype.settings
         * @type
         * @description
         */
        this.settings = new ModulerV6.Settings(this);
        if (cloneOf) {
          this.settings.data = cloneOf.settings.data;
        }
        /**
         * @name ModulerV6.prototype.runtime
         * @type
         * @description
         */
        this.runtime = ModulerV6.Runtime.globalInstance;
        /**
         * @name ModulerV6.prototype.toolkit
         * @type
         * @description
         */
        if (this.constructor.Toolkit.globalInstance) {
          this.toolkit = this.constructor.Toolkit.globalInstance;
        } else {
          this.toolkit = this.constructor.Toolkit.globalInstance =
            this.constructor.Toolkit.create(this);
        }
      }
      /**
       * @name ModulerV6.globalInstance
       * @type
       * @description
       */
      static globalInstance = new this();
      /**
       * @name ModulerV6.static.isLoaded
       * @type
       * @description
       */
      static isLoaded = (async () => {
        En_paralelo: {
          this.bindToRefrescador();
        }
        await this.globalInstance.runtime.load();
        this.onLoaded.resolve();
      })();
    };
  }.call(),
);
