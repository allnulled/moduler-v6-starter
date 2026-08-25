(function (mod) {
  if (typeof $devbin === "undefined") {
    if (typeof window !== "undefined") window["$devbin"] = mod.globalInstance;
    if (typeof global !== "undefined") global["$devbin"] = mod.globalInstance;
  }
  if (typeof DevBinaryV6 === "undefined") {
    if (typeof window !== "undefined") window["DevBinaryV6"] = mod;
    if (typeof global !== "undefined") global["DevBinaryV6"] = mod;
  }
  return DevBinaryV6;
  // if (typeof module !== 'undefined') module.exports = mod;
})(
  function () {
    /**
     * @name compiler-v6
     * @type library entrypoint
     * @description ...
     */
    (
      function (mod) {
        if (typeof CompilerV6 !== "undefined") return CompilerV6;
        if (typeof window !== "undefined") window["CompilerV6"] = mod;
        if (typeof global !== "undefined") global["CompilerV6"] = mod;
        // if (typeof module !== 'undefined') module.exports = mod;
      }
    )(
      function () {
        (function (mod) {
          if (typeof $moduler === "undefined") {
            if (typeof window !== "undefined")
              window["$moduler"] = mod.globalInstance;
            if (typeof global !== "undefined")
              global["$moduler"] = mod.globalInstance;
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
                    console.log(
                      `[·] [${this.id}] [${this.level}] [=] ${method}`,
                    );
                  },
                  {
                    in: (method) => {
                      this.level++;
                      if (this.isTracing)
                        console.log(
                          `[·] [${this.id}] [${this.level}] [+] ${method}`,
                        );
                    },
                    out: (method) => {
                      this.level--;
                      if (this.isTracing)
                        console.log(
                          `[·] [${this.id}] [${this.level}] [-] ${method}`,
                        );
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
                      return (error) =>
                        this.trace.error(method, error, levelDiff);
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
                  return (
                    ModulerV6.globalInstance.settings.data?.env || "unknown"
                  );
                }
                get isDev() {
                  if (typeof this.cache.isDev === "boolean")
                    return this.cache.isDev;
                  if (ModulerV6.globalInstance.settings.data?.env)
                    return (this.cache.isDev =
                      ModulerV6.globalInstance.settings.data?.env === "dev");
                }
                get isTest() {
                  if (typeof this.cache.isTest === "boolean")
                    return this.cache.isTest;
                  if (ModulerV6.globalInstance.settings.data?.env)
                    return (this.cache.isTest =
                      ModulerV6.globalInstance.settings.data?.env === "test");
                }
                get isProd() {
                  if (typeof this.cache.isProd === "boolean")
                    return this.cache.isProd;
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
                    typeof require !== "undefined" &&
                    typeof __dirname !== "undefined");
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
                  return Promise.all([
                    ModulerV6.globalInstance.settings.load(),
                  ]).then((output) => {
                    this.cache.isLoaded = output;
                    return this;
                  });
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
                      for (
                        let index = 0;
                        index < tokens.formatted.length;
                        index++
                      ) {
                        const requiresToken = tokens.formatted[index];
                        const requiresPathBrute = JSON.parse(
                          requiresToken.inner,
                        );
                        const requiresPath =
                          this.moduler.rootdirOf(requiresPathBrute);
                        loadedRequires.push(requiresPath);
                        const submoduler = this.cloneForFile(requiresPath);
                        if (!(requiresPath in this.sheets)) {
                          await submoduler.css._addRecursively(requiresPath);
                        }
                      }
                      addEvent.sheets[file].requires = loadedRequires;
                    }
                    Define_priority_now: {
                      addEvent.sheets[file].priority = Object.keys(
                        this.sheets,
                      ).length;
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
                    if (
                      this.isNull(obj[key]) ||
                      !this._isPropertoid(obj[key])
                    ) {
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
                  const ref = this._getPropertyAndHolder(
                    path,
                    false,
                    "initialize",
                  );
                  this._assert(
                    this._isPropertoid(ref.obj),
                    `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.initialize»`,
                  );
                  if (this._hasKey(ref.obj, ref.last)) return ref.obj[ref.last];
                  return (ref.obj[ref.last] = value);
                }

                overwrite(path, values = {}) {
                  // @DESCRIPTION: sobreescribe las propiedades de la ruta (objeto o función) con las propiedades del valor
                  const ref = this._getPropertyAndHolder(
                    path,
                    false,
                    "overwrite",
                  );
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
                        if (
                          typeof grammar[2] === "undefined" ||
                          grammar[2] === null
                        ) {
                          grammar[2] = (it) => it;
                        }
                        if (
                          typeof grammar[3] === "undefined" ||
                          grammar[3] === null
                        ) {
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
                                  typeof grammar[3].includeAppendix[
                                    appendixIndex
                                  ],
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
                      const allAppendixes = Array.isArray(
                        grammar[3].includeAppendix,
                      )
                        ? grammar[3].includeAppendix
                        : [grammar[3].includeAppendix];
                      for (
                        let appendixIndex = 0;
                        appendixIndex < allAppendixes.length;
                        appendixIndex++
                      ) {
                        const oneAppendix = allAppendixes[appendixIndex];
                        if (
                          text.startsWith(
                            oneAppendix,
                            currentPosition + ender.length,
                          )
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
                      const lastPosition =
                        currentPosition + enderLength + extraOffset;
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
                            ender ===
                            this.constructor.symbols.PARENTHESYS_BALANCE
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
                    return {
                      syntax: "Multiline Comment Value Injection",
                      ...token,
                    };
                  },
                  { includeAppendix: ['"template"', "0", "() {}"] },
                ],
                MultilineCommentCodeInjection: [
                  "/" + "*%",
                  "*/",
                  function (token) {
                    return {
                      syntax: "Multiline Comment Code Injection",
                      ...token,
                    };
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
                    return {
                      syntax: "New Paragraph Markdown Comment",
                      ...token,
                    };
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
                    return {
                      syntax: "Precised Tabulation Markdown Comment",
                      ...token,
                    };
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
                    return {
                      syntax: "Unspaced Inline Markdown Comment",
                      ...token,
                    };
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
                if (!/\.github\.io$/i.test(window.location.hostname))
                  return false;
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
                REGEX_FOR_ABSOLUTE_WINDOWS_PATH:
                  /^(([A-Za-z]:(\\|\/))|((\\|\/){2}))/g,
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
                    if (projectName)
                      return `${window.location.origin}/${projectName}`;
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
              tracer = this.constructor.Tracer.create(
                "ModulerV6.globalInstance",
              );
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
                  const [_subpath, _activatedOptions] =
                    this._removeSymbolsFromFilepath(subpaths[0], true);
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
                        this.constructor.symbols
                          .REGEX_FOR_ABSOLUTE_WINDOWS_PATH,
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
                    out =
                      this._appendPathSeparator(this.basedir) +
                      subpath.substr(2);
                  } else if (subpath.startsWith("../")) {
                    // @case Ruta relativa al basedir pero directorio superior
                    this.assert(
                      typeof this.basedir === "string",
                      `Cannot use «../» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`,
                    );
                    out =
                      this._appendPathSeparator(this.basedir, "..") +
                      subpath.substr(3);
                  } else if (subpath.startsWith("@/")) {
                    // @case Ruta relativa al rootdir
                    this.assert(
                      typeof this.rootdir === "string",
                      `Cannot use «@/» expression because «this.rootdir» is «${typeof this.rootdir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`,
                    );
                    out =
                      this._appendPathSeparator(this.rootdir) +
                      subpath.substr(2);
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
                  this.runtime.isBrowser
                    ? this._readUrl(url)
                    : this._readFile(url)
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
                return new async function () {}.constructor(
                  ...parameters,
                  source,
                );
              }
              /**
               * @name ModulerV6.prototype._importFile
               * @type
               * @description
               */
              _importFile(filepathInput) {
                let filepath, filepathMask, isInstr, isJson;
                const [filepathBrute, activeOptions] =
                  this._removeSymbolsFromFilepath(filepathInput, true);
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
                console.log(
                  "[*] ModulerV6 imports: " + this.rootdirOf(filepath),
                );
                Evaluate_file_and_export_results: {
                  if (isJson) {
                    return (this.modules[filepathMask] = this._readPath(
                      filepathBrute,
                    )
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
                        activeOptions.justTry === true
                          ? () => undefined
                          : false,
                    },
                  ).then((result) => {
                    let output = undefined;
                    // @ATENCIÓN: sí, parece que esta lógica es necesaria
                    const returnsUndefined = () =>
                      typeof result === "undefined";
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
                    const returnsUndefined = () =>
                      typeof result === "undefined";
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
                const basedirSeparated = this._appendPathSeparator(
                  this.basedir,
                );
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
                const rootdirSeparated = this._appendPathSeparator(
                  this.rootdir,
                );
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
                const asyncFunction = this._createAsyncFunction(
                  finalSource,
                  allKeys,
                );
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
                    const sectionByMap = this._importSectionByMap(
                      _id,
                      uniqueFailure,
                    );
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
                throw new Error(
                  "This error should never happen by design (4993)",
                );
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
              static globalSectionsManagerInstance = new this.SectionsManager(
                {},
              );
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
                  forEmbeddedForms:
                    this.constructor.defaultGrammars.forEmbeddedForms,
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
                  forHtml: this.constructor.Parser.create(
                    this.grammars.forHtml,
                  ),
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
        const CompilerV6 = class CompilerV6 {
          /**
           * @name CompilerV6.CompilerV6.class
           * @type
           * @description
           */
          /**
           * @name CompilerV6.Parser
           * @type
           * @description
           */
          static Parser = ModulerV6.Parser;
          /**
           * @name CompilerV6.Tracer
           * @type
           * @description
           */
          static Tracer =
            /**
             * @name CompilerV6.Tracer.Tracer
             * @type
             * @description
             */
            class Tracer {
              constructor(compiler) {
                /**
                 * @name CompilerV6.Tracer.prototype.compiler
                 * @type
                 * @description
                 */
                this.compiler = compiler;
                /**
                 * @name CompilerV6.Tracer.prototype.isBrowser
                 * @type
                 * @description
                 */
                this.isBrowser = compiler.isBrowser;
                /**
                 * @name CompilerV6.Tracer.prototype.isTracing
                 * @type
                 * @description
                 */
                this.isTracing = false;
                /**
                 * @name CompilerV6.Tracer.prototype.isLogging
                 * @type
                 * @description
                 */
                this.isLogging = true;
                /**
                 * @name CompilerV6.Tracer.prototype.stack
                 * @type
                 * @description
                 */
                this.stack = [];
                /**
                 * @name CompilerV6.Tracer.prototype.highlightedPatterns
                 * @type
                 * @description
                 */
                this.highlightedPatterns = [
                  // Set patterns to highlight:
                  ["assert", "blackBright"],
                  ["_compileRecursively", "cyan,underline"],
                  ["_tokenizeText", "cyan,underline"],
                  ["_compileTokens", "cyan,underline"],
                  [".constructor", "blue"],
                  ["_replaceTextRange", "yellow,bold"],
                ];
                /**
                 * @name CompilerV6.Tracer.prototype.ignoredPatterns
                 * @type
                 * @description
                 */
                this.ignoredPatterns = [
                  "assert",
                  // "[ok]",
                ];
              }
              /**
               * @name CompilerV6.Tracer.prototype.activate
               * @type
               * @description
               */
              activate(really = true) {
                this.isTracing = !!really;
                return this;
              }
              /**
               * @name CompilerV6.Tracer.prototype.deactivate
               * @type
               * @description
               */
              deactivate(really = true) {
                this.isTracing = !!!really;
                return this;
              }
              /**
               * @name CompilerV6.Tracer.prototype.addHighlighter
               * @type
               * @description
               */
              addHighlighter(text) {
                if (highlightedPatterns.indexOf(text) === -1) {
                  highlightedPatterns.push(text);
                }
              }
              /**
               * @name CompilerV6.Tracer.prototype.removeHighlighter
               * @type
               * @description
               */
              removeHighlighter(text) {
                const pos = highlightedPatterns.indexOf(text);
                if (pos !== -1) {
                  highlightedPatterns.splice(pos, 1);
                }
              }
              /**
               * @name CompilerV6.Tracer.prototype.indentByLevel
               * @type
               * @description
               */
              indentByLevel(input) {
                return " ".repeat(this.stack.length) + input;
              }
              /**
               * @name CompilerV6.Tracer.prototype.matchesIgnorer
               * @type
               * @description
               */
              matchesIgnorer(text) {
                for (
                  let index = 0;
                  index < this.ignoredPatterns.length;
                  index++
                ) {
                  const pattern = this.ignoredPatterns[index];
                  if (text.includes(pattern)) {
                    return true;
                  }
                }
                return false;
              }
              /**
               * @name CompilerV6.Tracer.prototype.highlightIfMatched
               * @type
               * @description
               */
              highlightIfMatched(output) {
                let styling = false;
                Iterating_patterns: for (
                  let index = 0;
                  index < this.highlightedPatterns.length;
                  index++
                ) {
                  const details = this.highlightedPatterns[index];
                  const [text] = details;
                  if (output.indexOf(text) !== -1) {
                    styling = details[1] || "yellow,bold";
                    break Iterating_patterns;
                  }
                }
                if (output.includes("++]") || output.includes("--]")) {
                  styling = "bold," + (styling || "");
                }
                if (styling === false) {
                  return output;
                }
                return this.compiler.constructor.ansi.colors
                  .style(styling)
                  .text(output);
              }
              /**
               * @name CompilerV6.Tracer.prototype.trace
               * @type
               * @description
               */
              trace(message, args, spaceDiff = 0) {
                if (this.isTracing) {
                  let output = ``;
                  output += `[${this.stack.length}${spaceDiff === 1 ? "++" : spaceDiff === -1 ? "--" : ""}] `;
                  output += this.compiler.name
                    ? `[${this.compiler.name}] `
                    : `[mv6] `;
                  output += `[${message}] `;
                  output += `arguments: ${args.length}`;
                  output = this.highlightIfMatched(output);
                  output = this.indentByLevel(output);
                  if (!this.matchesIgnorer(output)) {
                    console.log(output);
                  }
                  if (this.isLogging) {
                    this.compiler.log(CompilerV6.ansi.colors.stripAnsi(output));
                  }
                }
              }
              /**
               * @name CompilerV6.Tracer.prototype.traceIn
               * @type
               * @description
               */
              traceIn(msg, args) {
                this.trace(msg, args, 1);
                this.stack.push(msg);
              }
              /**
               * @name CompilerV6.Tracer.prototype.traceOut
               * @type
               * @description
               */
              traceOut(msg, args) {
                const lastInStack = this.stack[this.stack.length - 1];
                // this.compiler.assert(lastInStack === msg, `Method «Tracer.prototype.traceOut» closing different method from stack: it should close «${lastInStack}» but it is trying to close «${msg}» `);
                this.stack.pop();
                this.trace(msg, args, -1);
              }
              /**
               * @name CompilerV6.Tracer.prototype.printStack
               * @type
               * @description
               */
              printStack() {
                console.log(
                  `Tracer «${this.compiler.name || "mv6"}» with:`,
                  this.stack,
                );
              }
            };
          /**
           * @name CompilerV6.AssertionError
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
           * @name CompilerV6.Logger
           * @type
           * @description
           */
          static Logger = class Logger {
            /**
             * @name CompilerV6.Logger.Logger.class
             * @type
             * @description
             */
            /**
             * @name CompilerV6.Logger.fromFile
             * @type
             * @description
             */
            static fromFile(file) {
              return new this({ file });
            }
            /**
             * @name CompilerV6.Logger.Manager
             * @type
             * @description
             */
            static Manager =
              /**
               * @name CompilerV6.Logger.Manager
               * @type
               * @description
               */
              class LoggerManager {
                /**
                 * @name CompilerV6.Logger.Manager.fromDirectory
                 * @type
                 * @description
                 */
                static fromDirectory(basedir) {
                  return new this(basedir);
                }
                /**
                 * @name CompilerV6.Logger.Manager.constructor
                 * @type
                 * @description
                 */
                constructor(basedir) {
                  this.basedir = basedir;
                  this.selected = "default";
                  this.subloggers = {
                    default: new Logger({
                      file: require("path").resolve(basedir, "default.txt"),
                    }),
                  };
                }
                /**
                 * @name CompilerV6.Logger.Manager.get.current
                 * @type
                 * @description
                 */
                get current() {
                  return this.subloggers[this.selected];
                }
                /**
                 * @name CompilerV6.Logger.Manager.prototype.addLogger
                 * @type
                 * @description
                 */
                addLogger(id) {
                  this.subloggers[id] = new Logger({
                    file: require("path").resolve(this.basedir, id + ".txt"),
                  });
                }
                /**
                 * @name CompilerV6.Logger.Manager.prototype.has
                 * @type
                 * @description
                 */
                has(id) {
                  return id in this.subloggers;
                }
                /**
                 * @name CompilerV6.Logger.Manager.prototype.into
                 * @type
                 * @description
                 */
                into(id) {
                  if (!this.has(id)) {
                    this.addLogger(id);
                  }
                  return this.subloggers[id];
                }
                /**
                 * @name CompilerV6.Logger.Manager.prototype.select
                 * @type
                 * @description
                 */
                select(id = false) {
                  if (id === false) {
                    if (!this.has(this.selected)) {
                      this.addLogger(this.selected);
                    }
                    return this.subloggers[this.selected];
                  }
                  if (!this.has(id)) {
                    this.addLogger(this.selected);
                  }
                  this.selected = id;
                  return this.select();
                }
                /**
                 * @name CompilerV6.Logger.Manager.prototype.resetFile
                 * @type
                 * @description
                 */
                resetFile(...args) {
                  if (!this.has(this.selected)) {
                    this.addLogger(this.selected);
                  }
                  return this.subloggers[this.selected].resetFile(...args);
                }
                /**
                 * @name CompilerV6.Logger.Manager.prototype.log
                 * @type
                 * @description
                 */
                log(...args) {
                  if (!this.has(this.selected)) {
                    this.addLogger(this.selected);
                  }
                  return this.subloggers[this.selected].log(...args);
                }
              };

            /**
             * @name CompilerV6.Logger.create
             * @type
             * @description
             */
            static create(...args) {
              return new this(...args);
            }
            /**
             * @name CompilerV6.Logger.defaultOptions
             * @type
             * @description
             */
            static defaultOptions = {
              console: true,
            };
            /**
             * @name CompilerV6.Logger.constructor
             * @type
             * @description
             */
            constructor(options, compiler) {
              this.options = Object.assign(
                {},
                this.constructor.defaultOptions,
                options,
              );
              this.compiler = compiler;
              this.startedAt = new Date();
              this.lastLogAt = new Date();
            }
            /**
             * @name CompilerV6.Logger.prototype.resetFile
             * @type
             * @description
             */
            resetFile(...args) {
              return require("fs")
                .promises.writeFile(this.options.file, "", "utf8")
                .then(() => {
                  this.startedAt = new Date();
                  this.lastLogAt = new Date();
                  return this.log(...args);
                });
            }
            /**
             * @name CompilerV6.Logger.prototype.getTimeOffset
             * @type
             * @description
             */
            getTimeOffset() {
              return "+" + (new Date().getTime() - this.startedAt.getTime());
            }
            /**
             * @name CompilerV6.Logger.prototype.getLastLogOffset
             * @type
             * @description
             */
            getLastLogOffset() {
              return "+" + (new Date().getTime() - this.lastLogAt.getTime());
            }
            /**
             * @name CompilerV6.Logger.prototype.log
             * @type
             * @description
             */
            log(...args) {
              const line = this.stringifySafe({
                "@": this.getMomentToString(),
                "#": this.getTimeOffset(),
                "##": this.getLastLogOffset(),
                "*": args,
              });
              if (this.options.console) {
                console.log(`~[LOG] ${line}`);
              }
              this.lastLogAt = new Date();
              if (this.options.file) {
                return require("fs")
                  .promises.appendFile(this.options.file, line + "\n", "utf8")
                  .catch(console.error);
              }
            }
            /**
             * @name CompilerV6.Logger.prototype.setOption
             * @type
             * @description
             */
            setOption(id, value) {
              this.options[id] = value;
              return this;
            }
            /**
             * @name CompilerV6.Logger.prototype.getMomentToString
             * @type
             * @description
             */
            getMomentToString() {
              const d = new Date();
              const pad = (n) => String(n).padStart(2, "0");
              const pad3 = (n) => String(n).padStart(3, "0");
              return (
                `${d.getFullYear()}-` +
                `${pad(d.getMonth() + 1)}-` +
                `${pad(d.getDate())} ` +
                `${pad(d.getHours())}:` +
                `${pad(d.getMinutes())}:` +
                `${pad(d.getSeconds())}.` +
                `${pad3(d.getMilliseconds())}`
              );
            }
            /**
             * @name CompilerV6.Logger.prototype.stringifySafe
             * @type
             * @description
             */
            stringifySafe(value) {
              const seen = new WeakSet();
              return JSON.stringify(
                value,
                (key, val) => {
                  if (typeof val === "bigint") {
                    return `${val}n`;
                  }
                  if (typeof val === "function") {
                    return `[Function ${val.name || "anonymous"}]`;
                  }
                  if (val instanceof Error) {
                    return {
                      name: val.name,
                      message: val.message,
                      stack: val.stack,
                    };
                  }
                  if (typeof val === "object" && val !== null) {
                    if (seen.has(val)) {
                      return "[Circular]";
                    }
                    seen.add(val);
                  }
                  return val;
                },
                0,
              );
            }
          };

          /**
           * @name CompilerV6.Moduler
           * @type
           * @description
           */
          static Moduler = ModulerV6;
          /**
           * @name DevBinaryV6.static.Files
           * @type
           * @description
           */
          static Files =
            /**
             * @name CompilerV6.Files
             * @type
             * @description
             */
            class Files {
              /**
               * @name DevBinaryV6.Files.static.create
               * @type
               * @description
               */
              static create(...args) {
                return new this(...args);
              }
              /**
               * @name CompilerV6.Files.constructor
               * @type
               * @description
               */
              constructor(compiler) {
                /**
                 * @name CompilerV6.Files.prototype.compiler
                 * @type
                 * @description
                 */
                this.compiler = compiler;
              }
              /**
               * @name CompilerV6.Files.prototype.trify
               * @type
               * @description
               */
              async trify(callback, ...args) {
                try {
                  return await callback(...args);
                } catch (error) {
                  return null;
                }
              }
              /**
               * @name CompilerV6.Files.prototype.deleteFile
               * @type
               * @description
               */
              deleteFile = Object.assign(
                (file) => {
                  return require("fs").promises.unlink(file);
                },
                {
                  try: (...args) => this.trify(this.deleteFile, ...args),
                },
              );
              /**
               * @name CompilerV6.Files.prototype.deleteDirectory
               * @type
               * @description
               */
              deleteDirectory = Object.assign(
                (dir) => {
                  const fullDir = this.compiler.moduler.normalizationOf(dir);
                  return require("fs").promises.rm(fullDir, {
                    recursive: true,
                  });
                },
                {
                  try: (...args) => this.trify(this.deleteDirectory, ...args),
                },
              );
              /**
               * @name CompilerV6.Files.prototype.hasFile
               * @type
               * @description
               */
              hasFile(file) {
                return require("fs")
                  .promises.access(file)
                  .then(() => true)
                  .catch((error) => false);
              }
              /**
               * @name CompilerV6.Files.prototype.hasDirectory
               * @type
               * @description
               */
              hasDirectory(dir) {
                return require("fs")
                  .promises.access(dir)
                  .then(() => true)
                  .catch((error) => false);
              }
              /**
               * @name CompilerV6.Files.prototype.writeFile
               * @type
               * @description
               */
              writeFile = Object.assign(
                (file, contents, encoding = "utf8") => {
                  const absolutePath = this.compiler.normalizationOf(file);
                  return require("fs").promises.writeFile(
                    absolutePath,
                    contents,
                    encoding,
                  );
                },
                {
                  try: (...args) => this.trify(this.writeFile, ...args),
                },
              );
              /**
               * @name CompilerV6.Files.prototype.makeDirectory
               * @type
               * @description
               */
              makeDirectory = Object.assign(
                (dir) => {
                  const fullDir = this.compiler.normalizationOf(dir);
                  return require("fs").promises.mkdir(fullDir);
                },
                {
                  try: (...args) => this.trify(this.makeDirectory, ...args),
                },
              );
              /**
               * @name CompilerV6.Files.prototype.readFile
               * @type
               * @description
               */
              readFile = Object.assign(
                (file, encoding = "utf8") => {
                  const absolutePath = this.compiler.normalizationOf(file);
                  return require("fs").promises.readFile(
                    absolutePath,
                    encoding,
                  );
                },
                {
                  try: (...args) => this.trify(this.readFile, ...args),
                },
              );
              /**
               * @name CompilerV6.Files.prototype.copyDirectory
               * @type
               * @description
               */
              copyDirectory = Object.assign(
                async (src, dst) => {
                  const fullSrc = this.compiler.moduler.normalizationOf(src);
                  const fullDst = this.compiler.moduler.normalizationOf(dst);
                  await this.ensureDirectory(fullDst);
                  return await require("fs").promises.cp(fullSrc, fullDst, {
                    recursive: true,
                  });
                },
                {
                  try: (...args) => this.trify(this.copyDirectory, ...args),
                },
              );
              /**
               * @name CompilerV6.Files.prototype.copyFile
               * @type
               * @description
               */
              copyFile = Object.assign(
                async (src, dst) => {
                  const fullSrc = this.compiler.moduler.normalizationOf(src);
                  const fullDst = this.compiler.moduler.normalizationOf(dst);
                  return await require("fs").promises.copyFile(
                    fullSrc,
                    fullDst,
                  );
                },
                {
                  try: (...args) => this.trify(this.copyFile, ...args),
                },
              );
              /**
               * @name CompilerV6.Files.prototype.ensureDirectory
               * @type
               * @description
               */
              ensureDirectory(dir) {
                return require("fs")
                  .promises.mkdir(dir, { recursive: true })
                  .catch((error) => -2);
              }
            };
          /**
           * @name CompilerV6.CompilationProcess
           * @type
           * @description
           */
          static CompilationProcess = class CompilationProcess {
            /**
             * @name CompilerV6.CompilationProcess.assert
             * @type
             * @description
             */
            static assert(condition, message) {
              if (!condition) throw new Error(message);
            }
            /**
             * @name CompilerV6.CompilationProcess._defaultProcessData
             * @type
             * @description
             */
            static get _defaultProcessData() {
              return {
                processedEntries: {},
                // @ATENTION: Si se descomenta petan los tests:
                // uncacheInjections: false,
                dontCreateOnInjectSource: true,
                disableTemplates: false,
              };
            }
            /**
             * @name CompilerV6.CompilationProcess.constructor
             * @type
             * @description
             */
            constructor(compilationFile, compilationProcess, compiler) {
              this.constructor.assert(
                typeof compiler === "object",
                "Parameter «compiler» must be object on «CompilerV6.CompilationProcess.constructor»",
              );
              this.constructor.assert(
                compiler instanceof CompilerV6,
                "Parameter «compiler» must be instance of «CompilerV6» on «CompilerV6.CompilationProcess.constructor»",
              );
              this.compiler = compiler;
              this.compiler._traceIn(
                "CompilationProcess.constructor",
                arguments,
              );
              if (compilationProcess instanceof this.constructor) {
                this.compiler._traceOut(
                  "CompilationProcess.constructor",
                  arguments,
                );
                Object.assign(
                  this,
                  this.constructor._defaultProcessData,
                  compilationProcess,
                );
                return this;
              } else {
                this.compiler.assert(
                  typeof compilationFile === "object",
                  "Parameter «compilationFile» must be object on «CompilerV6.CompilationProcess.constructor»",
                );
                this.compiler.assert(
                  typeof compilationProcess === "object",
                  "Parameter «compilationProcess» must be object on «CompilerV6.CompilationProcess.constructor»",
                );
                Object.assign(
                  this,
                  this.constructor._defaultProcessData,
                  compilationProcess,
                );
                if (typeof this.resource === "undefined") {
                  this.compiler.assert(
                    typeof compilationFile.resource === "string",
                    "Parameter «compilationProcess.resource» or «compilationFile.resource» must be string on «CompilerV6.CompilationProcess.constructor»",
                  );
                  this.resource = compilationFile.resource;
                }
                if (typeof this.isRoot === "undefined") {
                  this.isRoot = compilationFile.isRoot;
                }
                if (typeof this.enableTemplates === "undefined") {
                  this.enableTemplates = false;
                }
                this.compiler.assert(
                  typeof this.resource === "string",
                  "Parameter «compilationProcess.resource» must be string on «CompilerV6.CompilationProcess.constructor»",
                );
                this.compiler.assert(
                  typeof this.isRoot === "boolean",
                  "Parameter «compilationProcess.isRoot» must be boolean on «CompilerV6.CompilationProcess.constructor»",
                );
                this.compiler._traceOut(
                  "CompilationProcess.constructor",
                  arguments,
                );
                return this;
              }
            }
            /**
             * @name CompilerV6.CompilationProcess.from
             * @type
             * @description
             */
            static from(...args) {
              return new this(...args);
            }
          };
          /**
           * @name CompilerV6.CompilationFile
           * @type
           * @description
           */
          static CompilationFile = class CompilationFile {
            /**
             * @name CompilerV6.CompilationFile.assert
             * @type
             * @description
             */
            static assert(condition, message) {
              if (!condition) throw new Error(message);
            }
            /**
             * @name CompilerV6.CompilationFile._defaultFileData
             * @type
             * @description
             */
            static get _defaultFileData() {
              return {
                compilation: {
                  js: "",
                  css: "",
                  md: "",
                },
                report: {
                  tree: {},
                },
                mdUnification: [],
              };
            }
            /**
             * @name CompilerV6.CompilationFile.constructor
             * @type
             * @description
             */
            constructor(compilationFile, compilationProcess, compiler) {
              this.constructor.assert(
                typeof compiler === "object",
                "Parameter «compiler» must be object on «CompilerV6.CompilationFile.constructor»",
              );
              this.constructor.assert(
                compiler instanceof CompilerV6,
                "Parameter «compiler» must be instance of «CompilerV6» on «CompilerV6.CompilationFile.constructor»",
              );
              this.compiler = compiler;
              this.compiler._traceIn("CompilationFile.constructor", arguments);
              if (compilationProcess instanceof this.constructor) {
                Object.assign(
                  this,
                  this.constructor._defaultFileData,
                  compilationFile,
                );
                this.compiler._traceOut(
                  "CompilationProcess.constructor",
                  arguments,
                );
              } else {
                this.compiler.assert(
                  typeof compilationFile === "object",
                  "Parameter «compilationFile» must be object on «CompilerV6.CompilationFile.constructor»",
                );
                this.compiler.assert(
                  typeof compilationProcess === "object",
                  "Parameter «compilationProcess» must be object on «CompilerV6.CompilationFile.constructor»",
                );
                Object.assign(
                  this,
                  this.constructor._defaultFileData,
                  compilationFile,
                );
                this.compiler.assert(
                  typeof this.resource === "string",
                  "Parameter «compilationFile.resource» must be string on «CompilerV6.CompilationFile.constructor»",
                );
                this.compiler.assert(
                  typeof this.isRoot === "boolean",
                  "Parameter «compilationFile.isRoot» must be boolean on «CompilerV6.CompilationFile.constructor»",
                );
                this.compiler._traceOut(
                  "CompilationFile.constructor",
                  arguments,
                );
              }
            }
            /**
             * @name CompilerV6.CompilationFile.from
             * @type
             * @description
             */
            static from(...args) {
              return new this(...args);
            }
          };
          /**
           * @name CompilerV6.CompilationResult.CompilationResult
           * @type
           * @description
           */
          static CompilationResult = class {
            /**
             * @name CompilerV6.CompilationResult.constructor
             * @type
             * @description
             */
            constructor(output = {}, compiler = null) {
              Object.assign(this, output);
              this.compiler = compiler;
            }
            /**
             * @name CompilerV6.CompilationResult.prototype.toFile
             * @type
             * @description
             */
            toFile(file, options = {}) {
              this.compiler.assert(
                require("path").basename(file).includes(".dist."),
                `Method «toFile» only accepts files containing «.dist.» pattern and file «${file}» does not incur the case`,
              );
              const fileExtension = require("path").extname(file);
              const fileNormalization = this.compiler.normalizationOf(file);
              const fileJs = this.compiler.constructor._changeFileExtension(
                fileNormalization,
                ".js",
              );
              const fileCss = this.compiler.constructor._changeFileExtension(
                fileNormalization,
                ".css",
              );
              const fileMd = this.compiler.constructor._changeFileExtension(
                fileNormalization,
                ".md",
              );
              const promises = [];
              if (this.js || true) {
                const outputJs =
                  options.mode === "beautified" && this.beautifiedJs
                    ? this.beautifiedJs.code
                    : options.mode === "minified" && this.minifiedJs
                      ? this.minifiedJs.code
                      : this.js;
                promises.push(
                  require("fs").promises.writeFile(fileJs, outputJs, "utf8"),
                );
                console.log(
                  `[*] Saving compilation.js (${options.mode || "raw code"}) at: ` +
                    fileJs,
                );
              } else if (this.css) {
                promises.push(
                  require("fs").promises.writeFile(fileCss, this.css, "utf8"),
                );
                console.log("[*] Saving compilation.css at: " + fileCss);
              } else if (this.md) {
                promises.push(
                  require("fs").promises.writeFile(fileMd, this.md, "utf8"),
                );
                console.log("[*] Saving compilation.md at: " + fileMd);
              }
              return Promise.all(promises);
            }
            /**
             * @name CompilerV6.CompilationResult.prototype.toJsonable
             * @type
             * @description
             */
            toJsonable() {
              return Object.assign({}, this, {
                // @CUSTOMIZABLE: override non-jsonable properties here:
                compiler: undefined,
                moduler: undefined,
              });
            }
          };
          /**
           * @name CompilerV6._nativeGrammars
           * @type ?
           * @description ?
           * @parameter ?
           * @return ?
           */
          static _nativeGrammars = ModulerV6.nativeGrammars;
          /**
           * @name CompilerV6._defaultGrammars
           * @type ?
           * @description ?
           * @parameter ?
           * @return ?
           */
          static _defaultGrammars = ModulerV6.defaultGrammars;
          /**
           * @name CompilerV6._changeFileExtension
           * @type
           * @description
           */
          static _changeFileExtension(file, nuevaExt) {
            const path = require("path");
            if (!nuevaExt.startsWith(".")) {
              nuevaExt = "." + nuevaExt;
            }
            const dir = path.dirname(file);
            const nombre = path.basename(file, path.extname(file));
            return path.join(dir, nombre + nuevaExt);
          }
          /**
           * @name CompilerV6.beautifyJs
           * @type
           * @description
           */
          static beautifyJs(code) {
            try {
              return require("prettier").format(code, {
                parser: "babel",
              });
            } catch (error) {
              console.error(`[!] ERROR DESDE EL BEAUTIFIER:`, error);
              return code;
            }
          }
          /**
           * @name CompilerV6.softMinifyJs
           * @type
           * @description
           */
          static async softMinifyJs(code) {
            try {
              const out = await this.beautifyJs(code);
              return { code: out };
              return await require("terser").minify(code, {
                compress: {
                  sequences: true,
                },
                mangle: false,
                toplevel: true,
                format: {
                  comments: false, // Esta es la única cambiada
                  beautify: true,
                  indent_level: 2,
                  max_line_len: true,
                },
              });
            } catch (error) {
              console.log(`[!] ERROR EN EL SOFT-MINIFIER:`, error);
              return { code };
            }
          }
          /**
           * @name CompilerV6.hardMinifyJs
           * @type
           * @description
           */
          static async hardMinifyJs(code) {
            try {
              return await require("terser").minify(code, {
                compress: {
                  defaults: true,
                  passes: 5,
                  unsafe: true,
                  toplevel: true,
                },
                mangle: {
                  toplevel: true,
                },
              });
            } catch (error) {
              console.log(`[!] ERROR EN EL HARD-MINIFIER:`, error);
              return { code };
            }
          }
          /**
           * @name CompilerV6.getStringSize
           * @type
           * @description
           */
          static getStringSize(text) {
            let bytes = undefined;
            if (this.isBrowser) {
              bytes = new TextEncoder().encode(text).length;
            } else {
              bytes = Buffer.byteLength(text, "utf8");
            }
            if (bytes < 1024 * 1024) {
              return `${(bytes / 1024).toFixed(2)}KB`;
            } else {
              return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
            }
          }
          /**
           * @name CompilerV6.create
           * @type
           * @description
           */
          static create(...args) {
            return new this(...args);
          }
          /**
           * @name CompilerV6.fromDirectory
           * @type
           * @description
           */
          static fromDirectory(dir) {
            return new this(dir);
          }
          /**
           * @name CompilerV6.fromRootOf
           * @type
           * @description
           */
          static async fromRootOf(file) {
            const root = await this.findRootOf(file);
            return new this(root);
          }
          /**
           * @name CompilerV6.findRootOf
           * @type
           * @description
           */
          static async findRootOf(file, whenContains = "package.json") {
            const fs = require("fs");
            const path = require("path");
            let dir0 = null;
            let dir1 = file;
            while (dir0 !== dir1) {
              try {
                const filepath = path.resolve(dir1, whenContains);
                await fs.promises.readFile(filepath);
                return dir1;
              } catch (error) {
                dir0 = dir1;
                dir1 = path.dirname(dir1);
              }
            }
            return null;
          }
          /**
           * @name CompilerV6.colors
           * @type
           * @description
           */
          static ansi = {
            colors:
              /**
               * @name CompilerV6.colors
               * @type
               * @description
               */
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

                    // fondo
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
                  style: function (config = "red,bold,underline") {
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
                      for (
                        let indexCol = 0;
                        indexCol < row.length;
                        indexCol++
                      ) {
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
                      for (
                        let indexCol = 0;
                        indexCol < row.length;
                        indexCol++
                      ) {
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
          };
          /**
           * @name CompilerV6.constructor  
           * @type
           * @description
           */
          constructor(
            basedirInput,
            parent = null,
            grammars = this.constructor._defaultGrammars,
          ) {
            if (!(typeof basedirInput === "string")) {
              throw new this.constructor.AssertionError(
                `Parameter «basedir» must be string not «${typeof basedirInput}» on «CompilerV6.constructor»`,
              );
            }
            if (!(typeof parent === "object")) {
              throw new this.constructor.AssertionError(
                `Parameter «parent» must be object not «${typeof parent}» on «CompilerV6.constructor»`,
              );
            }
            if (!(typeof grammars === "object")) {
              throw new this.constructor.AssertionError(
                `Parameter «grammars» must be object not «${typeof grammars}» on «CompilerV6.constructor»`,
              );
            }
            if (parent) {
              this._tracer = parent._tracer;
            }
            this._trace("constructor", arguments);
            const basedir = parent
              ? parent.fullpathOf(basedirInput)
              : this.fullpathOf(basedirInput);
            // const basedir = this.normalizationOf(basedirInput);
            /**
             * @name CompilerV6.prototype.isBrowser
             * @type
             * @description
             */
            this.isBrowser = typeof window !== "undefined";
            /**
             * @name CompilerV6.prototype.basedir
             * @type
             * @description
             */
            this.basedir = basedir;
            /**
             * @name CompilerV6.prototype.previousdir
             * @type
             * @description
             */
            this.previousdir = parent ? parent.basedir : basedir;
            /**
             * @name CompilerV6.prototype.rootdir
             * @type
             * @description
             */
            this.rootdir = parent ? parent.rootdir : basedir;
            /**
             * @name CompilerV6.prototype.moduler
             * @type
             * @description
             */
            this.moduler = new ModulerV6(basedir);
            this.moduler.compiler = this;
            /**
             * @name DevBinaryV6.prototype.files
             * @type
             * @description
             */
            this.files = parent
              ? parent.files
              : new this.constructor.Files(this);
            /**
             * @name CompilerV6.prototype._grammars
             * @type
             * @description
             */
            this._grammars = this.moduler.grammars;
            /**
             * @name CompilerV6.prototype._parser
             * @type
             * @description
             */
            this._parser = this.moduler.parser;
          }

          /**
           * @name CompilerV6.prototype._readPath
           * @type
           * @description
           */
          _readPath(url) {
            this._trace("_readPath", arguments);
            return this._isBrowser ? this._readUrl(url) : this._readFile(url);
          }
          /**
           * @name CompilerV6.prototype._readUrl
           * @type
           * @description
           */
          _readUrl(url) {
            this._trace("_readUrl", arguments);
            return fetch(this.normalizationOf(url), { method: "GET" }).then(
              (response) => response.text(),
            );
          }
          /**
           * @name CompilerV6.prototype._readFile
           * @type
           * @description
           */
          _readFile(file) {
            this._trace("_readFile", arguments);
            return require("fs").promises.readFile(
              this.normalizationOf(file),
              "utf8",
            );
          }
          /**
           * @name CompilerV6.prototype.assert
           * @type
           * @description
           */
          assert(condition, message) {
            this._trace("assert", arguments);
            if (!condition) {
              throw new this.constructor.AssertionError(message);
            } else if (this._tracer.isTracing) {
              this._notifyAssertion(message);
            }
          }
          /**
           * @name CompilerV6.prototype.assertThrows
           * @type
           * @description
           */
          async assertThrows(callback, message, checker = () => true) {
            const localError = new Error("Should have thrown: " + message);
            try {
              await callback();
              throw localError;
            } catch (err) {
              if (err === localError) {
                throw new this.constructor.AssertionError(
                  `Should have thrown: ${err.name}: ${err.message} | ${err.stack}`,
                );
              }
              if (!checker(err)) {
                throw new this.constructor.AssertionError(
                  `Should have thrown but not specific error: ${err.name}: ${err.message} | ${err.stack}`,
                );
              }
              this._notifyAssertion(message);
            }
          }
          /**
           * @name CompilerV6.prototype.assertDoesNotThrow
           * @type
           * @description
           */
          async assertDoesNotThrow(callback, message, checker = () => true) {
            try {
              await callback();
              this._notifyAssertion(message);
            } catch (err) {
              if (!checker(err)) {
                throw new this.constructor.AssertionError(
                  `Should not have thrown specific error: ${err.name}: ${err.message}`,
                );
              }
              throw new this.constructor.AssertionError(
                `Should not have thrown: ${err.name}: ${err.message}`,
              );
            }
          }
          /**
           * @name CompilerV6.prototype.createAssertFunction
           * @type
           * @description
           */
          createAssertFunction() {
            return (...args) => this.assert(...args);
          }
          /**
           * @name CompilerV6.prototype._notifyAssertion
           * @type
           * @description
           */
          _notifyAssertion(message) {
            const text = `[ok] ${message}`;
            if (this._tracer.isTracing && !this._tracer.matchesIgnorer(text)) {
              console.log(
                this._tracer.indentByLevel(
                  this.constructor.ansi.colors.style("blackBright").text(text),
                ),
              );
            }
          }
          /**
           * @name CompilerV6.prototype._logger
           * @type
           * @description
           */
          _logger = null;
          /**
           * @name CompilerV6.prototype._tracer
           * @type
           * @description
           */
          _tracer = new this.constructor.Tracer(this);
          /**
           * @name CompilerV6.prototype._trace
           * @type
           * @description
           */
          _trace(method, args = []) {
            return this._tracer.trace(method, args);
          }
          /**
           * @name CompilerV6.prototype._traceIn
           * @type
           * @description
           */
          _traceIn(method, args = []) {
            return this._tracer.traceIn(method, args);
          }
          /**
           * @name CompilerV6.prototype._traceOut
           * @type
           * @description
           */
          _traceOut(method, args = []) {
            return this._tracer.traceOut(method, args);
          }
          /**
           * @name CompilerV6.prototype._debug
           * @type
           * @description
           */
          _debug(...list) {
            for (let index = 0; index < list.length; index++) {
              const item = list[index];
              let output = item;
              try {
                output = JSON.stringify(item, null, 2);
              } catch (error) {
                // @OK
                console.warn(error);
              }
              console.log(
                this.constructor.ansi.colors
                  .style("yellow,bold,underline")
                  .text(`[debug] parameter ${index}:`),
                output,
              );
            }
            return list[0];
          }
          /**
           * @name CompilerV6.prototype._die
           * @type
           * @description
           */
          _die(...args) {
            this._trace("die", arguments);
            console.log("[DIE]", ...args);
            process.exit(0);
          }
          /**
           * @name CompilerV6.prototype._tokenizeText
           * @type
           * @description
           */
          _tokenizeText(compilationFile, compilationProcess) {
            this._traceIn("_tokenizeText", arguments);
            this.assert(
              typeof compilationProcess === "object",
              "Parameter «compilationProcess» must be object on «CompilerV6.prototype._tokenizeText»",
            );
            this.assert(
              typeof compilationProcess.resource === "string",
              "Parameter «compilationProcess.resource» must be string on «CompilerV6.prototype._tokenizeText»",
            );
            this.assert(
              typeof compilationFile === "object",
              "Parameter «compilationFile» must be object on «CompilerV6.prototype._tokenizeText»",
            );
            this.assert(
              typeof compilationFile.source === "string",
              "Parameter «compilationFile.source» must be string on «CompilerV6.prototype._tokenizeText»",
            );
            this.assert(
              typeof compilationFile.extension === "string",
              "Parameter «compilationFile.extension» must be string on «CompilerV6.prototype._tokenizeText»",
            );
            let out = undefined;
            if (compilationFile.extension === "js") {
              out = this._parser.forJs.parse(compilationFile.source);
            } else if (compilationFile.extension === "css") {
              out = this._parser.forCss.parse(compilationFile.source);
            } else if (compilationFile.extension === "md") {
              out = this._parser.forMd.parse(compilationFile.source);
            } else if (compilationFile.extension === "json") {
              out = { formatted: [] };
            } else if (compilationFile.extension === "html") {
              out = this._parser.forHtml.parse(compilationFile.source);
            } else {
              throw new Error(
                `File extension cannot be tokenized: «${compilationFile.resource}»`,
              );
            }
            delete out.text;
            compilationFile.tokenization = out;
            //
            this._traceOut("_tokenizeText", arguments);
            return out;
          }
          /**
           * @name CompilerV6.prototype._replaceTextRange
           * @type
           * @description
           */
          _replaceTextRange(text, start, end, replacement, token = false) {
            this._trace("_replaceTextRange", arguments);
            if (text.length < start) {
              this._tracer.printStack();
              throw new Error("Text replacement out of text boundaries (1)");
            }
            if (text.length < end) {
              this._tracer.printStack();
              throw new Error("Text replacement out of text boundaries (2)");
            }
            // @ANTES:
            // const offset = ((!token) && (token.syntax === "@Injects")) ? 2 : 1;
            const offset = token.syntax === "@Injects" ? 0 : 1;
            // @AHORA: porque ya está solucionado lo del offset de @injects del location[1]
            // @ATENCIÓN: aquí le decimos que empiece por el siguiente caracter del último
            // @ATENCIÓN: porque location[1] indica la posición final del inner, NO LA INICIAL DEL OUTER
            const output =
              text.slice(0, start) + replacement + text.slice(end + offset);
            return output;
          }
          /**
           * @name CompilerV6.prototype._compileTokens
           * @type
           * @description
           */
          async _compileTokens(compilationFile, compilationProcess) {
            this._traceIn("_compileTokens", arguments);
            const {
              resource,
              source,
              tokenization: { formatted: tokens },
            } = compilationFile;
            const _tokenCompilationSwitcher = {
              "Inject Source": this._compileAsInjectSource,
              "Inject String": this._compileAsInjectString,
              "Inject Template": this._compileAsInjectTemplate,
              "Inject Module": this._compileAsInjectModule,
              "Multiline Comment Code Injection":
                this._compileAsMultilineCommentCodeInjection,
              "Multiline Comment Value Injection":
                this._compileAsMultilineCommentValueInjection,
              "Moduler Import": this._compileAsModulerImport,
              "Moduler Export": this._compileAsModulerExport,
              "@Requires": this._compileAsRequires,
              "@Injects": this._compileAsInjects,
              "Javadoc Comment": this._compileAsJavadocComment,
              // Sections:
              "Moduler Section Get": this._compileAsModulerSectionGet,
              "Moduler Section Set": this._compileAsModulerSectionSet,
              "Moduler Section Delete": this._compileAsModulerSectionDelete,
              "Moduler Section Overwrite":
                this._compileAsModulerSectionOverwrite,
              "Moduler Section Fill": this._compileAsModulerSectionFill,
              "Moduler Section Expand": this._compileAsModulerSectionExpand,
              // Markdown comments:
              "Multiline Markdown Comment":
                this._compileAsMultilineMarkdownComment,
              "New Paragraph Markdown Comment":
                this._compileAsNewParagraphMarkdownComment,
              "New Line Markdown Comment":
                this._compileAsNewLineMarkdownComment,
              "Precised Tabulation Markdown Comment":
                this._compileAsPrecisedTabulationMarkdownComment,
              "Increased Tabulation Markdown Comment":
                this._compileAsIncreasedTabulationMarkdownComment,
              "Decreased Tabulation Markdown Comment":
                this._compileAsDecreasedTabulationMarkdownComment,
              "Inline Markdown Comment": this._compileAsInlineMarkdownComment,
              "Unspaced Inline Markdown Comment":
                this._compileAsUnspacedInlineMarkdownComment,
            };
            const state = {};
            Iterating_tokens_backwardly: for (
              let tokenIndex = tokens.length - 1;
              tokenIndex >= 0;
              tokenIndex--
            ) {
              const token = tokens[tokenIndex];
              Aplicar_logica_de_compilacion_backward_segun_token: {
                this.assert(
                  token.syntax in _tokenCompilationSwitcher,
                  `Syntax not identified «${token.syntax}»`,
                );
                const methodCallback = _tokenCompilationSwitcher[token.syntax];
                await methodCallback.call(
                  this,
                  compilationFile,
                  compilationProcess,
                  { token, tokenIndex, state },
                );
              }
            }
            Unify_markdown: {
              this._unifyCompilationMarkdown(
                compilationFile,
                compilationProcess,
              );
            }
            this._traceOut("_compileTokens", arguments);
            return compilationFile.compilation;
          }

          /**
           * @name CompilerV6.prototype._compileRecursively
           * @type private class method
           * @description  
           */
          async _compileRecursively(
            fileParameters = {},
            processParameters = {},
          ) {
            this._traceIn("_compileRecursively", arguments);
            this.assert(
              typeof fileParameters === "object",
              "Parameter «fileParameters» must be object on «CompilerV6.prototype._compileRecursively»",
            );
            this.assert(
              typeof fileParameters.resource === "string",
              "Parameter «fileParameters.resource» must be string on «CompilerV6.prototype._compileRecursively»",
            );
            this.assert(
              typeof processParameters === "object",
              "Parameter «processParameters» must be object on «CompilerV6.prototype._compileRecursively»",
            );
            let compilationFile, compilationProcess, subcompiler, output;
            Initialize_parameters: {
              compilationFile = this.constructor.CompilationFile.from(
                fileParameters,
                processParameters,
                this,
              );
              compilationProcess = this.constructor.CompilationProcess.from(
                fileParameters,
                processParameters,
                this,
              );
            }
            this.assert(
              processParameters.uncacheInjections ===
                compilationProcess.uncacheInjections,
              "Las inyecciones 1",
            );
            Add_entry_in_tree: {
              // compilationFile.resource = this.rootdirOf(compilationFile.resource);
              const id = this.rootdirOf(compilationFile.resource);
              compilationFile.report.tree[id] =
                compilationFile.report.tree[id] || {};
            }
            Update_md_title_indentation: {
              compilationFile.titleIndentation =
                compilationFile.parentCompilation?.titleIndentation || 0;
              if (compilationFile.resource.endsWith(".entry.js")) {
                compilationFile.titleIndentation++;
              }
            }
            Compile_inner_files_recursively_with_subcompiler: {
              subcompiler = this._cloneForFile(compilationFile.resource, this);
              compilationFile.subcompiler = subcompiler;
              await subcompiler._fetchCompilable(
                compilationFile,
                compilationProcess,
              );
              await subcompiler._renderSourceAsTemplate(
                compilationFile,
                compilationProcess,
              );
              subcompiler._tokenizeText(compilationFile, compilationProcess);
              await subcompiler._compileTokens(
                compilationFile,
                compilationProcess,
              );
              output = subcompiler._getPreferredOutput(
                compilationFile,
                compilationProcess,
              );
            }
            Beautify_and_minify: {
              if (
                fileParameters.isRoot &&
                (processParameters.beautify || processParameters.minify) &&
                !this.isBrowser &&
                typeof output.js === "string"
              ) {
                const originalSize = this.constructor.getStringSize(output.js);
                if (processParameters.beautify) {
                  const startedAt = new Date();
                  const beautifiedCode = await this.constructor.beautifyJs(
                    output.js,
                  );
                  output.beautifiedJs = {
                    code: beautifiedCode,
                    chars: beautifiedCode.length,
                    originalSize: originalSize,
                    size: this.constructor.getStringSize(beautifiedCode),
                    sizeRelationOf:
                      (
                        (beautifiedCode.length / (output.js.length || 1)) *
                        100
                      ).toFixed(2) + "%",
                    time: ((new Date() - startedAt) / 1000).toFixed(3) + "s",
                  };
                }
                if (processParameters.minify) {
                  const startedAt = new Date();
                  const minifiedCode = (
                    await this.constructor.hardMinifyJs(output.js)
                  ).code;
                  output.minifiedJs = {
                    code: minifiedCode,
                    chars: minifiedCode.length,
                    originalSize: originalSize,
                    size: this.constructor.getStringSize(minifiedCode),
                    sizeRelationOf:
                      (
                        (minifiedCode.length / (output.js.length || 1)) *
                        100
                      ).toFixed(2) + "%",
                    time: ((new Date() - startedAt) / 1000).toFixed(3) + "s",
                  };
                }
              }
            }

            If_file_is_root: if (fileParameters.isRoot) {
              Bundle_as_CompilationResult: {
                output = new this.constructor.CompilationResult(output, this);
              }
              And_file_is_entry: if (
                compilationFile.resource.endsWith(".entry.js")
              ) {
                Generate_rels_json_file: {
                  const relsFile = this.normalizationOf(
                    this.rootdirOf(compilationFile.resource)
                      .replace(/^\@\/src\//g, "@/dist/")
                      .replace(/\.entry\.js$/g, ".rels.json"),
                  );
                  await this.files.writeFile.try(
                    relsFile,
                    JSON.stringify(compilationFile.report, null, 2),
                    "utf8",
                  );
                }
              }
            }
            this._traceOut("_compileRecursively", arguments);
            return output;
          }
          /**
           * @name CompilerV6.prototype._fetchCompilable
           * @type
           * @description
           */
          _fetchCompilable(compilationFile, compilationProcess) {
            this.assert(
              typeof compilationFile === "object",
              "Parameter «compilationFile» must be object on «CompilerV6.prototype._fetchCompilable»",
            );
            this.assert(
              typeof compilationFile.resource === "string",
              "Parameter «compilationFile.resource» must be string on «CompilerV6.prototype._fetchCompilable»",
            );
            // console.log(compilationFile.resource);
            if (compilationFile.resource.endsWith(".json")) {
              compilationFile.extension = "json";
              return this._readPath(compilationFile.resource).then((source) => {
                compilationFile.source = "";
                return (compilationFile.compilation.json = "");
              });
            }
            this.assert(
              /\.(js|css|md|html)$/g.test(compilationFile.resource),
              `Parameter «compilationFile.resource» now «${compilationFile.resource}» must match with valid extension on «CompilerV6.prototype._fetchCompilable»`,
            );
            Sacar_la_extension_del_fichero: {
              compilationFile.extension = compilationFile.resource
                .match(/\.(js|css|md|html)$/g)[0]
                .substr(1);
            }
            Propagar_la_extension_al_proceso_si_es_la_primera: {
              if (typeof compilationProcess.extension === "undefined") {
                compilationProcess.extension = compilationFile.extension;
              }
            }
            Bloquear_imports_segun_extension_de_compilable_original: {
              if (compilationProcess.extension === "js") {
                // @OK, con js todo.
              } else if (compilationProcess.extension === "css") {
                this.assert(
                  compilationFile.extension !== "js",
                  `From a «css» file «${compilationProcess.resource}» cannot inject «js» file «${compilationFile.resource}»`,
                );
              } else if (compilationProcess.extension === "md") {
                this.assert(
                  compilationFile.extension !== "js",
                  `From an «md» file «${compilationProcess.resource}» cannot inject «js» file «${compilationFile.resource}»`,
                );
                this.assert(
                  compilationFile.extension !== "css",
                  `From an «md» file «${compilationProcess.resource}» cannot inject «css» file «${compilationFile.resource}»`,
                );
              }
            }
            return this._readPath(compilationFile.resource).then((source) => {
              compilationFile.source = source;
              return (compilationFile.compilation[compilationFile.extension] =
                source);
            });
          }
          /**
           * @name CompilerV6.prototype._tryToReadFile
           * @type
           * @description
           */
          _tryToReadFile(file, altContent = undefined) {
            return require("fs")
              .promises.readFile(file, "utf8")
              .catch((err) => altContent);
          }
          /**
           * @name CompilerV6.prototype._prependToParentCompilationFile
           * @type
           * @description
           */
          _prependToParentCompilationFile(
            compilationFile,
            content,
            extension = "md",
            betterAppend = false,
          ) {
            const method = betterAppend ? "unshift" : "push";
            /*
  const mdItemMetadata = typeof content === "object" ? {
    ...content,
    titleIndentation: content.titleIndentation || compilationFile.titleIndentation,
  } : content;
  //*/
            let mdItemMetadata = content;
            Set_title_indentation: {
              if (typeof content === "object") {
                if (!("titleIndentation" in content)) {
                  content.titleIndentation = compilationFile.titleIndentation;
                }
              }
            }
            compilationFile.mdUnification[method](mdItemMetadata);
            // @RECURSIVIDAD: sí, es recursivo esto, no está muy bien, pero tú, si tira, ha tirao!
            // if (compilationFile.parentCompilation) {
            //   this._prependToParentCompilationFile(compilationFile.parentCompilation, content, extension, betterAppend);
            // }
            //
            return;
            // @ANTES:
            // if (compilationFile.parentCompilation) {
            //     compilationFile.parentCompilation.compilation[extension] = content + compilationFile.parentCompilation.compilation[extension];
            // }
            // compilationFile.compilation[extension] = content + compilationFile.compilation[extension];
          }

          /**
           * @name CompilerV6.prototype._compileAsModulerSectionGet
           * @type
           * @description
           */
          _compileAsModulerSectionGet(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsModulerSectionGet", arguments);
              return false;
            }
          }
          /**
           * @name CompilerV6.prototype._compileAsModulerSectionSet
           * @type
           * @description
           */
          _compileAsModulerSectionSet(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsModulerSectionSet", arguments);
              return false;
            }
          }
          /**
           * @name CompilerV6.prototype._compileAsModulerSectionDelete
           * @type
           * @description
           */
          _compileAsModulerSectionDelete(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsModulerSectionDelete", arguments);
              return false;
            }
          }
          /**
           * @name CompilerV6.prototype._compileAsModulerSectionExpand
           * @type
           * @description
           */
          _compileAsModulerSectionExpand(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsModulerSectionExpand", arguments);
              return false;
            }
          }
          /**
           * @name CompilerV6.prototype._compileAsModulerSectionOverwrite
           * @type
           * @description
           */
          _compileAsModulerSectionOverwrite(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsModulerSectionOverwrite", arguments);
              return false;
            }
          }
          /**
           * @name CompilerV6.prototype._compileAsModulerSectionFill
           * @type
           * @description
           */
          _compileAsModulerSectionFill(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsModulerSectionFill", arguments);
              return false;
            }
          }

          /**
           * @name CompilerV6.prototype._compileAsInjectSource
           * @type
           * @description
           */
          async _compileAsInjectSource(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
            options = {},
          ) {
            this._traceIn("_compileAsInjectSource", arguments);
            let parameters,
              targetPath,
              targetCompilation,
              targetCaches = {};
            const currentStep = [];
            try {
              const { tokenization, source, resource, isRoot } =
                compilationFile;
              Evaluate_parameters: {
                currentStep.push("1. evaluate parameters");
                parameters = await this._getDataForTokenCompilation({
                  compilationFile,
                  compilationProcess,
                  token,
                  tokenIndex,
                });
              }
              Extend_token: {
                currentStep.push("2. extend token");
                this._extendToken(token, ["referenceOf"]);
              }
              Extract_target_path: {
                currentStep.push("3. extract target path");
                this.assert(
                  token.referenceOf.fullpath === this.fullpathOf(parameters[0]),
                  "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectSource»",
                );
                targetPath = token.referenceOf.fullpath;
              }
              Compile_target: {
                currentStep.push("4. compile target");
                Use_processedEntries_cache_if_possible: {
                  if (
                    compilationProcess.to === "data" ||
                    compilationProcess.uncacheInjections
                  ) {
                    break Use_processedEntries_cache_if_possible;
                  }
                  if (
                    Object.keys(compilationProcess.processedEntries).length &&
                    targetPath in compilationProcess.processedEntries
                  ) {
                    currentStep.push("4.a. get compiled source from cache");
                    const previousCache =
                      compilationProcess.processedEntries[targetPath];
                    targetCaches.js = await require("fs").promises.readFile(
                      previousCache.distJs,
                      "utf8",
                    );
                    if (previousCache.distCss)
                      targetCaches.css = await this._tryToReadFile(
                        previousCache.distCss,
                        null,
                      );
                    if (previousCache.distMd)
                      targetCaches.md = await this._tryToReadFile(
                        previousCache.distMd,
                        null,
                      );
                    break Compile_target;
                  }
                }
                currentStep.push("4.b. compiled target newly");
                Create_file_unless_it_exists_or_option_dontCreateOnInjectSource_is_true: {
                  if (!compilationProcess.dontCreateOnInjectSource) {
                    const existsFile = await this._existsFile(targetPath);
                    if (!existsFile) {
                      currentStep.push(
                        "4.b.1. create injected file as it does not exist",
                      );
                      const path = require("path");
                      const targetId = this.rootdirOf(targetPath).replace(
                        /\.(js|css|html)$/g,
                        "",
                      );
                      await this._createDefaultInjectedFile(
                        targetPath,
                        targetId,
                      );
                    }
                  }
                }
                Make_compilation_finally: {
                  currentStep.push("4.b.2. compile target recursively");
                  targetCompilation = await this._compileRecursively(
                    {
                      resource: targetPath,
                      isRoot: false,
                      parentCompilation: compilationFile, // compilationFile.parentCompilation || compilationFile,,
                    },
                    compilationProcess,
                  );
                }
              }
              Inject_in_compilation_text: {
                currentStep.push("5. inject text in compilation");
                const isFromHtml = compilationFile.extension === "html";
                if (isFromHtml) {
                  currentStep.push("5.a. from html");
                  const targetIsJs = targetPath.endsWith(".js");
                  const targetIsCss = targetPath.endsWith(".css");
                  this.assert(
                    targetIsJs || targetIsCss,
                    `Syntax of «$compiler.inject.source» from html files can only inject «js,css» files and not when importing «${targetPath}» from «${compilationFile.resource}»`,
                  );
                  if (typeof targetCaches.js !== "string")
                    targetCaches.js = targetCompilation.js;
                  targetCaches.css = targetCaches.css || targetCompilation?.css;
                  targetCaches.md = targetCaches.md || targetCompilation?.md;
                  let newContent = targetCompilation[targetIsJs ? "js" : "css"];
                  Escape_html_tags_in_this_case: {
                    if (targetIsJs)
                      newContent = newContent.replace(
                        /(\< *)\/( *script *\>)/gi,
                        (match, g1, g2) => `${g1}\\/${g2}`,
                      );
                    if (targetIsCss)
                      newContent = newContent.replace(
                        /(\< *)\/( *style *\>)/gi,
                        (match, g1, g2) => `${g1}\\/${g2}`,
                      );
                  }
                  compilationFile.compilation.html = this._replaceTextRange(
                    compilationFile.compilation.html,
                    token.location[0],
                    token.location[1],
                    newContent,
                    token,
                  );
                } else {
                  currentStep.push("5.a. from js");
                  this.assert(
                    compilationFile.extension === "js",
                    `Syntax of «$compiler.inject.source» can only inject files from «js,html» files and not on «${compilationFile.extension}» when importing «${targetPath}» from «${compilationFile.resource}»`,
                  );
                  this.assert(
                    targetPath.endsWith(".js"),
                    `Syntax of «$compiler.inject.source» is trying to import foraneous extension format file «${targetPath}» from «${compilationFile.resource}» on «CompilerV6.prototype._compileAsInjectSource»`,
                  );
                  // if (!targetCaches.js) targetCaches.js = targetCompilation?.js || "";
                  if (typeof targetCaches.js !== "string")
                    targetCaches.js = targetCompilation.js;
                  targetCaches.css = targetCaches.css || targetCompilation?.css;
                  targetCaches.md = targetCaches.md || targetCompilation?.md;
                  let outputJs = targetCaches.js;
                  if (options?.modifySource) {
                    outputJs = options.modifySource(outputJs);
                  }
                  compilationFile.compilation.js = this._replaceTextRange(
                    compilationFile.compilation.js,
                    token.location[0],
                    token.location[1],
                    outputJs,
                    token,
                  );
                }
                Esto_tiene_que_hacerse_desde_dentro_del_compileRecursively: {
                  // compilationFile.compilation.css += targetCaches.css;
                  // compilationFile.compilation.md += targetCaches.md;
                }
              }
              Inject_in_report_object: {
                if (compilationProcess.to !== "data") {
                  // break Inject_in_report_object;
                }
                if (!compilationFile?.report?.tree || !targetCompilation) {
                  break Inject_in_report_object;
                }
                currentStep.push("6. report tree of tokens");
                this._reportFileToken(compilationFile, targetPath, token);
                Object.assign(
                  compilationFile.report.tree,
                  targetCompilation.report.tree,
                );
              }
              this._traceOut("_compileAsInjectSource", arguments);
            } catch (error) {
              console.log(
                `[!] Error on method «_compileAsInjectSource» on root «${this.rootdir}» on resource «${this.rootdirOf(compilationFile.resource)}» and target «${this.rootdirOf(targetPath || "?")}» on step «${currentStep.reverse().join(" < ")}»`,
                error,
              );
              throw error;
            }
          }
          /**
           * @name CompilerV6.prototype._compileAsInjectString
           * @type
           * @description
           */
          async _compileAsInjectString(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            this._traceIn("_compileAsInjectString", arguments);
            let parameters, targetPath, fileContent;
            const { tokenization, source, resource, isRoot } = compilationFile;
            Evaluate_parameters: {
              parameters = await this._getDataForTokenCompilation({
                compilationFile,
                compilationProcess,
                token,
                tokenIndex,
              });
            }
            Extend_token: {
              this._extendToken(token, ["referenceOf"]);
            }
            Extract_target_path: {
              this.assert(
                token.referenceOf.fullpath === this.fullpathOf(parameters[0]),
                "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectString»",
              );
              targetPath = token.referenceOf.fullpath;
            }
            Compile_target: {
              fileContent = await this._readPath(targetPath);
            }
            Inject_in_compilation_text: {
              if (compilationFile.extension !== "js") {
                break Inject_in_compilation_text;
              }
              compilationFile.compilation.js = this._replaceTextRange(
                compilationFile.compilation.js,
                token.location[0],
                token.location[1],
                this._getStringForDevelopment(fileContent),
              );
            }
            Inject_in_report_object: {
              if (compilationProcess.to !== "data") {
                break Inject_in_report_object;
              }
              this._reportFileToken(compilationFile, targetPath, token);
              Object.assign(
                compilationFile.report.tree,
                targetCompilation.report.tree,
              );
            }
            this._traceOut("_compileAsInjectString", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsInjectTemplate
           * @type
           * @description
           */
          async _compileAsInjectTemplate(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            this._traceIn("_compileAsInjectTemplate", arguments);
            let parameters, targetPath, fileContent;
            const { tokenization, source, resource, isRoot } = compilationFile;
            Evaluate_parameters: {
              parameters = await this._getDataForTokenCompilation({
                compilationFile,
                compilationProcess,
                token,
                tokenIndex,
              });
            }
            Extend_token: {
              this._extendToken(token, ["referenceOf"]);
            }
            Extract_target_path: {
              this.assert(
                token.referenceOf.fullpath === this.fullpathOf(parameters[0]),
                "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectTemplate»",
              );
              targetPath = token.referenceOf.fullpath;
            }
            Compile_target: {
              fileContent = await this._readPath(targetPath);
            }
            Inject_in_compilation_text: {
              if (compilationFile.extension !== "js") {
                break Inject_in_compilation_text;
              }
              const templateOutput = await this._renderTemplate(fileContent, {
                __filename: targetPath,
                __dirname: require("path").dirname(targetPath),
                ...(parameters[1] || {}),
              });
              compilationFile.compilation.js = this._replaceTextRange(
                compilationFile.compilation.js,
                token.location[0],
                token.location[1],
                templateOutput,
              );
            }
            Inject_in_report_object: {
              if (compilationProcess.to !== "data") {
                break Inject_in_report_object;
              }
              this._reportFileToken(compilationFile, targetPath, token);
              Object.assign(
                compilationFile.report.tree,
                targetCompilation.report.tree,
              );
            }
            this._traceOut("_compileAsInjectTemplate", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsInjectModule
           * @type
           * @description
           */
          _compileAsInjectModule(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            return this._compileAsInjectSource(
              compilationFile,
              compilationProcess,
              { token, tokenIndex },
              {
                modifySource: function (source) {
                  return [
                    `(() => {`,
                    `let __firstHolder = {};`,
                    `let __originalHolder = __firstHolder;`,
                    `const module = {`,
                    `  get exports() {`,
                    `    return __originalHolder;`,
                    `  },`,
                    `  set exports(value) {`,
                    `    __originalHolder = value;`,
                    `  }`,
                    `};`,
                    `const exports = module.exports;`,
                    `const __result = (() => {`,
                    source,
                    `})();`,
                    `let __output = undefined;`,
                    `const __returnsUndefined = () => typeof __result === "undefined";`,
                    `const __isSameEmptyObject = () => (module.exports === __firstHolder) && ((Object.keys(__firstHolder).length === 0));`,
                    `if(!__returnsUndefined()) {`,
                    `  __output = module.exports = __result;`,
                    `} else if(!__isSameEmptyObject()) {`,
                    `  __output = module.exports;`,
                    `}`,
                    `return __output;`,
                    `})()`,
                  ].join("\n");
                },
              },
            );
          }
          /**
           * @name CompilerV6.prototype._compileAsMultilineCommentCodeInjection
           * @type
           * @description
           */
          _compileAsMultilineCommentCodeInjection() {
            this._trace("_compileAsMultilineCommentCodeInjection", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsMultilineCommentValueInjection
           * @type
           * @description
           */
          _compileAsMultilineCommentValueInjection() {
            this._trace("_compileAsMultilineCommentValueInjection", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsModulerImport
           * @type
           * @description
           */
          async _compileAsModulerImport(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsModulerImport", arguments);
              // return false;
            }
            this._traceIn("_compileAsModulerImport", arguments);
            let parameters,
              namedParameters = {},
              targetPaths = [];
            const { tokenization, source, resource, isRoot, subcompiler } =
              compilationFile;
            Evaluate_parameters: {
              parameters = await this._getDataForTokenCompilation(
                {
                  compilationFile,
                  compilationProcess,
                  token,
                  tokenIndex,
                },
                {
                  onError(error) {
                    return error;
                  },
                },
              );
            }
            if (parameters instanceof Error) {
              Handle_errors_evaluating_parameters: {
                // @OK: no compilation or path guessing if parameters can not be evaluated
                console.error(
                  `The load of inner parameters of token type «$moduler.import» on file «${compilationFile.resource}» could not be retrieved maybe because of runtime code that cannot be solved on compilation-time on «ModulerV6.prototype._compileAsModulerImport»`,
                );
                console.error(parameters);
              }
            } else {
              Extract_targets_path: {
                namedParameters = this.moduler._formatImportParameters(
                  parameters,
                  compilationFile.resource,
                );
                // @CAUTION: esta línea está en experimental, pero debería ser así
                targetPaths = (
                  namedParameters.file ? [namedParameters.file] : []
                ).concat(namedParameters.dependencies);
              }
              Extend_token: {
                token.dependenciesOf = targetPaths;
              }
              Compile_all_targets: {
                for (
                  let indexTarget = 0;
                  indexTarget < targetPaths.length;
                  indexTarget++
                ) {
                  const targetPath = targetPaths[indexTarget];
                  const targetCompilation =
                    await subcompiler._compileRecursively(
                      {
                        resource: subcompiler.fullpathOf(targetPath),
                        isRoot: false,
                        parentCompilation: compilationFile, // compilationFile.parentCompilation || compilationFile,,
                      },
                      compilationProcess,
                    );
                  Inject_in_compilation_text: {
                    // @OK: no code injection on moduler.import
                  }
                  Inject_in_report_object: {
                    this._reportFileToken(compilationFile, targetPath, token);
                    Object.assign(
                      compilationFile.report.tree,
                      targetCompilation.report.tree,
                    );
                  }
                }
              }
            }
            this._traceOut("_compileAsModulerImport", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsModulerExport
           * @type
           * @description
           */
          async _compileAsModulerExport(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsModulerExport", arguments);
              // return false;
            }
            // @ATENCIÓN: lo que ocurre en el to:data es horrible, porque... (ves al Compile_all_targets):
            this._traceIn("_compileAsModulerExport", arguments);
            let parameters,
              namedParameters = {},
              targetPaths = [];
            const { tokenization, source, resource, isRoot, subcompiler } =
              compilationFile;
            Evaluate_parameters: {
              parameters = await this._getDataForTokenCompilation(
                {
                  compilationFile,
                  compilationProcess,
                  token,
                  tokenIndex,
                },
                {
                  onError(error) {
                    return error;
                  },
                },
              );
            }
            if (parameters instanceof Error) {
              Handle_errors_evaluating_parameters: {
                // @OK: no compilation or path guessing if parameters can not be evaluated
                console.error(
                  `The load of inner parameters of token type «$moduler.export» on file «${compilationFile.resource}» could not be retrieved maybe because of runtime code that cannot be solved on compilation-time on «ModulerV6.prototype._compileAsModulerExport»`,
                );
                console.error(parameters);
              }
            } else {
              Extract_targets_path: {
                namedParameters = this.moduler._formatExportParameters(
                  parameters,
                  compilationFile.resource,
                );
                targetPaths = (
                  namedParameters.file ? [namedParameters.file] : []
                ).concat(namedParameters.dependencies);
              }
              Extend_token: {
                token.dependenciesOf = targetPaths;
              }
              Compile_all_targets: {
                // @ATENCIÓN: porque en este bucle, compilas recursivamente los módulos apuntados por import y export, en cada caso
                for (
                  let indexTarget = 0;
                  indexTarget < targetPaths.length;
                  indexTarget++
                ) {
                  const targetPath = targetPaths[indexTarget];
                  const targetCompilation =
                    await subcompiler._compileRecursively(
                      {
                        resource: subcompiler.fullpathOf(targetPath),
                        isRoot: false,
                        parentCompilation: compilationFile, // compilationFile.parentCompilation || compilationFile,,
                      },
                      compilationProcess,
                    );
                  Inject_in_compilation_text: {
                    // @OK: no code injection on moduler.export
                  }
                  Inject_in_report_object: {
                    this._reportFileToken(compilationFile, targetPath, token);
                    Object.assign(
                      compilationFile.report.tree,
                      targetCompilation.report.tree,
                    );
                  }
                }
              }
            }
            this._traceOut("_compileAsModulerExport", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsRequires
           * @type
           * @description
           */
          async _compileAsRequires(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            if (compilationProcess.to !== "data") {
              this._trace("_compileAsRequires", arguments);
              return false;
            }
            this._traceIn("_compileAsRequires", arguments);
            let parameters, targetPath, targetCompilation;
            const { tokenization, source, resource, isRoot } = compilationFile;
            Evaluate_parameters: {
              parameters = await this._getDataForTokenCompilation({
                compilationFile,
                compilationProcess,
                token,
                tokenIndex,
              });
            }
            Extend_token: {
              this._extendToken(token, ["referenceOf"]);
            }
            Extract_target_path: {
              this.assert(
                token.referenceOf.fullpath === this.fullpathOf(parameters[0]),
                "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsRequires»",
              );
              targetPath = token.referenceOf.fullpath;
            }
            Compile_target: {
              targetCompilation = await this._compileRecursively(
                {
                  resource: targetPath,
                  isRoot: false,
                  parentCompilation: compilationFile, // compilationFile.parentCompilation || compilationFile,,
                },
                compilationProcess,
              );
            }
            Inject_in_compilation_text: {
              // @OK: nothing to add to the main sources, by @requires
            }
            Inject_in_report_object: {
              if (compilationProcess.to !== "data") {
                break Inject_in_report_object;
              }
              this._reportFileToken(compilationFile, targetPath, token);
              Object.assign(
                compilationFile.report.tree,
                targetCompilation.report.tree,
              );
            }
            this._traceOut("_compileAsRequires", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsInjects
           * @type
           * @description
           */
          async _compileAsInjects(
            compilationFile,
            compilationProcess,
            { token, tokenIndex },
          ) {
            this._traceIn("_compileAsInjects", arguments);
            let parameters,
              targetPath,
              targetCompilation,
              wasPrepended = false;
            const { tokenization, source, resource, isRoot } = compilationFile;
            Evaluate_parameters: {
              parameters = await this._getDataForTokenCompilation({
                compilationFile,
                compilationProcess,
                token,
                tokenIndex,
              });
            }
            Early_delegation_to_compileAsInjectSource: {
              const fromJs = compilationFile.resource?.endsWith(".js");
              if (!fromJs) break Early_delegation_to_compileAsInjectSource;
              const injectsJs = parameters[0].endsWith(".js");
              if (!injectsJs) break Early_delegation_to_compileAsInjectSource;
              return await this._compileAsInjectSource(
                compilationFile,
                compilationProcess,
                { token, tokenIndex },
              );
            }
            Extend_token: {
              this._extendToken(token, ["referenceOf"]);
            }
            Extract_target_path: {
              this.assert(
                token.referenceOf.fullpath === this.fullpathOf(parameters[0]),
                "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjects»",
              );
              targetPath = token.referenceOf.fullpath;
            }
            Compile_target: {
              targetCompilation = await this._compileRecursively(
                {
                  resource: targetPath,
                  isRoot: false,
                  parentCompilation: compilationFile, // compilationFile.parentCompilation || compilationFile,,
                },
                compilationProcess,
              );
            }
            Inject_in_compilation_text: {
              if (compilationFile.resource.endsWith(".js")) {
                // Cuando desde un JS se hace @injects...
                let replacement = "";
                if (targetPath.endsWith(".js")) {
                  // ...a un .js
                  // @CHATGPT: hablo de este caso exactamente. Tendría que poder hacer lo mismo que _compileAsInjectSource, pero antes estaba esto bloqueando porque era una feature confusa, ahora ya he visto que sí tiene sentido permitir una sintaxis de inyección de código mediante comentario y diferente a las sintaxis de plantillaje genéricas.
                  return this._compileAsInjectSource(...arguments);
                  throw new Error(
                    "Syntax of «@injects» should not be used to import «js» files from «js» files. Use another syntax instead, like «$v6.injects.source» or «commented template injection» on «CompilerV6.prototype._compileAsInjects»",
                  );
                } else if (targetPath.endsWith(".css")) {
                  // ...a un .css
                  compilationFile.compilation.css +=
                    "\n" + targetCompilation.css;
                } else if (targetPath.endsWith(".md")) {
                  // ...a un .md
                  // @OK
                } else {
                  // ...a otro formato
                  throw new Error(
                    `Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`,
                  );
                }
                compilationFile.compilation.js = this._replaceTextRange(
                  compilationFile.compilation.js,
                  token.location[0],
                  token.location[1],
                  replacement,
                );
              } else if (compilationFile.resource.endsWith(".css")) {
                let replacement = "";
                // Cuando desde un CSS se hace @injects...
                if (targetPath.endsWith(".js")) {
                  // ...a un .js
                  throw new Error(
                    "Syntax of «@injects» can't be used to import «js» files from «css» files. Use another syntax instead.",
                  );
                  replacement = targetCompilation.js;
                } else if (targetPath.endsWith(".css")) {
                  // ...a un .css
                  compilationFile.compilation.css +=
                    "\n" + targetCompilation.css;
                } else if (targetPath.endsWith(".md")) {
                  // ...a un .md
                  // @OK
                } else {
                  // ...a otro formato
                  throw new Error(
                    `Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`,
                  );
                }
                compilationFile.compilation.css = this._replaceTextRange(
                  compilationFile.compilation.css,
                  token.location[0],
                  token.location[1],
                  replacement,
                );
              } else if (compilationFile.resource.endsWith(".md")) {
                // Cuando desde un MD se hace @injects...
                let replacement = "";
                if (targetPath.endsWith(".js")) {
                  // ...a un .js
                  throw new Error(
                    "Syntax of «@injects» can't be used to import «js» files from «md» files. Use another syntax instead.",
                  );
                } else if (targetPath.endsWith(".css")) {
                  // ...a un .css
                  throw new Error(
                    "Syntax of «@injects» can't be used to import «css» files from «md» files. Use another syntax instead.",
                  );
                } else if (targetPath.endsWith(".md")) {
                  // ...a un .md
                  // @ANTES
                  // compilationFile.compilation.md = this._replaceTextRange(compilationFile.compilation.md, token.location[0], token.location[1]-1, "\n\n" + targetCompilation.md);
                  // @AHORA
                  this._prependToParentCompilationFile(
                    compilationFile,
                    {
                      prefix: "\n\n",
                      tabulation: 0,
                      body: this._replaceTextRange(
                        compilationFile.compilation.md,
                        token.location[0],
                        token.location[1] - 0,
                        targetCompilation.md,
                      ),
                    },
                    "md",
                    false,
                  );
                  wasPrepended = true;
                } else {
                  // ...a otro formato
                  throw new Error(
                    `Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`,
                  );
                }
              } else if (compilationFile.resource.endsWith(".html")) {
                if (targetPath.endsWith(".js")) {
                  return this._compileAsInjectSource(...arguments);
                } else if (targetPath.endsWith(".css")) {
                  return this._compileAsInjectSource(...arguments);
                } else {
                  throw new Error(
                    "Syntax of «@injects» can only be used to import «js,css» files from «html» files.",
                  );
                }
              } else {
                throw new Error(
                  `Syntax of «@injects» should only be available on «css,md» files and not on «${compilationFile.extension}»`,
                );
              }
            }
            Append_markdown: {
              if (!wasPrepended) {
                this._prependToParentCompilationFile(
                  compilationFile,
                  {
                    prefix: "\n\n",
                    tabulation: 0,
                    body: targetCompilation.md,
                  },
                  "md",
                  false,
                );
              }
            }
            Inject_in_report_object: {
              if (compilationProcess.to !== "data") {
                // break Inject_in_report_object;
              }
              if (!compilationFile?.report?.tree || !targetCompilation) {
                break Inject_in_report_object;
              }
              this._reportFileToken(compilationFile, targetPath, token);
              Object.assign(
                compilationFile.report.tree,
                targetCompilation.report.tree,
              );
            }
            this._traceOut("_compileAsInjects", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsJavadocComment
           * @type
           * @description
           */
          _compileAsJavadocComment() {
            this._trace("_compileAsJavadocComment", arguments);
          }
          /**
           * @name CompilerV6.prototype._compileAsMultilineMarkdownComment
           * @type
           * @description
           */
          async _compileAsMultilineMarkdownComment(
            compilationFile,
            compilationProcess,
            { token, tokenIndex, state },
          ) {
            let output = "";
            // output += "\n";
            // output += state.tabule(0);
            output += this._removeInitialSpace(token.inner)
              .split("\n")
              .map((line) => {
                return line.replace(/^[ \t]*\* ?/g, "");
              })
              .join("\n")
              .replace(/\n[\t ]*$/g, "");
            this._prependToParentCompilationFile(
              compilationFile,
              {
                prefix: "\n",
                tabulation: 0,
                body: output,
              },
              "md",
            );
          }
          /**
           * @name CompilerV6.prototype._compileAsNewParagraphMarkdownComment
           * @type
           * @description
           */
          async _compileAsNewParagraphMarkdownComment(
            compilationFile,
            compilationProcess,
            { token, tokenIndex, state },
          ) {
            let output = "";
            // output += "\n\n";
            // output += state.tabule(0);
            output += this._removeInitialSpace(token.inner);
            this._prependToParentCompilationFile(
              compilationFile,
              {
                prefix: "\n\n",
                tabulation: 0,
                body: output,
              },
              "md",
            );
          }
          /**
           * @name CompilerV6.prototype._compileAsNewLineMarkdownComment
           * @type
           * @description
           */
          async _compileAsNewLineMarkdownComment(
            compilationFile,
            compilationProcess,
            { token, tokenIndex, state },
          ) {
            let output = "";
            // output += "\n"
            // output += state.tabule(0);
            output += this._removeInitialSpace(token.inner);
            this._prependToParentCompilationFile(
              compilationFile,
              {
                prefix: "\n",
                tabulation: 0,
                body: output,
              },
              "md",
            );
          }
          /**
           * @name CompilerV6.prototype._compileAsPrecisedTabulationMarkdownComment
           * @type
           * @description
           */
          async _compileAsPrecisedTabulationMarkdownComment(
            compilationFile,
            compilationProcess,
            { token, tokenIndex, state },
          ) {
            const precisionMatch = token.inner.match(/^[0-9]+/g);
            const precisionText = precisionMatch[0];
            const precisionNumber = parseInt(precisionText);
            const innerText = token.inner.substr(precisionText.length + 1);
            if (!innerText.trim()) {
              this._prependToParentCompilationFile(
                compilationFile,
                {
                  prefix: "",
                  tabulation: "." + precisionNumber,
                  body: "",
                },
                "md",
              );
            } else {
              let output = "";
              output += this._removeInitialSpace(innerText);
              this._prependToParentCompilationFile(
                compilationFile,
                {
                  prefix: "\n",
                  tabulation: "." + precisionNumber,
                  body: output,
                },
                "md",
              );
            }
          }
          /**
           * @name CompilerV6.prototype._compileAsIncreasedTabulationMarkdownComment
           * @type
           * @description
           */
          async _compileAsIncreasedTabulationMarkdownComment(
            compilationFile,
            compilationProcess,
            { token, tokenIndex, state },
          ) {
            const increasionMatch = token.inner.match(/^(\+)+/g);
            const increasionText = (increasionMatch || [""])[0];
            const increasionNumber = increasionText.length + 1;
            let output = "";
            // output += state.tabule(increasionNumber);
            output += this._removeInitialSpace(
              token.inner.substr(increasionNumber + 1),
            );
            this._prependToParentCompilationFile(
              compilationFile,
              {
                prefix: "\n",
                tabulation: 1,
                body: output,
              },
              "md",
            );
          }
          /**
           * @name CompilerV6.prototype._compileAsDecreasedTabulationMarkdownComment
           * @type
           * @description
           */
          async _compileAsDecreasedTabulationMarkdownComment(
            compilationFile,
            compilationProcess,
            { token, tokenIndex, state },
          ) {
            const decreasionMatch = token.inner.match(/^(\-)+/g);
            const decreasionText = (decreasionMatch || [""])[0];
            const decreasionNumber = decreasionText.length + 1;
            let output = "";
            // output += state.tabule(-1*decreasionNumber);
            output += this._removeInitialSpace(
              token.inner.substr(decreasionNumber + 1),
            );
            this._prependToParentCompilationFile(
              compilationFile,
              {
                prefix: "\n",
                tabulation: -1,
                body: output,
              },
              "md",
            );
          }
          /**
           * @name CompilerV6.prototype._compileAsInlineMarkdownComment
           * @type
           * @description
           */
          async _compileAsInlineMarkdownComment(
            compilationFile,
            compilationProcess,
            { token, tokenIndex, state },
          ) {
            let output = " ";
            output += this._removeInitialSpace(token.inner);
            this._prependToParentCompilationFile(
              compilationFile,
              {
                prefix: " ",
                tabulation: 0,
                body: output,
              },
              "md",
            );
          }
          /**
           * @name CompilerV6.prototype._compileAsUnspacedInlineMarkdownComment
           * @type
           * @description
           */
          async _compileAsUnspacedInlineMarkdownComment(
            compilationFile,
            compilationProcess,
            { token, tokenIndex, state },
          ) {
            let output = "";
            output += this._removeInitialSpace(token.inner);
            this._prependToParentCompilationFile(
              compilationFile,
              {
                prefix: "",
                tabulation: 0,
                body: output,
              },
              "md",
            );
          }
          /**
           * @name CompilerV6.prototype._extractMarkdownTableOfContents
           * @type
           * @description
           */
          _extractMarkdownTableOfContents(text, asMarkdown = false) {
            const entries = [];
            const slugCounters = {};
            const lines = text.split(/\r?\n/);

            let insideCodeBlock = false;

            for (const line of lines) {
              if (/^\s*```/.test(line)) {
                insideCodeBlock = !insideCodeBlock;
                continue;
              }

              if (insideCodeBlock) {
                continue;
              }

              const match = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/);

              if (!match) {
                continue;
              }

              const level = match[1].length - 1;
              const title = match[2].trim();

              let slug = title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/<[^>]*>/g, "")
                .replace(/[`*_~]/g, "")
                .replace(/[^\w\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");

              if (slugCounters[slug] === undefined) {
                slugCounters[slug] = 0;
              } else {
                slugCounters[slug]++;
                slug += "-" + slugCounters[slug];
              }

              entries.push({
                level,
                title,
                slug,
              });
            }

            if (!asMarkdown) {
              return entries;
            }

            const minLevel = entries.length
              ? Math.min(...entries.map((it) => it.level))
              : 0;

            return entries
              .map((it) => {
                return `${"  ".repeat(Math.max(0, it.level - minLevel))}- ${this._toMarkdownLink(it.title)}`;
              })
              .join("\n");
          }
          /**
           * @name CompilerV6.prototype._extractMarkdownRelations
           * @type
           * @description
           */
          _extractMarkdownRelations(compilationFile) {
            let output = "";
            const input = compilationFile.report.tree;
            const files = Object.keys(input);
            for (let indexFile = 0; indexFile < files.length; indexFile++) {
              const fileId = files[indexFile];
              const file = input[fileId];
              const tokens = Object.keys(file);
              output += `- **${fileId}**`;
              output += !tokens.length
                ? " *free*\n"
                : ` uses **${tokens.length} files**\n`;
              let counter = 0;
              for (
                let indexToken = 0;
                indexToken < tokens.length;
                indexToken++
              ) {
                const tokenId = tokens[indexToken];
                const token = file[tokenId];
                const bestId = (() => {
                  if (!token.referenceOf?.rootpath) {
                    return token.inner;
                  } else {
                    return token.referenceOf.rootpath;
                  }
                })();
                output += `  ${++counter}. *${bestId}* with **${token.syntax}**\n`;
              }
            }
            return output;
          }
          /**
           * @name CompilerV6.prototype._toMarkdownLink
           * @type
           * @description
           */
          _toMarkdownLink(title) {
            const slug = title
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/<[^>]*>/g, "")
              .replace(/[`*_~]/g, "")
              .replace(/[^\w\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-");
            return `[${title}](#${slug})`;
          }

          /**
           * @name CompilerV6.prototype._initializeLogger
           * @type
           * @description
           */
          _initializeLogger(directory) {
            this._trace("_initializeLogger", arguments);
            return (this._logger =
              this.constructor.Logger.Manager.fromDirectory(directory, this));
          }
          /**
           * @name CompilerV6.prototype._reportFileToken
           * @type
           * @description
           */
          _reportFileToken(compilationFile, targetBrute, token) {
            this._traceIn("_reportFileToken", arguments);
            const owner = this.rootdirOf(compilationFile.resource);
            const target = this.rootdirOf(targetBrute);
            if (!(owner in compilationFile.report.tree)) {
              compilationFile.report.tree[owner] = {};
            }
            const reportedToken = this._cloneStructureAsJson(token);
            delete reportedToken.location;
            compilationFile.report.tree[owner][token.location.join("-")] =
              reportedToken;
            this._traceOut("_reportFileToken", arguments);
          }
          /**
           * @name CompilerV6.prototype._getPreferredOutput
           * @type
           * @description
           */
          _getPreferredOutput(compilationFile, compilationProcess) {
            this._trace("_getPreferredOutput", arguments);
            return {
              file: compilationFile.resource,
              report: compilationFile.report || false, // @ANTES: compilationProcess.to === "data" ? compilationFile.report : false,
              ...compilationFile.compilation,
            };
          }
          /**
           * @name CompilerV6.prototype._hydrateParameters
           * @type
           * @description
           */
          _hydrateParameters(parametersSource) {
            this._trace("_hydrateParameters", arguments);
            // @ATTENTION: Diu-a-fondiskiuts
            return new Function(`return [${parametersSource}]`).call();
          }
          /**
           * @name CompilerV6.prototype._cloneForFile
           * @type
           * @description
           */
          _cloneForFile(resource, compiler = false) {
            this._traceIn("_cloneForFile", arguments);
            this.assert(
              typeof resource === "string",
              "Parameter «resource» must be string on «CompilerV6.prototype._cloneForFile»",
            );
            this.assert(
              typeof this.basedir === "string",
              "Property «this.basedir» must be string on «CompilerV6.prototype._cloneForFile»",
            );
            const dirpath = require("path").dirname(this.fullpathOf(resource));
            const clone = new this.constructor(dirpath, compiler || this);
            this._traceOut("_cloneForFile", arguments);
            return clone;
          }
          /**
           * @name CompilerV6.prototype._cloneStructureAsJson
           * @type
           * @description
           */
          _cloneStructureAsJson(data) {
            return JSON.parse(JSON.stringify(data));
          }
          /**
           * @name CompilerV6.prototype._extendToken
           * @type
           * @description
           */
          _extendToken(token, fields = [], submoduler = false) {
            this._trace("_extendToken", arguments);
            return Object.assign(
              token,
              !fields.includes("referenceOf")
                ? {}
                : {
                    referenceOf: (() => {
                      const entry = this._hydrateParameters(token.inner)[0];
                      const fullpath = this.fullpathOf(entry);
                      const rootpath = this.rootdirOf(fullpath);
                      return { type: "file", entry, fullpath, rootpath };
                    })(),
                  },
            );
          }
          /**
           * @name CompilerV6.prototype._getDataForTokenCompilation
           * @type
           * @description
           */
          async _getDataForTokenCompilation(input, options = {}) {
            this._traceIn("_getDataForTokenCompilation", arguments);
            this.assert(
              typeof input === "object",
              "Parameter «input» must be object on «CompilerV6.prototype._getDataForTokenCompilation»",
            );
            // this.assert(typeof input.compilationFile === "object", "Parameter «input.compilationFile» must be object on «CompilerV6.prototype._getDataForTokenCompilation»");
            // this.assert(typeof input.compilationFile.resource === "string", "Parameter «input.compilationFile.resource» must be string on «CompilerV6.prototype._getDataForTokenCompilation»");
            // this.assert(typeof input.compilationProcess === "object", "Parameter «input.compilationProcess» must be object on «CompilerV6.prototype._getDataForTokenCompilation»");
            this.assert(
              typeof input.token === "object",
              "Parameter «input.token» must be object on «CompilerV6.prototype._getDataForTokenCompilation»",
            );
            this.assert(
              typeof input.token.inner === "string",
              "Parameter «input.token.inner» must be string on «CompilerV6.prototype._getDataForTokenCompilation»",
            );
            // this.assert(typeof input.tokenIndex === "number", "Parameter «input.tokenIndex» must be number on «CompilerV6.prototype._getDataForTokenCompilation»");
            let output,
              parameters = undefined;
            if (typeof options.onError === "function") {
              try {
                parameters = this._hydrateParameters(input.token.inner);
                Checks: {
                  this.assert(
                    Array.isArray(parameters),
                    `Parameters of injection must be an array in «${input.token.inner}» extracting parameters from resource «${input.resource}» on «CompilerV6.prototype._getDataForTokenCompilation»`,
                  );
                }
                output = parameters;
              } catch (error) {
                output = options.onError(error, parameters);
              }
            } else {
              parameters = this._hydrateParameters(input.token.inner);
              Checks: {
                this.assert(
                  Array.isArray(parameters),
                  `Parameters of injection must be an array in «${input.token.inner}» on «CompilerV6.prototype._getDataForTokenCompilation»`,
                );
              }
              output = parameters;
            }
            this._traceOut("_getDataForTokenCompilation", arguments);
            return output;
          }
          /**
           * @name CompilerV6.prototype._getStringForDevelopment
           * @type
           * @description
           */
          _getStringForDevelopment(text, tab = 0) {
            this._trace("_getStringForDevelopment", arguments);
            return text
              .split("\n")
              .map((line) => JSON.stringify(line))
              .join("\n + ");
          }
          /**
           * @name CompilerV6.prototype._existsFile
           * @type
           * @description
           */
          _existsFile(file) {
            const fullpathFile = this.normalizationOf(file);
            return require("fs")
              .promises.readFile(fullpathFile)
              .then((out) => true)
              .catch((err) => false);
          }

          /**
           * @name CompilerV6.prototype._createDefaultInjectedFile
           * @type
           * @description
           */
          _createDefaultInjectedFile(file, targetId) {
            const path = require("path");
            const filename = path.basename(file).replace(/\.js$/g, "");
            let name,
              targetType,
              targetIsClass = false,
              targetRootdir;
            targetType = "any";
            targetRootdir = this.rootdirOf(file);
            name = (() => {
              const isPrototype = filename.startsWith("prototype.");
              const isStatic = filename.startsWith("static.");
              const isClass = filename.endsWith(".class");
              const isAsync = filename.match(
                /(^async\.)|(\.async\.)|(\.async$)/g,
              );
              const isSync = filename.match(/(^sync\.)|(\.sync\.)|(\.sync$)/g);
              const isConstructor = filename === "constructor";
              const isOnlyClass = isClass && !isPrototype && !isStatic;
              const fileId = filename
                .replace(/^(prototype|static)\./g, "")
                .replace(/^a?sync\./g, "")
                .replace(/\.a?sync$/g, "")
                .replace(/\.class$/g, "");
              const isJsFriendly = fileId.match(/^[A-Za-z_$][A-Za-z0-9_$]*$/g);
              let out = "";
              let prefixes = "";
              let middle = "";
              let suffixes = "";
              if (isStatic) {
                prefixes += `static `;
                targetType = "static class member";
              } else if (isPrototype) {
                targetType = "prototype class member";
              } else if (isClass) {
                targetType = "only class";
              }
              if (isClass) {
                if (isStatic || isPrototype) {
                  suffixes += " = ";
                }
                suffixes += `class ${fileId}`;
                targetType =
                  targetType === "class" ? targetType : targetType + " + class";
              } else if (isAsync) {
                prefixes += `async `;
                suffixes += `()`;
                targetType += " + async";
              } else if (isSync) {
                prefixes += ``;
                suffixes += `()`;
                targetType += " + sync";
              } else {
                suffixes = " ()";
              }
              if (!isOnlyClass) {
                if (isJsFriendly) {
                  middle = fileId;
                } else {
                  middle = JSON.stringify(fileId);
                }
              }
              out = prefixes + middle + suffixes;
              return out;
            })();
            const opener = ["/", "*", "*"].join("");
            const closer = ["*", "/"].join("");
            let headerComment = "";
            headerComment += `${opener}\n`;
            const nameByFile = targetRootdir
              .replace(/^\@\/src\/candidate\//g, "")
              .replace(/^\@\/src\//g, "")
              .replace(/\.js$/g, "")
              .replace(/\//g, ".");
            const basenameByFile = path
              .basename(targetRootdir)
              .replace(/\.js$/g, "");
            headerComment += `   * # ${basenameByFile}\n`;
            headerComment += `   * - section: ${nameByFile}\n`;
            headerComment += `   * - file:    ${targetRootdir}\n`;
            headerComment += `   ${closer}`;
            return require("fs")
              .promises.writeFile(
                file,
                `${name} {
  ${headerComment}
}`,
                "utf8",
              )
              .catch((error) => {
                console.log(
                  `[!] Could not create injected path «${file}» on «ModulerV6.prototype._compileAsInjectSource»`,
                );
              });
          }
          /**
           * @name CompilerV6.prototype._renderSourceAsTemplate
           * @type
           * @description
           */
          async _renderSourceAsTemplate(compilationFile, compilationProcess) {
            if (!compilationFile.resource.endsWith(".js")) {
              return "ok:1:no js file so no template";
            }
            if (compilationProcess.disableTemplates) {
              return "ok:2:disabled templates";
            }
            if (!compilationProcess.enableTemplates) return false;
            compilationFile.compilation.js = compilationFile.source =
              await this._renderTemplate(compilationFile.source, {
                compilationFile,
                compilationProcess,
                $compiler: this,
              });
            // console.log(compilationFile);
          }
          /**
           * @name CompilerV6.prototype._renderTemplate
           * @type
           * @description
           */
          async _renderTemplate(templateSource, argsBrute = {}) {
            const { tokens } =
              this._parser.forTemplateComments.parse(templateSource);
            if (!tokens.length) {
              return templateSource;
            }
            console.log(tokens, argsBrute.compilationFile);
            const tokenType1 = ["/", "*", "%"].join("");
            const tokenType2 = ["/", "*", "%", "="].join("");
            const args = Object.assign({}, argsBrute);
            const code = [
              "const __out=[];\nconst print = function(...x) {\n  return __out.push(...x);\n};",
            ];
            let cursor = 0;
            for (const token of tokens) {
              if (cursor < token.location[0])
                code.push(
                  `__out.push(${JSON.stringify(templateSource.slice(cursor, token.location[0]))});`,
                );
              if (token.type === tokenType1) code.push(token.inner);
              else if (token.type === tokenType2)
                code.push(`__out.push(await (${token.inner}));`);
              // @CAUTION: ChatGPT puso aquí + 1 en vez de + 0 y se nos estaba comiendo 1 caracter
              // @CAUTION: puede que el error venga del text-parser-v1
              cursor = token.location[1] + 0;
            }
            if (cursor < templateSource.length)
              code.push(
                `__out.push(${JSON.stringify(templateSource.slice(cursor))});`,
              );
            code.push("return __out.join('');");
            const templateCallback = new async function () {}.constructor(
              ...Object.keys(args),
              code.join(""),
            );
            const templateResult = await templateCallback.call(
              this,
              ...Object.values(args),
            );
            return templateResult;
          }
          /**
           * @name CompilerV6.prototype._removeInitialSpace
           * @type
           * @description
           */
          _removeInitialSpace(text) {
            return text.startsWith(" ") ? text.substr(1) : text;
          }
          /**
           * @name CompilerV6.prototype._unifyCompilationMarkdown
           * @type
           * @description
           */
          _unifyCompilationMarkdown(compilationFile, compilationProcess) {
            let output,
              tabulation = 0;
            Unify_parts: {
              output = compilationFile.mdUnification
                .slice()
                .reverse()
                .map((it) => {
                  if (typeof it === "string") {
                    return it;
                  }
                  Calculate_tabulation: {
                    if (typeof it.tabulation === "number") {
                      tabulation += it.tabulation;
                    } else if (typeof it.tabulation === "string") {
                      tabulation = parseInt(it.tabulation.substr(1));
                    }
                  }
                  let indentedBody = it.body;
                  Indent_body_titles: {
                    if (it.titleIndentation) {
                      indentedBody = indentedBody.replace(
                        /(^|\n)\#/g,
                        "\n#" + "#".repeat(it.titleIndentation),
                      );
                    }
                  }
                  let finalText;
                  Set_final_text: {
                    finalText =
                      it.prefix + "   ".repeat(tabulation) + indentedBody;
                  }
                  return finalText;
                })
                .join("");
            }
            Inject_table_of_contents: {
              if (!output.includes("{{ Table of contents }}"))
                break Inject_table_of_contents;
              const toc = this._extractMarkdownTableOfContents(output, true);
              output = output.replace("{{ Table of contents }}", toc);
            }
            Inject_relations: {
              if (!output.includes("{{ Relations }}")) break Inject_relations;
              const rels = this._extractMarkdownRelations(compilationFile);
              output = output.replace("{{ Relations }}", rels);
            }
            Export_unification: {
              compilationFile.compilation.md += output;
            }
            Export_unification_to_parent_compilation: {
              if (compilationFile.parentCompilation) {
                this._prependToParentCompilationFile(
                  compilationFile.parentCompilation,
                  output,
                  "md",
                  false,
                );
              }
            }
          }
          /**
           * @name CompilerV6.prototype.normalizationOf
           * @type
           * @description
           */
          normalizationOf(nodepath, origin = false) {
            this._trace("normalizationOf", arguments);
            return this.moduler.normalizationOf(nodepath);
          }
          /**
           * @name CompilerV6.prototype.rootdirOf
           * @type
           * @description
           */
          rootdirOf(fullpath) {
            this._trace("rootdirOf", arguments);
            // return this.moduler.rootdirOf(fullpath);
            const normalization = this.normalizationOf(fullpath);
            return normalization.startsWith(this.rootdir + "/")
              ? normalization.replace(this.rootdir + "/", "@/")
              : normalization;
          }
          /**
           * @name CompilerV6.prototype.fullpathOf
           * @type
           * @description
           */
          fullpathOf(nodepath) {
            this._trace("fullpathOf", arguments);
            if (nodepath.startsWith("@/")) {
              return require("path").resolve(this.rootdir, nodepath.substr(2));
            }
            return require("path").resolve(this.basedir, nodepath);
          }
          /**
           * @name CompilerV6.prototype.compile
           * @type
           * @description
           */
          async compile(resource, options = {}) {
            return this._compileRecursively(
              {
                resource: this.normalizationOf(resource),
                isRoot: true,
              },
              {
                ...options,
              },
            );
          }
          /**
           * @name CompilerV6.prototype.setBasedir
           * @type
           * @description
           */
          setBasedir(basedir) {
            this.basedir = this.normalizationOf(basedir);
            this.moduler.basedir = this.basedir;
          }
          /**
           * @name CompilerV6.prototype.setRootdir
           * @type
           * @description
           */
          setRootdir(rootdir) {
            this.rootdir = this.normalizationOf(rootdir);
            this.moduler.rootdir = this.rootdir;
          }
          /**
           * @name CompilerV6.prototype.log
           * @type
           * @description
           */
          log(...args) {
            if (!this._logger) {
              this._logger = new this.constructor.Logger({ file: false }, this);
            }
            this._logger.log(...args);
          }
        };
        return CompilerV6;
      }.call(),
    );
    return class DevBinaryV6 {
      /**
       * @name DevBinaryV6
       * @type
       * @description
       */
      /**
       * @name DevBinaryV6.static.create
       * @type
       * @description
       */
      static create(...args) {
        return new this(...args);
      }
      /**
       * @name DevBinaryV6.static.fromRootDirectoryOf
       * @type
       * @description
       */
      static fromRootDirectoryOf(dir, file = "package.json") {
        return this.Utils.findFirstParentDirectoryContaining(dir, file).then(
          (upperDir) => new this(upperDir),
        );
      }
      /**
       * @name DevBinaryV6.static.Refrescador
       * @type
       * @description
       */
      static Refrescador = (function () {
        // @REFRESCADOR: Primero intenta la ruta relativa inmediata, y si no, busca la del src/external/refrescador, y ahí sí, y si no, peta.
        try {
          return require(
            require("path").resolve(
              `${__dirname}/refrescador/refrescador.api.dist.js`,
            ),
          );
        } catch (error) {
          return require(
            require("path").resolve(
              `${__dirname}/../../../src/external/refrescador/refrescador.api.dist.js`,
            ),
          );
        }
      })();
      /**
       * @name DevBinaryV6.static.CompilerV6
       * @type
       * @description
       */
      static CompilerV6 = CompilerV6;
      /**
       * @name DevBinaryV6.static.Cronometer
       * @type
       * @description
       */
      static Cronometer = () => {
        let tasks = Object.assign({}, { counter: 0 });

        const getTask = function (name) {
          if (tasks[name]) return tasks[name];
          tasks[name] = {
            name,
            openedAt: null,
            lastMarkAt: null,
            stoppedAt: null,
            marks: [],
            open(label) {
              const now = new Date();
              this.openedAt = now;
              this.lastMarkAt = now;
              this.stoppedAt = null;
              this.marks = [];
              this.order = tasks.counter++;
              if (label) this.mark(label);
              return this;
            },
            mark(label) {
              const now = new Date();
              this.marks.push({
                label,
                fromLast: now - this.lastMarkAt,
                fromStart: now - this.openedAt,
              });
              this.lastMarkAt = now;
              return this;
            },
            stop(label) {
              if (label) this.mark(label);
              this.stoppedAt = new Date();
              return this;
            },
            milliseconds() {
              return this.stoppedAt - this.openedAt;
            },
          };
          return tasks[name];
        };

        getTask.pick = function (name, defaultValue = null) {
          return tasks[name] || defaultValue;
        };

        getTask.export = function () {
          return Object.values(tasks).map((task) => ({
            name: task.name,
            fromStart: task.stoppedAt - task.openedAt,
            marks: (task.marks || []).map(
              (it) => `·${it.fromStart} | +${it.fromLast} | #${it.label}`,
            ),
          }));
        };

        getTask.print = function () {
          const out = getTask.export();
          return console.log(JSON.stringify(out, null, 2)) || out;
        };

        getTask.reset = function () {
          tasks = Object.assign({}, { counter: 0 });
        };

        return getTask;
      };
      /**
       * @name DevBinaryV6.static.ModulerV6
       * @type
       * @description
       */
      static ModulerV6 = CompilerV6.ModulerV6;
      /**
       * @name DevBinaryV6.static.Utils
       * @type
       * @description
       */
      static Utils =
        /**
         * @name DevBinaryV6.Utils.class
         * @type
         * @description
         */
        class DevBinaryV6Utils {
          /**
           * @name DevBinaryV6.Utils.static.defaultTouchFileOptions
           * @type
           * @description
           */
          static defaultTouchFileOptions(overrider = {}) {
            return {
              propagateUp: true,
              testFeatures: [],
              testIntegrity: [],
              testSpeed: [],
              ...overrider,
            };
          }
          /**
           * @name DevBinaryV6Utils.findFirstParentDirectoryContaining
           * @type
           * @description
           */
          static async findFirstParentDirectoryContaining(
            dirBrute,
            file = "package.json",
            includingSelf = true,
          ) {
            const fs = require("fs").promises;
            const path = require("path");
            const dir = path.resolve(dirBrute);
            let dir2 = includingSelf ? dir : path.dirname(dir);
            let prevDir2 = undefined;
            let selectedDir = false;
            Search_directory_up: while (dir2 !== prevDir2) {
              const filepath = path.resolve(dir2, file);
              try {
                await fs.readFile(filepath, "utf8");
                selectedDir = dir2;
                break Search_directory_up;
              } catch (error) {
                // @OK
              }
              prevDir2 = dir2;
              dir2 = path.dirname(dir2);
            }
            if (selectedDir) {
              return selectedDir;
            }
            throw new Error(
              `No directory up found with file «${file}» from directory «${dir}» on «DevBinaryV6Utils.findFirstParentDirectoryContaining»`,
            );
          }
          /**
           * @name DevBinaryV6.Utils.static.removeNullPropertiesFromObject
           * @type
           * @description
           */
          static removeNullPropertiesFromObject(obj) {
            const output = {};
            for (let prop in obj) {
              const val = obj[prop];
              if (val !== null) {
                output[prop] = val;
              } else {
                console.log("Removed: " + prop, val);
              }
            }
            return output;
          }
          /**
           * @name DevBinaryV6.Utils.prototype.assert
           * @type
           * @description
           */
          assert(...args) {
            return this.devbin.moduler.assert(...args);
          }
          /**
           * @name DevBinaryV6.Utils.prototype.parseCliArgs
           * @type
           * @description
           */
          parseCliArgs(args) {
            this.assert(
              typeof args === "object",
              `Parameter «args» must be object on «DevBinaryV6.Utils.prototype.parseCliArgs»`,
            );
            this.assert(
              Array.isArray(args),
              `Parameter «args» must be array on «DevBinaryV6.Utils.prototype.parseCliArgs»`,
            );
            this.assert(
              args.length !== 0,
              `Parameter «args» must have at least 1 item on «DevBinaryV6.Utils.prototype.parseCliArgs»`,
            );
            let params = { _: [] };
            let selected = "_";
            for (let index = 0; index < args.length; index++) {
              const arg = args[index];
              if (arg.startsWith("-")) {
                selected = arg;
                params[selected] = params[selected] || [];
              } else {
                params[selected].push(arg);
              }
            }
            return params;
          }
          /**
           * Unifica los argumentos parseados de la CLI.
           *
           * args:
           * {
           *   _: ["param1", "param2"],
           *   "--option": ["a", "b"],
           *   "-o": ["c"]
           * }
           *
           * definition:
           * {
           *   option: {
           *     alias: ["-o"],
           *     onFormat(list) {
           *       return list[list.length - 1];
           *     },
           *     description: "..."
           *   }
           * }
           */
          formatCliArgs(definition = false, argsBrute = process.argv) {
            // Si no hay definición simplemente devolvemos una copia.
            this.assert(
              typeof definition === "object",
              "Parameter «definition» must be object on «DevBinaryV6.Utils.prototype.formatCliArgs»",
            );
            Validate_arguments: {
              this.assert(
                typeof argsBrute === "object",
                "Parameter «args» must be object on «DevBinary.Utils.prototype.formatCliArgs»",
              );
              this.assert(
                argsBrute !== null,
                "Parameter «args» cannot be null on «DevBinary.Utils.prototype.formatCliArgs»",
              );
            }
            let args, result, usedKeys;
            Initialize_args: {
              args = Array.isArray(argsBrute)
                ? this.parseCliArgs(argsBrute)
                : argsBrute;
            }
            result = {};
            Initialize_positionals: {
              result._ = args ? args._ : [];
            }
            usedKeys = new Set(["_"]);
            Iterating_definition_entries: for (const [
              name,
              config,
            ] of Object.entries(definition)) {
              const longKey = "--" + name;
              const aliases = config.alias || [];
              const sources = [];
              if (longKey in args) {
                sources.push({
                  key: longKey,
                  value: args[longKey],
                });
              }
              Iterating_aliases: for (const alias of aliases) {
                if (alias in args) {
                  sources.push({
                    key: alias,
                    value: args[alias],
                  });
                }
              }
              // Si aparecen varias fuentes distintas, es ambiguo.
              if (sources.length > 1) {
                throw new Error(
                  `Option "${name}" was specified multiple times (${sources.map((v) => v.key).join(", ")}).`,
                );
              }
              if (sources.length === 0) {
                if ("default" in config) {
                  result[name] = config.default;
                }
                continue Iterating_definition_entries;
              }
              usedKeys.add(longKey);
              for (const alias of aliases) {
                usedKeys.add(alias);
              }
              let value = sources[0].value;
              if (typeof config.onFormat === "function") {
                value = config.onFormat.call(this, [...value]);
              }
              result[name] = value;
            }
            // Detectar opciones desconocidas
            Iterating_keys: for (const key of Object.keys(args)) {
              if (usedKeys.has(key)) {
                continue Iterating_keys;
              }
              if (key.startsWith("-")) {
                throw new Error(`Unknown option "${key}".`);
              }
              result[key] = args[key];
            }
            return result;
          }
          /**
           * @name DevBinaryV6.Utils.prototype.compileDistribuiblesOf
           * @type
           * @description
           */
          async compileDistribuiblesOf(filepath, event) {
            let compilation,
              srcDistJs,
              srcDistMd,
              distJs,
              distCss,
              distMd,
              report;
            const currentStep = [];
            try {
              currentStep.push("1. begin");
              Initialize_report: {
                report = {};
              }
              Get_compilation: {
                currentStep.push("2. compile");
                compilation = await this.devbin.compiler.compile(filepath, {
                  processedEntries: event.processedEntries,
                  uncacheInjections: event.uncacheInjections,
                  dontCreateOnInjectSource: false,
                });
              }
              Get_dist_filepaths: {
                currentStep.push("3. compose output paths");
                const outputNames = this.getDistribuibleFilenamesOf(
                  compilation.file,
                  event,
                );
                const inputDir = require("path").dirname(outputNames.file);
                const inputRootdir = this.devbin.compiler.rootdirOf(inputDir);
                let outputDir = undefined;
                Export_directly_to_dist_www_if_isSrcWww: {
                  if (event.isSrcWww) {
                    outputDir = this.devbin.compiler.fullpathOf(
                      inputRootdir.replace(/^\@\/src\/www/g, "@/dist/www"),
                    );
                  } else {
                    outputDir = this.devbin.compiler.fullpathOf(
                      inputRootdir.replace(/^\@\//g, "@/dist/"),
                    );
                  }
                }
                distJs = require("path").resolve(outputDir, outputNames.js);
                distCss = require("path").resolve(outputDir, outputNames.css);
                distMd = require("path").resolve(outputDir, outputNames.md);
                srcDistJs = require("path").resolve(inputDir, outputNames.js);
                srcDistMd = require("path").resolve(inputDir, outputNames.md);
                report.names = outputNames;
              }
              Make_assertions_for_safety: {
                currentStep.push("4. safety assertions 1");
                this.assert(
                  distJs.endsWith(".dist.js"),
                  `File should end with «.dist.js» but it is not the case on «${distJs}»`,
                );
                this.assert(
                  distCss.endsWith(".dist.css"),
                  `File should end with «.dist.css» but it is not the case on «${distCss}»`,
                );
                this.assert(
                  distMd.endsWith(".md"),
                  `File should end with «.md» but it is not the case on «${distMd}»`,
                );
                this.assert(
                  distJs.includes("/dist/"),
                  `File should include «/dist/» but it is not the case on «${distJs}»`,
                );
              }
              Overwrite_dist_files: {
                currentStep.push("5. ensure output directory");
                await this.ensureDirectoryOf(distJs);
                if (compilation.js) {
                  currentStep.push("6. minify");
                  let output = undefined;
                  Minify_js_output: {
                    output =
                      await this.devbin.compiler.constructor.softMinifyJs(
                        compilation.js,
                        {
                          compress: false,
                          mangle: false,
                          toplevel: true,
                          format: {
                            comments: false, // Esta es la única cambiada
                            beautify: true,
                          },
                        },
                      );
                  }
                  Persist_js_file: {
                    currentStep.push("7. write js file");
                    await require("fs").promises.writeFile(
                      distJs,
                      output.code,
                      "utf8",
                    );
                    console.log(
                      this.devbin.compiler.constructor.ansi.colors
                        .style("blackBright")
                        .text(
                          `[*] DevBinaryV6 generated distribution file at: ${this.devbin.compiler.rootdirOf(distJs)}`,
                        ),
                    );
                    report.js = distJs;
                  }
                  Save_in_touch_event_cache: {
                    // Antes estaba esto:
                    // event.processedEntries[compilation.file] = compilation;
                    event.processedEntries[compilation.file] = { distJs };
                  }
                  Generate_instrumentalized_if_settings_instrumentalize_includes_it: {
                    currentStep.push("7. load settings");
                    await this.devbin.settings.load();
                    const instrumentalizeFiles =
                      this.devbin.settings?.data?.instrumentalize || [];
                    const isMatch = instrumentalizeFiles
                      .map((file) => this.devbin.moduler.normalizationOf(file))
                      .includes(distJs);
                    if (isMatch) {
                      currentStep.push("8. generate instrumentalization");
                      Create_instrumentalization: {
                        const instrJs = distJs.replace(
                          /\.dist\.js$/g,
                          ".dist.instr.js",
                        );
                        const instrSource = this.instrumentCode(
                          output.code,
                          distJs,
                        );
                        await require("fs").promises.writeFile(
                          instrJs,
                          instrSource,
                          "utf8",
                        );
                        console.log(
                          this.devbin.compiler.constructor.ansi.colors
                            .style("blackBright")
                            .text(
                              `[*] DevBinaryV6 generated instrumentation file at: ${this.devbin.compiler.rootdirOf(instrJs)}`,
                            ),
                        );
                      }
                    }
                  }
                }
                if (compilation.css) {
                  currentStep.push("9. write css file");
                  await require("fs").promises.writeFile(
                    distCss,
                    compilation.css,
                    "utf8",
                  );
                  if (!event.processedEntries[compilation.file])
                    event.processedEntries[compilation.file] = {};
                  event.processedEntries[compilation.file].distCss = distCss;
                  report.css = distCss;
                }
                if (compilation.md) {
                  currentStep.push("10. write md file");
                  await require("fs").promises.writeFile(
                    distMd,
                    compilation.md,
                    "utf8",
                  );
                  if (!event.processedEntries[compilation.file])
                    event.processedEntries[compilation.file] = {};
                  event.processedEntries[compilation.file].distMd = distMd;
                  report.md = distMd;
                }
              }
              Feedback_report: {
                currentStep.push("last. return report");
                return report;
              }
            } catch (error) {
              console.log(
                `[!] Error on method «compileDistribuiblesOf» on step «${currentStep.reverse().join(" < ")}» of file «${filepath}»`,
                error,
              );
              throw error;
            }
          }
          /**
           * @name DevBinaryV6.Utils.prototype.getDistribuibleFilenamesOf
           * @type
           * @description
           */
          getDistribuibleFilenamesOf(fileBrute, event) {
            let file, filename, fileExtension;
            file = require("path").basename(fileBrute);
            if (file.endsWith(".entry.js")) {
              filename = file.substr(0, file.length - ".entry.js".length);
              fileExtension = "js";
            } else if (file.endsWith(".entry.css")) {
              filename = file.substr(0, file.length - ".entry.css".length);
              fileExtension = "css";
            } else if (file.endsWith(".entry.md")) {
              filename = file.substr(0, file.length - ".entry.md".length);
              fileExtension = "md";
            } else {
              throw new Error(
                `Parameter «file» must end with «.entry.js», «.entry.css» or «.entry.md» but it is «${file}» on «DevBinaryV6.Utils.prototype.getDistribuibleFilenamesOf»`,
              );
            }
            return {
              file: fileBrute,
              rootdir: this.devbin.compiler.rootdirOf(fileBrute),
              rootdirDirectory: require("path").dirname(
                this.devbin.compiler.rootdirOf(fileBrute),
              ),
              basename: file,
              extension: fileExtension,
              test: filename + ".test.js",
              js: filename + ".dist.js",
              css: filename + ".dist.css",
              md: filename + ".md",
            };
          }
          /**
           * @name DevBinaryV6.Utils.prototype.fabricateUnitTestFileOf
           * @type
           * @description
           */
          async fabricateUnitTestFileOf(filepath, event) {
            if (event.isSrcWww) {
              // Si es para el dist/www no hay test
              return -2;
            }
            if (!event.distribution.js) {
              // Si no tiene distribution.js no hay test
              return -3;
            }
            const path = require("path");
            const fs = require("fs");
            const testunitFile = path.resolve(
              event.distribution.names.rootdirDirectory.replace(
                /^\@\/src/g,
                this.devbin.compiler.fullpathOf("@/test/unit/src"),
              ),
              event.distribution.names.test,
            );
            const devBinaryV6Filepath =
              this.devbin.compiler.fullpathOf("@/dev/bin.js");
            const devBinaryV6RelativeFilepath = path.relative(
              path.dirname(testunitFile),
              devBinaryV6Filepath,
            );
            const relativeTarget = path.relative(
              path.dirname(testunitFile),
              event.distribution.js,
            );
            const testunitContent = `const devbin = require(__dirname + ${JSON.stringify("/" + devBinaryV6RelativeFilepath)});\nconst target = require(__dirname + ${JSON.stringify("/" + relativeTarget)});\n\nmodule.exports = (async function () {

  devbin.assert(true, "Test is empty right now");

})();`;
            const testunitDir = path.dirname(testunitFile);
            if (!(await this.existsFile(testunitFile))) {
              await fs.promises.mkdir(testunitDir, { recursive: true });
              await fs.promises.writeFile(
                testunitFile,
                testunitContent,
                "utf8",
              );
            }
            return {
              unitDir: testunitDir,
              unitFile: testunitFile,
              unitContent: testunitContent,
              targetFile: event.distribution.names.file,
            };
          }
          /**
           * @name DevBinaryV6.Utils.prototype.executeUnitTestFileOf
           * @type
           * @description
           */
          async executeUnitTestFileOf(filepath, event) {
            if (event.isSrcWww) {
              console.log(
                `[*] DevBinaryV6 ignored test for browser file: ${filepath}`,
              );
            } else {
              console.log(
                `[*] Executing unit test file of: ${event.testFabrication.unitFile}`,
              );
              let testUnitFile = undefined;
              Get_unit_test_filepath: {
                if (event.testFabrication.unitFile) {
                  testUnitFile = event.testFabrication.unitFile;
                } else if (filepath.endsWith(".test.js")) {
                  testUnitFile = filepath;
                } else {
                  return -2;
                }
              }
              delete require.cache[testUnitFile];
              const $ = this.devbin.compiler.constructor.ansi.colors;
              try {
                const testCallback = await require(testUnitFile);
                if (typeof testCallback === "function") {
                  await testCallback.call({
                    devbin: this.devbin,
                    filepath,
                    event,
                  });
                }
              } catch (error) {
                console.log(
                  $.style("red,bold").text(
                    `[!] Unit test error on file «${testUnitFile}»:`,
                  ),
                );
                console.log(error);
              }
            }
          }
          /**
           * @name DevBinaryV6.Utils.prototype.propagateUpTouchEventFrom
           * @type
           * @description
           */
          async propagateUpTouchEventFrom(filepath, event = {}) {
            const fs = require("fs");
            const path = require("path");
            let nextPropagationFiles = [];
            let currentDirectory = path.dirname(path.resolve(filepath));
            let currentDirectoryName = path.basename(currentDirectory);
            let upperDirectory = path.dirname(currentDirectory);
            let pivotDirectory = undefined;
            let firstFile = undefined;
            Propagate_to_directory_main_entry: {
              const possibleMainEntry = `${currentDirectory}/${currentDirectoryName}.entry.js`;
              if (await this.existsFile(possibleMainEntry)) {
                await this.touchFile(possibleMainEntry, {
                  propagateUp: false,
                  processedEntries: event.processedEntries || {},
                });
              }
            }
            Propagate_to_upper_directory: {
              pivotDirectory = upperDirectory;
              Iterating_entries: while (true) {
                const entries = await fs.promises.readdir(pivotDirectory, {
                  withFileTypes: true,
                });
                const matchedEntries = entries
                  .filter((e) => {
                    return (
                      e.isFile() &&
                      (e.name.endsWith(".entry.js") ||
                        e.name.endsWith(".entry.css") ||
                        e.name.endsWith(".entry.md"))
                    );
                  })
                  .map((e) => path.resolve(e.path, e.name));
                if (matchedEntries.length) {
                  nextPropagationFiles = matchedEntries;
                  break Iterating_entries;
                }
                const parentDir = path.dirname(pivotDirectory);
                if (parentDir === pivotDirectory) {
                  return null; // Hemos llegado a la raíz.
                }
                pivotDirectory = parentDir;
              }
              firstFile = nextPropagationFiles[0];
              await Promise.all(
                nextPropagationFiles.map((file) => {
                  return this.touchFile(file, {
                    propagateUp: false,
                    processedEntries: event.processedEntries || {},
                  });
                }),
              );
            }
            return this.propagateUpTouchEventFrom(firstFile, event);
          }
          /**
           * @name DevBinaryV6.Utils.prototype.ensureDirectoryOf
           * @type
           * @description
           */
          ensureDirectoryOf(file) {
            return require("fs")
              .promises.mkdir(require("path").dirname(file), {
                recursive: true,
              })
              .catch((error) => false);
          }
          /**
           * @name DevBinaryV6.Utils.prototype.touchFile
           * @type
           * @description
           */
          async touchFile(file, optionsInput = {}) {
            this.assert(
              typeof file === "string",
              `Parameter «--file» must be string and not «${typeof file}» on «DevBinaryV6.Utils.prototype.touchFile»`,
            );
            const currentStep = [];
            try {
              let outputFile = false;
              currentStep.push("0. begin with: " + file);
              let fs, path, filepath, rootPath;
              Initialize_dependencies: {
                currentStep.push("1. initialize dependencies");
                fs = require("fs");
                path = require("path");
                filepath = this.devbin.compiler.fullpathOf(file);
                rootPath = this.devbin.moduler.rootdirOf(filepath);
              }
              // this.assert(this.devbin.compiler.rootdirOf(filepath).startsWith("@/src"), `Parameter «--file» must start with «${this.devbin.compiler.rootdir}» but it is «${rootPath}» on «DevBinaryV6.Utils.prototype.touchFile»`);
              let event;
              let isEntry;
              Initialize_event: {
                currentStep.push("1. initialize event for: " + rootPath);
                event = this.constructor.defaultTouchFileOptions({
                  type: "TouchFileEvent",
                  propagateUp: true,
                  ignoreOnTouchEvent: false,
                  processedEntries: {},
                  isRoot: false,
                  ...optionsInput,
                });
                this.assert(
                  optionsInput.uncacheInjections === event.uncacheInjections,
                  "Las inyections 2",
                );
                event.filename = path.basename(filepath);
                event.isHtml = filepath.endsWith(".html");
                event.isJsEntry = filepath.endsWith(".entry.js");
                event.isCssEntry = filepath.endsWith(".entry.css");
                event.isMdEntry = filepath.endsWith(".entry.md");
                event.isJsTest = filepath.endsWith(".test.js");
                event.isSplittableClass =
                  event.filename.startsWith("splittable.") &&
                  event.filename.endsWith(".class.js");
                event.isSrcWww = rootPath.startsWith("@/src/www/");
                event.isSrc = rootPath.startsWith("@/src/");
                isEntry =
                  event.isJsEntry || event.isCssEntry || event.isMdEntry;
              }
              // console.log(this.devbin.compiler.constructor.ansi.colors.style("blackBright").text(event.uncacheInjections));

              Touch_event: {
                currentStep.push("3. run touch event");
                Processing_entry: {
                  Caso_previo_1_splittable_class: {
                    if (event.isSplittableClass) {
                      await this.synchronizeSplittableClass(filepath, event);
                      break Touch_event;
                    }
                  }
                  Caso_previo_2_dev_settings_exportar_a_www_dev_settings_las_partes_exportables: {
                    if (
                      filepath ===
                      this.devbin.compiler.fullpathOf("@/dev/settings.js")
                    ) {
                      currentStep.push("3.1. exporting dev/settings");
                      await this.exportDevSettings(filepath);
                      break Touch_event;
                    }
                  }
                  Caso_previo_3_caso_src_html: {
                    if (event.isHtml) {
                      currentStep.push("3.2. found html file");
                      if (event.isSrcWww) {
                        currentStep.push("3.2.a. html is src/www/**/*.html");
                        outputFile = `@/dist/www/${rootPath.replace("@/src/www/", "")}`;
                      } else if (event.isSrc) {
                        currentStep.push("3.2.b. html is src/**/*.html");
                        outputFile = `@/dist/src/${rootPath.replace("@/src/", "")}`;
                      } else {
                        currentStep.push("3.2.c. html is not src/**/*.html");
                        console.log(
                          this.devbin.compiler.constructor.ansi.colors
                            .style("blackBright")
                            .text(
                              `[-] DevBinaryV6 dismissed touch event from an *.html not under «@/src/»: ${rootPath}`,
                            ),
                        );
                        break Touch_event;
                      }
                      currentStep.push("3.2.{a,b}. compiling html file");
                      const outputCompilation =
                        await this.devbin.compiler.compile(filepath);
                      const outputHtml = outputCompilation.html;
                      const outputFullpath =
                        this.devbin.moduler.normalizationOf(outputFile);
                      await require("fs").promises.writeFile(
                        outputFullpath,
                        outputHtml,
                        "utf8",
                      );
                    }
                  }
                  Caso_js_o_test_js: {
                    Paso_0_descartar_si_no_es_entry_o_test: {
                      if (!isEntry && !event.isJsTest) {
                        currentStep.push("3.3.a. is not entry nor test");
                        console.log(
                          this.devbin.compiler.constructor.ansi.colors
                            .style("blackBright")
                            .text(
                              `[-] DevBinaryV6 dismissed touch event from not entry or test: ${rootPath}`,
                            ),
                        );
                        break Processing_entry;
                      } else {
                        currentStep.push("3.3.b. is entry or test");
                        console.log(
                          this.devbin.compiler.constructor.ansi.colors
                            .style("blackBright")
                            .text(
                              `[*] DevBinaryV6 triggered touch event from: ${rootPath}`,
                            ),
                        );
                      }
                    }
                    Paso_1_compilar_distribuibles: {
                      currentStep.push("3.4. compile distribuibles of entry ");
                      Object.assign(event, {
                        distribution: await this.compileDistribuiblesOf(
                          filepath,
                          event,
                        ),
                      });
                    }
                    Paso_2_fabricar_test_unitario: {
                      currentStep.push("3.5. make unit test");
                      Object.assign(event, {
                        testFabrication: await this.fabricateUnitTestFileOf(
                          filepath,
                          event,
                        ),
                      });
                    }
                    Paso_3_ejecutar_test_unitario: {
                      currentStep.push("3.6. run unit test");
                      Object.assign(event, {
                        testExecution: await this.executeUnitTestFileOf(
                          filepath,
                          event,
                        ),
                      });
                    }
                    Triggering_onDistribute_file: {
                      currentStep.push("3.7. trigger e.onDistribute.js");
                      const onDistributeFile = path.join(
                        path.dirname(filepath),
                        "e.onDistribute.js",
                      );
                      await this.triggerCallbackFromFile(onDistributeFile, {
                        file: filepath,
                        event,
                      });
                    }
                    Triggering_onTest_file: {
                      currentStep.push("3.8. trigger e.onTest.js");
                      const onTestFile = path.join(
                        path.dirname(filepath),
                        "e.onTest.js",
                      );
                      const testsAdded = await this.triggerCallbackFromFile(
                        onTestFile,
                        { file: filepath, event },
                      );
                      if (typeof testsAdded !== "number") {
                        this.assert(
                          typeof testsAdded === "object",
                          `File «e.onTest.js» must return object about file «${onTestFile}» on «DevBinaryV6.Utils.prototype.touchFile»`,
                        );
                        Object.keys(testsAdded).forEach((prop) => {
                          this.assert(
                            ["feature", "integrity", "speed"].includes(prop),
                            `File «e.onTest.js» on «${onTestFile}» cannot return object with unknown property «${prop}» on «DevBinaryV6.Utils.prototype.touchFile»`,
                          );
                        });
                        if ("feature" in testsAdded)
                          event.testFeatures.push(...testsAdded.feature);
                        if ("integrity" in testsAdded)
                          event.testIntegrity.push(...testsAdded.integrity);
                        if ("speed" in testsAdded)
                          event.testSpeed.push(...testsAdded.speed);
                      }
                    }
                  }
                }
                Processing_test: {
                  if (event.isJsTest) {
                    currentStep.push("4. run file because it is a test");
                    await this.executeUnitTestFileOf(filepath, {
                      testFabrication: { unitFile: filepath },
                    });
                    break Touch_event;
                  }
                }
                Triggering_onTouch_file: {
                  if (event.ignoreOnTouchEvent) break Triggering_onTouch_file;
                  currentStep.push("5. run e.onTouch.js");
                  const onTouchFile = path.join(
                    path.dirname(filepath),
                    "e.onTouch.js",
                  );
                  await this.triggerCallbackFromFile(onTouchFile, {
                    file: filepath,
                    event,
                  });
                }
                Triggering_onDistributeDirectory_file: {
                  const onDistributeDirectoryFile = path.join(
                    path.dirname(filepath),
                    "e.onDistributeDirectory.js",
                  );
                  currentStep.push("6. run e.onDistributeDirectory.js");
                  const result = await this.triggerCallbackFromFile(
                    onDistributeDirectoryFile,
                    { file: filepath, event },
                  );
                  if (!outputFile) break Triggering_onDistributeDirectory_file;
                  if (result === true) {
                    currentStep.push("6.1. distributing directory");
                    const origin = path.dirname(
                      this.devbin.compiler.normalizationOf(rootPath),
                    );
                    // @ATENCIÓN: al basarse en outputFile ya se entiende si está en src o en src/www
                    const destination = path.dirname(
                      this.devbin.compiler.normalizationOf(outputFile),
                    );
                    require("fs").promises.cp(origin, destination, {
                      recursive: true,
                    });
                  }
                }
                Propagating_touch_up: {
                  Paso_4_propagar_evento_arriba: {
                    currentStep.push("6.2. propagate touch up");
                    const touchPropagation = event.propagateUp
                      ? await this.propagateUpTouchEventFrom(filepath, event)
                      : false;
                    Object.assign(event, {
                      touchPropagation: touchPropagation,
                    });
                  }
                }
                On_root: {
                  if (!event.isRoot) break On_root;
                  currentStep.push("7. it is root");
                  Run_integrity_tests: {
                    currentStep.push("7.1. run integrity tests");
                    await this.devbin.tester.runDirectory("@/test/integrity", {
                      title: "integrity",
                      filename: "integrity.js",
                      filter: (file) =>
                        this.matchesFileWithSimpleSelector(
                          path.basename(file),
                          [
                            ...event.testIntegrity, // Los integrity de los eventos acumulados:
                            ...(this.devbin.settings.data?.test?.integrity ||
                              []), // Los integrity del dev/settings.js#test/integrity:
                          ],
                        ),
                    });
                  }
                  Run_speed_tests: {
                    currentStep.push("7.2. run speed tests");
                    await this.devbin.tester.runDirectory("@/test/speed", {
                      title: "speed",
                      filename: "speed.js",
                      filter: (file) =>
                        this.matchesFileWithSimpleSelector(
                          path.basename(file),
                          [
                            ...event.testSpeed, // Los speeds de los eventos acumulados:
                            ...(this.devbin.settings.data?.test?.speed || []), // Los speeds del dev/settings.js#test/speeds:
                          ],
                        ),
                    });
                  }
                  Run_feature_tests: {
                    currentStep.push("7.3. run feature tests");
                    await this.devbin.tester.runDirectory("@/test/feature", {
                      title: "feature",
                      filename: "feature.js",
                      filter: (file) =>
                        this.matchesFileWithSimpleSelector(
                          path.basename(file),
                          [
                            ...event.testFeatures, // Los features de los eventos acumulados:
                            ...(this.devbin.settings.data?.test?.features ||
                              []), // Los features del dev/settings.js#test/features:
                          ],
                        ),
                    });
                  }
                  Run_case_tests: {
                    currentStep.push("7.3. run case tests");
                    await this.devbin.tester.runDirectory("@/test/case", {
                      title: "case",
                      filename: "case.js",
                      filter: (file) => true,
                    });
                  }
                  Run_devbin_test_command: {
                    if (
                      !(await this.devbin.compiler.files.hasFile(
                        "@/dev/bin/test/command.js",
                      ))
                    )
                      break Run_devbin_test_command;
                    currentStep.push(
                      `7.4. run «devbin test --origin ${filepath}»`,
                    );
                    const output = await this.devbin.command([
                      "test",
                      "--origin",
                      filepath,
                    ]);
                    if (output) console.log(output);
                  }
                }
              }
              return event;
            } catch (error) {
              console.log(
                `[!] Error on method «touchFile» on step «${currentStep.reverse()[0]}»`,
                error,
              );
              throw error;
            }
          }
          /**
           * @name DevBinaryV6.Utils.prototype.ensureCoreFrom
           * @type
           * @description
           */
          async ensureCoreFrom(basedirInput, parametersInput = {}) {
            const basedir = this.devbin.compiler.normalizationOf(basedirInput);

            const parameters = Object.assign(
              {},
              {
                ignoreErrors: false,
                allowDirtyDirectory: false,
                dontOverride: false,
                installDependencies: false,
              },
              parametersInput,
              {
                from: basedirInput,
              },
            );

            const fs = require("fs");
            const path = require("path");
            const targetDir = path.resolve(parameters.from);
            const innerFiles = await fs.promises.readdir(targetDir);

            if (!parameters.allowDirtyDirectory) {
              this.assert(
                innerFiles.length === 0,
                `Parameter «--from» should point to an empty directory but «${targetDir}» is not empty on «DevBinaryV6.Utils.prototype.ensureCoreFrom»`,
              );
            }

            const currentPackageJson = (() => {
              try {
                return require(`${__dirname}/../package.json`);
              } catch (error) {
                return { devDependencies: {}, dependencies: {} };
              }
            })();

            const initialPackageJson = {
              name: "name-of-the-project",
              bin: {},
              main: "dist/main.dist.js",
              scripts: {
                dev: "./dev/run.js loop",
                test: "./dev/run.js test'",
              },
              dependencies: currentPackageJson.dependencies,
              devDependencies: currentPackageJson.devDependencies,
              author: "allnulled",
              version: "1.0.0",
            };

            const utils = {};

            Object.assign(utils, {
              _createDirectory: function (dir) {
                return fs.promises.mkdir(dir);
              },
              _saveFile: async function (file, contents) {
                if (
                  parameters.dontOverride &&
                  (await utils._existsFile(file))
                ) {
                  return -1;
                }
                return await fs.promises.writeFile(file, contents, "utf8");
              },
              _saveFileIfNotExists: async function (file, contents) {
                if (await utils._existsFile(file)) return -1;
                return await fs.promises.writeFile(file, contents, "utf8");
              },
              _duplicateFile: async function (src, dst) {
                if (parameters.dontOverride && (await utils._existsFile(dst))) {
                  return -1;
                }
                return await fs.promises.copyFile(src, dst);
              },
              _duplicateDirectory: function (src, dst) {
                // @CAUTION: aquí no hay filtro de dontOverride
                return fs.promises.cp(src, dst, { recursive: true });
              },
              _initializeDuplicatedFile: async function (src, dst) {
                if (!(await utils._existsFile(dst))) {
                  return await fs.promises.copyFile(src, dst);
                }
              },
              _readFile: function (src) {
                return fs.promises.readFile(src, "utf8");
              },
              trify: function (callback, errorSignal = false) {
                return async function (...args) {
                  try {
                    return await callback(...args);
                  } catch (error) {
                    return errorSignal;
                  }
                };
              },
            });

            Object.assign(utils, {
              _existsFile: utils.trify(utils._readFile, false),
            });

            const createDirectory = parameters.ignoreErrors
              ? utils.trify(utils._createDirectory)
              : utils._createDirectory;
            const createDirectoryIfNotExists = utils.trify(
              utils._createDirectory,
            );
            const saveFile = parameters.ignoreErrors
              ? utils.trify(utils._saveFile)
              : utils._saveFile;
            const saveFileIfNotExists = utils._saveFileIfNotExists;
            const duplicateFile = parameters.ignoreErrors
              ? utils.trify(utils._duplicateFile)
              : utils._duplicateFile;
            const duplicateDirectory = parameters.ignoreErrors
              ? utils.trify(utils._duplicateDirectory)
              : utils._duplicateDirectory;
            const duplicateFileIfNotExists = utils.trify(
              utils._initializeDuplicatedFile,
            );

            await createDirectoryIfNotExists(`${targetDir}/dev`);
            await createDirectoryIfNotExists(`${targetDir}/dev/bin`);
            await createDirectoryIfNotExists(`${targetDir}/dev/bin/help`);
            await createDirectoryIfNotExists(`${targetDir}/dev/bin/test`);
            await createDirectoryIfNotExists(`${targetDir}/dev/coverage`);
            await createDirectoryIfNotExists(`${targetDir}/dev/files`);
            await createDirectoryIfNotExists(`${targetDir}/src`);
            await createDirectoryIfNotExists(`${targetDir}/src/external`);
            await createDirectoryIfNotExists(`${targetDir}/src/www`);
            await createDirectoryIfNotExists(`${targetDir}/src/www/dev`);
            await createDirectoryIfNotExists(`${targetDir}/src/www/external`);
            await createDirectoryIfNotExists(`${targetDir}/dist`);
            await createDirectoryIfNotExists(`${targetDir}/dist/src`);
            await createDirectoryIfNotExists(`${targetDir}/dist/www`);
            await createDirectoryIfNotExists(`${targetDir}/dist/www/coverage`);
            await createDirectoryIfNotExists(`${targetDir}/dist/www/external`);
            await createDirectoryIfNotExists(`${targetDir}/dist/www/dev`);
            await createDirectoryIfNotExists(
              `${targetDir}/dist/www/dev/settings`,
            );
            await createDirectoryIfNotExists(`${targetDir}/dist/src/external`);
            await createDirectoryIfNotExists(`${targetDir}/test`);
            await createDirectoryIfNotExists(`${targetDir}/test/feature`);
            await createDirectoryIfNotExists(`${targetDir}/test/integrity`);
            await createDirectoryIfNotExists(`${targetDir}/test/unit`);
            await createDirectoryIfNotExists(`${targetDir}/test/unit/src`);
            await createDirectoryIfNotExists(`${targetDir}/test/case`);
            await createDirectoryIfNotExists(`${targetDir}/test/speed`);
            await createDirectoryIfNotExists(`${targetDir}/docs`);
            await createDirectoryIfNotExists(`${targetDir}/docs/dist`);
            await createDirectoryIfNotExists(`${targetDir}/docs/dist/www`);
            await createDirectoryIfNotExists(
              `${targetDir}/docs/dist/www/external`,
            );

            await saveFileIfNotExists(
              `${targetDir}/package.json`,
              JSON.stringify(initialPackageJson, null, 2),
              "utf8",
            );
            if (!(await utils._existsFile(`${targetDir}/.gitignore`)))
              await saveFile(`${targetDir}/.gitignore`, "node_modules", "utf8");

            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/devbin-help.js`,
              `${targetDir}/dev/bin/help/command.js`,
            );
            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/dev-bin.js`,
              `${targetDir}/dev/bin.js`,
            );
            Al_run_hay_que_darle_permisos: {
              await duplicateFileIfNotExists(
                `${__dirname}/../src/DevBinaryV6/Utils/core/dev-run.js`,
                `${targetDir}/dev/run.js`,
              );
              await fs.promises.chmod(`${targetDir}/dev/run.js`, "755");
            }

            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/index.html`,
              `${targetDir}/src/www/index.html`,
            );
            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/app.js`,
              `${targetDir}/src/www/app.entry.js`,
            );
            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/app.css`,
              `${targetDir}/src/www/app.entry.css`,
            );
            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/settings.js`,
              `${targetDir}/dev/settings.js`,
            );
            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/devbin-test.js`,
              `${targetDir}/dev/bin/test/command.js`,
            );
            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/www-settings.js`,
              `${targetDir}/src/www/dev/settings.entry.js`,
            );
            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/www-settings.js`,
              `${targetDir}/dist/www/dev/settings.dist.js`,
            );
            await duplicateFileIfNotExists(
              `${__dirname}/../src/DevBinaryV6/Utils/core/controllers.js`,
              `${targetDir}/dev/controllers.js`,
            );

            await duplicateFile(
              `${__dirname}/moduler-v6.dist.js`,
              `${targetDir}/src/www/external/moduler-v6.entry.js`,
            );
            await duplicateFile(
              `${__dirname}/moduler-v6.dist.js`,
              `${targetDir}/dist/www/external/moduler-v6.dist.js`,
            );
            await duplicateFile(
              `${__dirname}/moduler-v6.dist.js`,
              `${targetDir}/docs/dist/www/external/moduler-v6.dist.js`,
            );
            await duplicateFile(
              `${__dirname}/moduler-v6.dist.js`,
              `${targetDir}/src/external/moduler-v6.entry.js`,
            );
            await duplicateFile(
              `${__dirname}/compiler-v6.dist.js`,
              `${targetDir}/src/external/compiler-v6.entry.js`,
            );
            await duplicateFile(
              `${__dirname}/dev-binary-v6.dist.js`,
              `${targetDir}/src/external/dev-binary-v6.entry.js`,
            );
            await duplicateFile(
              `${__dirname}/refrescador.dist.js`,
              `${targetDir}/src/external/refrescador.entry.js`,
            );
            await duplicateDirectory(
              `${__dirname}/refrescador`,
              `${targetDir}/src/external/refrescador`,
              { recursive: true },
            );

            if (parameters.installDependencies)
              await this.installNpmDependencies([], targetDir);

            return { targetDir };
          }
          /**
           * @name DevBinaryV6.Utils.prototype.existsFile
           * @type
           * @description
           */
          existsFile(file) {
            return require("fs")
              .promises.access(file)
              .then(() => true)
              .catch((error) => false);
          }
          /**
           * @name DevBinaryV6.Utils.prototype.triggerCallbackFromFile
           * @type
           * @description
           */
          async triggerCallbackFromFile(
            file,
            injection = {},
            dontThrow = false,
          ) {
            if (!(await this.existsFile(file))) {
              return -1;
            }
            const callback = require(file);
            this.assert(
              typeof callback === "function",
              `File «${file}» should export a function on «DevBinaryV6.Utils.prototype.triggerCallbackFromFile»`,
            );
            return await callback.call(this, {
              devbin: this.devbin,
              ...injection,
            });
          }
          /**
           * @name DevBinaryV6.Utils.prototype.instrumentCode
           * @type
           * @description
           */
          instrumentCode(code, filename) {
            const { createInstrumenter } = require("istanbul-lib-instrument");
            const instrumenter = createInstrumenter({
              produceSourceMap: true,
              esModules: true,
            });
            const instrumented = instrumenter.instrumentSync(code, filename);
            return instrumented;
          }
          /**
           * @name DevBinaryV6.Utils.prototype.globOf
           * @type
           * @description
           */
          globOf(globPatterns) {
            return {
              matcher: require("picomatch")(globPatterns),
              matches(file) {
                return this.matcher(file);
              },
            };
          }
          /**
           * @name DevBinaryV6.Utils.prototype.exportDevSettings
           * @type
           * @description
           */
          async exportDevSettings(filepath) {
            try {
              const fs = require("fs");
              const settingsAsyncFactory = require(filepath);
              const settingsData =
                typeof settingsAsyncFactory === "function"
                  ? await settingsAsyncFactory({ devbin: this.devbin })
                  : settingsAsyncFactory;
              /*
    // @ANTES:
    const publicableSettings = this.constructor.removeNullPropertiesFromObject({
      env: settingsData.env ?? null,
      instrumentalize: settingsData.instrumentalize ?? null,
      traceExternalSources: settingsData.traceExternalSources ?? null,
      sectionsMap: settingsData.sectionsMap ?? null,
    });
    //*/
              // @AHORA:
              const publicableSettingsData = {};
              for (
                let indexProp = 0;
                indexProp < this.publicableSettingsIds.length;
                indexProp++
              ) {
                const publicableProp = this.publicableSettingsIds[indexProp];
                publicableSettingsData[publicableProp] =
                  settingsData[publicableProp] ?? null;
              }
              const publicableSettings =
                this.constructor.removeNullPropertiesFromObject(
                  publicableSettingsData,
                );
              //////////////////////////////
              const publicableJson = this.devbin.compiler.fullpathOf(
                "@/dist/www/dev/settings/publicable.json",
              );
              await this.ensureDirectoryOf(publicableJson);
              await fs.promises.writeFile(
                publicableJson,
                JSON.stringify(publicableSettings, null, 2),
                "utf8",
              );
            } catch (error) {
              console.log("[!] Error loading settings:", error);
            }
          }
          /**
           * @name DevBinaryV6.Utils.prototype.copyFile
           * @type
           * @description
           */
          copyFile(src, dst) {
            return require("fs").promises.copyFile(
              this.devbin.moduler.normalizationOf(src),
              this.devbin.moduler.normalizationOf(dst),
            );
          }
          /**
           * @name DevBinaryV6.Utils.prototype.matchesFileWithSimpleSelector
           * @type
           * @description
           */
          matchesFileWithSimpleSelector(filepath, selectors = []) {
            this.assert(
              Array.isArray(selectors),
              "Parameter «selectors» must be array on «DevBinaryV6.Utils.prototype.matchesFileWithSimpleSelector»",
            );
            return selectors.some((selector, index) => {
              this.assert(
                typeof selector === "string",
                `All selectors must be strings but on index «${index}» there is a «${typeof selector}»`,
              );
              if (selector.startsWith("^")) {
                return filepath.startsWith(selector.slice(1));
              }
              return filepath.includes(selector);
            });
          }
          /**
           * @name DevBinaryV6.Utils.prototype.publicableSettingsIds
           * @type
           * @description
           */
          publicableSettingsIds = [
            "env",
            "instrumentalize",
            "traceExternalSources",
            "sectionsMap",
            "test",
          ];
          /**
           * @name DevBinaryV6.Utils.prototype.installNpmDependencies
           * @type
           * @description
           */
          async installNpmDependencies(
            files,
            rootdir = this.devbin.moduler.rootdir,
          ) {
            const { exec } = require("child_process");
            const { promisify } = require("util");
            const execAsync = promisify(exec);
            const command =
              "npm install" + (files ? ` ${files.join(" ")}` : "");
            const { stdout, stderr } = await execAsync(command, {
              cwd: rootdir,
            });
            if (stderr) throw stderr;
            return stdout;
          }

          /**
           * @name DevBinaryV6.Utils.prototype.synchronizeSplittableClass
           * @type Function
           * @description
           * Sincroniza una clase JavaScript con una estructura de ficheros
           * donde cada miembro de la clase puede vivir en su propio fichero.
           */
          async synchronizeSplittableClass(filepath, event) {
            const fs = require("fs").promises;
            const path = require("path");
            const parser = require("@babel/parser");
            const classDirectory = path.dirname(filepath);
            try {
              // ------------------------------------------------------------
              // 0. Mutear el directorio por si se vienen cambios
              // ------------------------------------------------------------
              await this.devbin.muteTouchListenerOf(`${classDirectory}/**/*`);
              // ------------------------------------------------------------
              // 1. Leer filepath
              // ------------------------------------------------------------
              const source = await fs.readFile(filepath, "utf8");
              // ------------------------------------------------------------
              // 2. Parsear filepath como JavaScript
              // ------------------------------------------------------------
              const ast = parser.parse(source, {
                sourceType: "unambiguous",
                plugins: [
                  "classProperties",
                  "classPrivateProperties",
                  "classStaticBlock",
                  "decorators-legacy",
                ],
              });
              // ------------------------------------------------------------
              // 3. Comprobar que únicamente tiene 1 class
              // ------------------------------------------------------------
              const classes = [];

              function walk(node) {
                if (!node || typeof node !== "object") {
                  return;
                }
                if (
                  node.type === "ClassDeclaration" ||
                  node.type === "ClassExpression"
                ) {
                  classes.push(node);
                }
                for (const key of Object.keys(node)) {
                  if (key === "loc" || key === "start" || key === "end") {
                    continue;
                  }
                  const value = node[key];
                  if (Array.isArray(value)) {
                    for (const child of value) {
                      walk(child);
                    }
                  } else if (value && typeof value === "object") {
                    walk(value);
                  }
                }
              }
              walk(ast);
              if (classes.length !== 1) {
                throw new Error(
                  `synchronizeSplittableClass(): se esperaba exactamente una clase en "${filepath}", pero se encontraron ${classes.length}.`,
                );
              }
              const classNode = classes[0];
              const className = classNode.id?.name || "AnonymousClass";
              // ------------------------------------------------------------
              // Directorio donde vivirán los fragmentos
              // ------------------------------------------------------------
              await fs.mkdir(classDirectory, { recursive: true });
              // ------------------------------------------------------------
              // 4. Extraer miembros
              // ------------------------------------------------------------
              const members = [];
              for (const member of classNode.body.body) {
                // --------------------------------------------------------
                // Constructor
                // --------------------------------------------------------
                if (
                  member.type === "ClassMethod" &&
                  member.kind === "constructor"
                ) {
                  members.push({
                    kind: "constructor",
                    name: "constructor",
                    filename: "constructor.js",
                    node: member,
                  });
                  continue;
                }
                // --------------------------------------------------------
                // Método estático / prototipo
                // --------------------------------------------------------
                if (
                  member.type === "ClassMethod" ||
                  member.type === "ClassPrivateMethod"
                ) {
                  let name;
                  if (member.key.type === "Identifier") {
                    name = member.key.name;
                  } else if (member.key.type === "StringLiteral") {
                    name = member.key.value;
                  } else if (member.key.type === "NumericLiteral") {
                    name = String(member.key.value);
                  } else if (member.key.type === "PrivateName") {
                    name = `#${member.key.id.name}`;
                  } else {
                    throw new Error(
                      `No se puede determinar el nombre de un miembro de "${className}".`,
                    );
                  }
                  const kind = member.static ? "static" : "prototype";
                  members.push({
                    kind,
                    name,
                    filename: `${kind}.${name}.js`,
                    node: member,
                  });
                  continue;
                }
                // --------------------------------------------------------
                // Propiedad de clase
                // --------------------------------------------------------
                if (
                  member.type === "ClassProperty" ||
                  member.type === "ClassPrivateProperty"
                ) {
                  let name;
                  if (member.key.type === "Identifier") {
                    name = member.key.name;
                  } else if (member.key.type === "PrivateName") {
                    name = `#${member.key.id.name}`;
                  } else if (member.key.type === "StringLiteral") {
                    name = member.key.value;
                  } else {
                    throw new Error(
                      `No se puede determinar el nombre de la propiedad de "${className}".`,
                    );
                  }
                  const kind = member.static ? "static" : "prototype";
                  members.push({
                    kind,
                    name,
                    filename: `${kind}.${name}.js`,
                    node: member,
                  });
                  continue;
                }
                // --------------------------------------------------------
                // static {}
                // --------------------------------------------------------
                if (member.type === "StaticBlock") {
                  members.push({
                    kind: "static",
                    name: "block",
                    filename: "static.block.js",
                    node: member,
                  });
                  continue;
                }
                throw new Error(
                  `Miembro de clase no soportado: ${member.type}`,
                );
              }
              // ------------------------------------------------------------
              // 5. Determinar contenido de cada miembro
              // ------------------------------------------------------------
              for (const member of members) {
                if (
                  (member.node.type === "ClassProperty" ||
                    member.node.type === "ClassPrivateProperty") &&
                  member.node.value?.type === "NullLiteral"
                ) {
                  member.content = null;
                } else {
                  member.content = source.slice(
                    member.node.start,
                    member.node.end,
                  );
                }
              }
              // ------------------------------------------------------------
              // 6. Sincronización
              // ------------------------------------------------------------
              let reconstructedClass = `class ${className} {\n\n`;
              for (const member of members) {
                const targetFile = path.join(classDirectory, member.filename);
                let content;
                // --------------------------------------------------------
                // Si el fichero de origen contiene el miembro, lo usamos
                // y actualizamos su fragmento.
                // --------------------------------------------------------
                if (member.content !== null) {
                  content = member.content;
                  await fs.writeFile(
                    targetFile,
                    this.getMemberFragmentCodeFor(content, member),
                    "utf8",
                  );
                }
                // --------------------------------------------------------
                // Si no hay contenido, intentamos recuperar el fragmento
                // existente.
                // --------------------------------------------------------
                else {
                  try {
                    content = await fs.readFile(targetFile, "utf8");
                  } catch (error) {
                    if (error.code === "ENOENT") {
                      content = "";
                    } else {
                      throw error;
                    }
                  }
                }
                // --------------------------------------------------------
                // Añadir el miembro a la clase reconstruida
                // --------------------------------------------------------
                if (content.trim()) {
                  reconstructedClass += content.trimEnd() + "\n\n";
                }
              }
              reconstructedClass += "}\n";
              // ------------------------------------------------------------
              // 7. Escribir la clase reconstruida
              // ------------------------------------------------------------
              reconstructedClass =
                await this.devbin.compiler.constructor.beautifyJs(
                  reconstructedClass,
                );
              await fs.writeFile(filepath, reconstructedClass, "utf8");
              return {
                filepath,
                className,
                classDirectory,
                members: members.map((member) => ({
                  kind: member.kind,
                  name: member.name,
                  filename: member.filename,
                })),
              };
            } catch (error) {
              // throw error;
            } finally {
              // ------------------------------------------------------------
              // 8. Desmutear el directorio porque los cambios han terminado
              // ------------------------------------------------------------
              await this.devbin.unmuteTouchListenerOf(`${classDirectory}/**/*`);
            }
          }
          /**
           * @name DevBinaryV6.Utils.prototype.getMemberFragmentCodeFor
           * @type
           * @description
           */
          getMemberFragmentCodeFor(content, member) {
            console.log(member);
            return content;
          }
          /**
           * @name DevBinaryV6.Utils.constructor
           * @type
           * @description
           */
          constructor(devbin) {
            this.devbin = devbin;
          }
        };
      /**
       * @name DevBinaryV6.static.ShadowCommands
       * @type
       * @description
       */
      static ShadowCommands =
        /**
         * @name DevBinaryV6.ShadowCommands.class
         * @type
         * @description
         */
        class DevBinaryV6ShadowCommands {
          /**
           * @name DevBinaryV6.ShadowCommands.constructor
           * @type
           * @description
           */
          constructor(devbin) {
            this.devbin = devbin;
          }
          /**
           * @name DevBinaryV6.ShadowCommands.prototype.assert
           * @type
           * @description
           */
          assert(...args) {
            return this.devbin.assert(...args);
          }
          /**
           * @name DevBinaryV6.ShadowCommands.prototype.new project
           * @type
           * @description
           */
          "new project"(args, devbin) {
            const parameters = devbin.utils.formatCliArgs(
              {
                from: {
                  onFormat: devbin.constructor.Formatters.asString,
                  default: false,
                  alias: ["-f"],
                  description:
                    "Empty directory from which to start the new project",
                },
                installDependencies: {
                  onFormat: devbin.constructor.Formatters.asBoolean,
                  default: false,
                  alias: ["-i"],
                  description: "Runs «npm install» once all files are ensured",
                },
              },
              args,
            );

            this.assert(
              typeof parameters.from === "string",
              `Parameter «--from» is required as string on «DevBinaryV6.ShadowCommands.prototype['new project']»`,
            );

            return devbin.utils.ensureCoreFrom(parameters.from, {
              ignoreErrors: 0,
              allowDirtyDirectory: 0,
            });
          }
          /**
           * @name DevBinaryV6.ShadowCommands.prototype.ensure core
           * @type
           * @description
           */
          async "ensure core"(args, devbin) {
            const parameters = devbin.utils.formatCliArgs(
              {
                from: {
                  onFormat: devbin.constructor.Formatters.asString,
                  default: false,
                  alias: ["-f"],
                  description:
                    "Any directory from which to ensure the core os a devbin project",
                },
                reset: {
                  onFormat: devbin.constructor.Formatters.asBoolean,
                  default: false,
                  alias: ["-r"],
                  description: "Overwrites all core files if used",
                },
                installDependencies: {
                  onFormat: devbin.constructor.Formatters.asBoolean,
                  default: false,
                  alias: ["-i"],
                  description: "Runs «npm install» once all files are ensured",
                },
              },
              args,
            );

            this.assert(
              typeof parameters.from === "string",
              `Parameter «--from» is required as string on «DevBinaryV6.ShadowCommands.prototype['ensure core']»`,
            );
            this.assert(
              typeof parameters.reset === "boolean",
              `Parameter «--reset» is required as boolean on «DevBinaryV6.ShadowCommands.prototype['ensure core']»`,
            );

            return devbin.utils.ensureCoreFrom(parameters.from, {
              ignoreErrors: 1,
              allowDirtyDirectory: 1,
              dontOverride: !parameters.reset,
            });
          }
          /**
           * @name DevBinaryV6.ShadowCommands.prototype["print root"]
           * @type
           * @description
           */
          "print root"(args, devbin) {
            console.log(devbin.compiler.rootdir);
          }
          /**
           * @name DevBinaryV6.ShadowCommands.prototype["build github pages"]
           * @type
           * @description
           */
          async "build github pages"(args, devbin) {
            await devbin.compiler.files.copyDirectory(
              "@/dist/www",
              "@/docs/dist/www",
            );
            await devbin.compiler.files.copyFile.try(
              "@/dist/www/index.html",
              "@/docs/index.html",
            );
            await devbin.compiler.files.copyFile.try(
              "@/dist/www/app.dist.js",
              "@/docs/app.dist.js",
            );
            await devbin.compiler.files.copyFile.try(
              "@/dist/www/app.dist.css",
              "@/docs/app.dist.css",
            );
          }
          /**
           * @name DevBinaryV6.ShadowCommands.prototype.loop
           * @type
           * @description
           */
          async loop(args) {
            const targetRoot =
              await this.devbin.utils.constructor.findFirstParentDirectoryContaining(
                process.cwd(),
                "package.json",
              );
            await this.devbin.settings.load();
            const port = this.devbin.settings.data?.loop?.port || 3005;
            const settingsControllers =
              this.devbin.settings.data?.loop?.controllers || [];
            const targetDirs = [
              require("path").resolve(targetRoot, "src"),
              require("path").resolve(targetRoot, "dev/settings.js"),
              require("path").resolve(targetRoot, "test/unit/src"),
              require("path").resolve(targetRoot, "test/feature"),
              require("path").resolve(targetRoot, "test/integrity"),
              require("path").resolve(targetRoot, "test/spontaneous"),
            ];
            const devControllersFile = `${targetRoot}/dev/controllers.js`;
            const devControllers = (await this.devbin.utils.existsFile(
              devControllersFile,
            ))
              ? [devControllersFile]
              : [];
            return this.devbin.constructor.Refrescador.run({
              watch: targetDirs,
              bulletproof: false,
              ignore: [
                "**/node_modules/" + "**/*",
                "**/dist/" + "**/*",
                "**/*.dist.*",
                "**/logs/" + "**/*",
                "**/test/unit/" + "**/*",
                "dev/unlistened.json",
              ],
              port,
              debounce: 0,
              extensions: ["js", "css", "html", "md"],
              execute: ["dev/run.js touch --file @{refrescador.file}"],
              message: "El tiempo de refrescar ha llegado",
              messageFile: "TODO.md",
              payload: 'console.log("📟 Evento de refrescar activado");',
              ignoreCallback: `${targetRoot}/dev/unlistened.json`,
              // executeCallback: ["file/from/cwd/target.js",],
              // payloadFile: 'browser-payload.js',
              serve: this.devbin.compiler.fullpathOf("@/dist/www"),
              staticPath: "dist/www",
              urlPrefix: "/",
              controllers: [...devControllers, ...settingsControllers],
            });
          }
          /**
           * @name DevBinaryV6.ShadowCommands.prototype.touch
           * @type
           * @description
           */
          touch(args) {
            const parameters = this.devbin.utils.formatCliArgs(
              {
                file: {
                  onFormat: this.devbin.constructor.Formatters.asString,
                  default: false,
                  alias: ["-f"],
                  description: "Target file. Must be js, css or md.",
                },
                trace: {
                  onFormat: this.devbin.constructor.Formatters.asString,
                  default: false,
                  alias: ["-t"],
                  description: "Message to use as traceable property.",
                },
                uncacheInjections: {
                  onFormat: this.devbin.constructor.Formatters.asBoolean,
                  default: false,
                  alias: ["-ui"],
                  description:
                    "To not use cache for files type «.entry.js». Defaults to false, so, it is used by default.",
                },
              },
              args,
            );
            this.assert(
              typeof parameters.file === "string",
              `Parameter «--file» is required as string on «DevBinaryV6.ShadowCommands.prototype.touch»`,
            );
            return this.devbin.utils.touchFile(parameters.file, {
              uncacheInjections: parameters.uncacheInjections,
              isRoot: true,
            });
          }
        };
      /**
       * @name DevBinaryV6.static.ShadowFileEvents
       * @type
       * @description
       */
      static ShadowFileEvents =
        /**
         * @name DevBinaryV6.ShadowFileEvents.ShadowFileEvents.class
         * @type
         * @description
         */
        class ShadowFileEvents {
          /**
           * @name DevBinaryV6.ShadowFileEvents.constructor
           * @type
           * @description
           */
          constructor(devbin) {
            this.devbin = devbin;
          }
        };
      /**
       * @name DevBinaryV6.static.Formatters
       * @type
       * @description
       */
      static Formatters = {
        asString: function (values) {
          return values.at(-1);
        },
        asBoolean: function (values) {
          return true;
        },
      };
      /**
       * @name DevBinaryV6.static.Settings
       * @type
       * @description
       */
      static Settings = class DevBinaryV6Settings extends ModulerV6.Settings {
        /**
         * @name DevBinaryV6.Settings
         * @type
         * @description
         */
        /**
         * @name DevBinaryV6.Settings.constructor
         * @type
         * @description
         */
        constructor(devbin) {
          super(devbin.moduler);
          /**
           * @name DevBinaryV6.Settings.prototype.devbin
           * @type
           * @description
           */
          this.devbin = devbin;
        }
        /**
         * @name DevBinaryV6.Settings.prototype.load
         * @type
         * @description
         */
        async load(forceReload = false) {
          if (!forceReload && this.data) {
            return this.data;
          }
          const settingsPath =
            this.devbin.compiler.fullpathOf("@/dev/settings.js");
          const exists = await this.devbin.utils.existsFile(settingsPath);
          if (!exists) {
            return this.data;
          }
          const settingsModule = require(settingsPath);
          const settings =
            typeof settingsModule === "function"
              ? await settingsModule.call(this.devbin)
              : settingsModule;
          return (this.data = Object.assign({}, settings));
        }
      };
      /**
       * @name DevBinaryV6.static.Tester
       * @type
       * @description
       */
      static Tester =
        /**
         * @name DevBinaryV6.Tester.class
         * @type
         * @description
         */
        class Tester {
          constructor(devbin) {
            /**
             * @name DevBinaryV6.Tester.constructor
             * @type
             * @description
             */
            /**
             * @name DevBinaryV6.Tester.prototype.devbin
             * @type
             * @description
             */
            this.devbin = devbin;
          }
          async runDirectory(dirInput, options = {}) {
            /**
             * @name DevBinaryV6.Tester.prototype.runDirectory
             * @type
             * @description
             */
            const {
              filter = false,
              ignore = ["runner.js"],
              injection = {},
              title = false,
              filename = false,
            } = options;
            Validate_properties_because_it_is_faulty: {
              const validOptions = [
                "filter",
                "ignore",
                "injection",
                "title",
                "filename",
              ];
              for (let prop in options) {
                this.devbin.assert(
                  validOptions.includes(prop),
                  `Parameter «options» does not accept property «${prop}» on «DevBinaryV6.Tester.prototype.runDirectory»`,
                );
              }
            }
            const fs = require("fs");
            const path = require("path");
            const ERROR_SEPARATOR = `\n - `;
            const dir = this.devbin.compiler.normalizationOf(dirInput);
            const testsType = title || path.basename(dir);
            const testFiles = (await fs.promises.readdir(dir)).filter(
              (file) => {
                // const endsWithJs = file.endsWith(".js");
                const isNotIgnored = !ignore.includes(file);
                const passesFilter = filter ? filter(file) : true;
                return isNotIgnored && passesFilter;
              },
            );
            const ansiTool = this.devbin.compiler.constructor.ansi.colors;
            console.log(
              `[*] DevBinaryV6 found ${testFiles.length} tests` +
                (title ? ` for «${title}»` : ""),
            );
            const errors = [];
            const crono = this.devbin.constructor.Cronometer();
            for (let index = 0; index < testFiles.length; index++) {
              const testName = testFiles[index];
              const testFile =
                `${dir}/${testName}` + (filename ? `/${filename}` : "");
              console.log(
                ansiTool
                  .style("cyanBright,italic")
                  .text(
                    `🟢 Starting «${testName}» [${testsType}:${index + 1}/${testFiles.length}]`,
                  ),
              );
              let testCallback;
              try {
                const _testCallback = require(testFile);
                this.devbin.compiler.assert(
                  typeof _testCallback === "function",
                  `Test type «${testsType}» with name «${testName}» must export a callback`,
                );
                testCallback = _testCallback;
              } catch (error) {
                const expression = `🟣 Bad exportation on «${testsType}:${index}» named «${testName}»${ERROR_SEPARATOR}${error.name}: ${error.message}${ERROR_SEPARATOR}${error.stack}`;
                console.log(
                  ansiTool.style("red,italic").text(ansiTool.box(expression)),
                );
                errors.push({ test: testName, error, expression });
              }
              if (testCallback) {
                const testId = `${testsType}@${index}:${testName}`;
                const testCronometer = crono(testId).open("Started");
                try {
                  await testCallback({
                    // clases:
                    DevBinaryV6: this.devbin.constructor,
                    CompilerV6: this.devbin.compiler.constructor,
                    ModulerV6: this.devbin.moduler.constructor,
                    // instancias:
                    devBinaryV6: this.devbin,
                    compilerV6: this.devbin.compiler,
                    modulerV6: this.devbin.moduler,
                    // custom:
                    ...injection,
                  });
                  testCronometer.stop("Success");
                  const expression = `🟢 Done: «${testName}» [${testsType}:${index + 1}/${testFiles.length}] [⏳=${testCronometer.milliseconds()}]`;
                  console.log(ansiTool.style("green,italic").text(expression));
                } catch (error) {
                  testCronometer.stop("Failure");
                  const expression = `🔴 Failed «${testName}» [${testsType}:${index + 1}/${testFiles.length}]${ERROR_SEPARATOR}${error.name}: ${error.message}${ERROR_SEPARATOR}${error.stack}`;
                  console.log(ansiTool.style("red,italic").text(expression));
                  errors.push({ test: testName, error, expression });
                }
              }
            }
            if (testFiles.length) {
              if (errors.length) {
                console.log(
                  ansiTool
                    .style("cyan")
                    .text(`⚠️  Errors report of «${testsType}» tests:`),
                );
                for (let index = 0; index < errors.length; index++) {
                  const { test, error, expression } = errors[index];
                  console.log(
                    ansiTool
                      .style("magenta")
                      .text(
                        ansiTool.box(
                          `  - Error nº${index + 1}/${errors.length}: ${ERROR_SEPARATOR}` +
                            expression,
                        ),
                      ),
                  );
                }
              } else {
                console.log(
                  ansiTool
                    .style("greenBright,bold")
                    .text(
                      ansiTool.box(
                        `💎 No errors reported on «${testsType}» tests`,
                      ),
                    ),
                );
              }
            }
          }
        };
      /**
       * @name DevBinaryV6.prototype.cronometer
       * @type
       * @description
       */
      cronometer = this.constructor.Cronometer();
      /**
       * @name DevBinaryV6.prototype.assert
       * @type
       * @description
       */
      assert(...args) {
        return this.moduler.assert(...args);
      }
      /**
       * @name DevBinaryV6.prototype.command
       * @type
       * @description
       */
      async command(args = []) {
        let commandParameters,
          commandSubpath,
          commandCallback,
          commandType,
          commandId,
          commandName;
        Extract_command_parameters: {
          if (Array.isArray(args)) {
            commandParameters = this.utils.parseCliArgs(args);
            break Extract_command_parameters;
          } else if (typeof args === "object") {
            commandParameters = args;
            break Extract_command_parameters;
          }
          throw new Error(
            `Parameter «args» must be array or object but «${typeof args}» was found instead on «DevBinary.prototype.command»`,
          );
        }
        Extract_command_id: {
          commandId = commandParameters._.join("/");
          commandName = commandParameters._.join(" ");
        }
        Define_path_from_command: {
          commandSubpath = this.compiler.normalizationOf(
            `@/dev/bin/${commandId}/command.js`,
          );
        }
        Load_command_callback_from_file_or_shadowCommands: {
          let isReadable = undefined;
          First_file: {
            try {
              // Check if its readable:
              await require("fs").promises.readFile(commandSubpath, "utf8");
              isReadable = true;
            } catch (error) {
              isReadable = false;
            }
          }
          Second_hook: {
            if (isReadable) {
              commandType = "file";
              commandCallback = require(commandSubpath);
            } else {
              commandType = "hook";
              if (commandName in this.shadowCommands) {
                commandCallback = this.shadowCommands[commandName];
                break Load_command_callback_from_file_or_shadowCommands;
              }
              const errorMessage = `Error of «devbin command not found» for parameters «${commandId}»`;
              throw new Error(errorMessage);
            }
          }
        }
        Execute_command_callback: {
          try {
            console.log(`[*] DevBinaryV6 executing command: ${commandName}`);
            return await commandCallback.call(
              this.shadowCommands,
              commandParameters,
              this,
              commandType,
              commandSubpath,
            );
          } catch (error) {
            console.error(
              `[!] The «devbin ${commandName}» command threw an error:`,
              error,
            );
            throw error;
          }
        }
      }
      /**
       * @name DevBinaryV6.prototype.selfDispatch
       * @type
       * @description
       */
      selfDispatch() {
        return this.command([...process.argv].splice(2));
        throw new Error("Method «selfDispatch» is not coded yet");
      }
      /**
       * @name DevBinaryV6.prototype.cloneForFile
       * @type
       * @description
       */
      cloneForFile(resource, devbin = false) {
        this.assert(
          typeof resource === "string",
          "Parameter «resource» must be string on «DevBinaryV6.prototype.cloneForFile»",
        );
        const dirpath = require("path").dirname(
          this.compiler.fullpathOf(resource),
        );
        const clone = new this.constructor(dirpath, devbin);
        return clone;
      }
      /**
       * @name DevBinaryV6.prototype.muteTouchListenerOf
       * @type
       * @description
       */
      async muteTouchListenerOf(filepattern) {
        const unlistenedFile = this.moduler.normalizationOf(
          "@/dev/unlistened.json",
        );
        try {
          let unlistenedList = [];
          if (await this.utils.existsFile(unlistenedFile)) {
            unlistenedList = JSON.parse(
              await require("fs").promises.readFile(unlistenedFile, "utf8"),
            );
          }
          if (!unlistenedList.includes(filepattern)) {
            unlistenedList.push(filepattern);
          }
          await require("fs").promises.writeFile(
            unlistenedFile,
            JSON.stringify(unlistenedList, null, 2),
            "utf8",
          );
        } catch (error) {
          console.log(
            `[!] Could not mute filepattern «${filepattern}» due to following error:`,
            error,
          );
        }
      }
      /**
       * @name DevBinaryV6.prototype.unmuteTouchListenerOf
       * @type
       * @description
       */
      async unmuteTouchListenerOf(filepattern) {
        const unlistenedFile = this.moduler.normalizationOf(
          "@/dev/unlistened.json",
        );
        try {
          let unlistenedList = [];
          if (await this.utils.existsFile(unlistenedFile)) {
            unlistenedList = JSON.parse(
              await require("fs").promises.readFile(unlistenedFile, "utf8"),
            );
          }
          const pos = unlistenedList.indexOf(filepattern);
          if (pos !== -1) {
            unlistenedList.splice(pos, 1);
          }
          await require("fs").promises.writeFile(
            unlistenedFile,
            JSON.stringify(unlistenedList, null, 2),
            "utf8",
          );
        } catch (error) {
          console.log(
            `[!] Could not unmute filepattern «${filepattern}» due to following error:`,
            error,
          );
        }
      }
      /**
       * @name DevBinaryV6.static.globalInstance
       * @type
       * @description
       */
      static globalInstance = new DevBinaryV6();
      /**
       * @name DevBinaryV6.constructor
       * @type
       * @description
       */
      constructor(basedir, parent = null) {
        /**
         * @name DevBinaryV6.prototype.compiler
         * @type
         * @description
         */
        this.compiler = new CompilerV6(
          basedir || process.cwd(),
          ...(parent ? [parent.compiler] : []),
        );
        /**
         * @name DevBinaryV6.prototype.moduler
         * @type
         * @description
         */
        this.moduler = this.compiler.moduler;
        /**
         * @name DevBinaryV6.prototype.utils
         * @type
         * @description
         */
        this.utils = parent ? parent.utils : new this.constructor.Utils(this);
        /**
         * @name DevBinaryV6.prototype.settings
         * @type
         * @description
         */
        this.settings = new this.constructor.Settings(this);
        /**
         * @name DevBinaryV6.prototype.shadowCommands
         * @type
         * @description
         */
        this.shadowCommands = parent
          ? parent.shadowCommands
          : new this.constructor.ShadowCommands(this);
        /**
         * @name DevBinaryV6.prototype.shadowFileEvents
         * @type
         * @description
         */
        this.shadowFileEvents = parent
          ? parent.shadowFileEvents
          : new this.constructor.ShadowFileEvents(this);
        /**
         * @name DevBinaryV6.prototype.tester
         * @type
         * @description
         */
        this.tester = parent
          ? parent.tester
          : new this.constructor.Tester(this);
      }
    };
  }.call(),
);
