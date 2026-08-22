var mod;

mod = function() {
  return class ModulerV6 {
    static Tracer=class {
      static create(...args) {
        return new this(...args);
      }
      constructor(id = null, parent = null) {
        this.level = 0, parent && Object.assign(this, parent), this.id = id || "mv6-" + ModulerV6._getRandomString(5);
      }
      trace=Object.assign(method => {
        console.log(`[·] [${this.id}] [${this.level}] [=] ${method}`);
      }, {
        in: method => {
          console.log(`[·] [${this.id}] [${++this.level}] [+] ${method}`);
        },
        out: method => {
          console.log(`[·] [${this.id}] [${--this.level}] [-] ${method}`);
        },
        error: (method, error) => {
          console.log(`[!] [${this.id}] [${this.level}] [!] ${method}`, error);
        }
      });
      subtracer(id) {}
    };
    static tracer=this.Tracer.create("ModulerV6");
    static createResolvable() {
      let promise, resolve, reject;
      return promise = new Promise((_resolve, _reject) => {
        resolve = _resolve, reject = _reject;
      }), {
        promise: promise,
        resolve: resolve,
        reject: reject
      };
    }
    static onLoaded=this.createResolvable();
    static Runtime=class Runtime {
      constructor(owner) {}
      static onLoaded=ModulerV6.createResolvable();
      cache={
        isLoaded: !1
      };
      get env() {
        return ModulerV6.globalInstance.settings.data?.env || "unknown";
      }
      get isDev() {
        return "boolean" == typeof this.cache.isDev ? this.cache.isDev : ModulerV6.globalInstance.settings.data?.env ? this.cache.isDev = "dev" === ModulerV6.globalInstance.settings.data?.env : void 0;
      }
      get isTest() {
        return "boolean" == typeof this.cache.isTest ? this.cache.isTest : ModulerV6.globalInstance.settings.data?.env ? this.cache.isTest = "test" === ModulerV6.globalInstance.settings.data?.env : void 0;
      }
      get isProd() {
        return "boolean" == typeof this.cache.isProd ? this.cache.isProd : ModulerV6.globalInstance.settings.data?.env ? this.cache.isProd = "prod" === ModulerV6.globalInstance.settings.data?.env : void 0;
      }
      get isBrowser() {
        return "boolean" == typeof this.cache.isBrowser ? this.cache.isBrowser : this.cache.isBrowser = "undefined" != typeof window && void 0 !== window.location;
      }
      get isNodejs() {
        return "boolean" == typeof this.cache.isNodejs ? this.cache.isNodejs : this.cache.isNodejs = "undefined" != typeof require && "undefined" != typeof __dirname;
      }
      get hasCompilerV6() {
        return "undefined" != typeof CompilerV6;
      }
      get hasDevBinaryV6() {
        return "undefined" != typeof DevBinaryV6;
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
        return this.cache.isLoaded ? this.cache.isLoaded : Promise.all([ ModulerV6.globalInstance.settings.load() ]).then(output => (this.cache.isLoaded = output, 
        this));
      }
      static load() {
        return this.globalInstance.load();
      }
      static globalInstance=new this;
      static {
        (async () => {
          await ModulerV6.onLoaded.promise, await Runtime.load(), Runtime.onLoaded.resolve();
        })();
      }
    };
    static AssertionError=class extends Error {
      constructor(message) {
        super(message), this.name = "AssertionError";
      }
    };
    static CssManager=class {
      constructor(moduler, cloneOfCssManager = null) {
        this.trace("constructor", arguments), this.assert("object" == typeof moduler, "Parameter «moduler» must be object on «CssManager.constructor»"), 
        this.assert(moduler instanceof ModulerV6, "Parameter «moduler» must be instance of ModulerV6 on «CssManager.constructor»"), 
        this.moduler = moduler, this.sheets = {}, this.parser = TextParserV1.create(ModulerV6.defaultGrammars.forCssOnRuntime), 
        this._isTracing = !0;
      }
      async _addRecursively(fileBrute, addEvent = {
        sheets: {}
      }) {
        let file, source, tokens;
        if (file = this.moduler.rootdirOf(fileBrute), file in this.sheets) return this.sheets[file];
        if (file in addEvent.sheets) return addEvent.sheets[file];
        addEvent.sheets[file] = {
          priority: void 0
        }, source = await this._fetchSheet(file), addEvent.sheets[file].source = source, 
        tokens = await this._extractRequires(source, file), addEvent.sheets[file].tokens = tokens.formatted;
        {
          const loadedRequires = [];
          for (let index = 0; index < tokens.formatted.length; index++) {
            const requiresToken = tokens.formatted[index], requiresPathBrute = JSON.parse(requiresToken.inner), requiresPath = this.moduler.rootdirOf(requiresPathBrute);
            loadedRequires.push(requiresPath);
            const submoduler = this.cloneForFile(requiresPath);
            requiresPath in this.sheets || await submoduler.css._addRecursively(requiresPath);
          }
          addEvent.sheets[file].requires = loadedRequires;
        }
        return addEvent.sheets[file].priority = Object.keys(this.sheets).length, Object.assign(this.sheets, addEvent.sheets);
      }
      _fetchSheet(file) {
        return this.moduler._readPath(file);
      }
      _extractRequires(source, file) {
        const matches = this.parser.parse(source);
        return matches.file = {
          original: file,
          absolute: this.moduler.normalizationOf(file),
          basedir: this.moduler.basedir,
          based: this.moduler.basedirOf(file),
          rootdir: this.moduler.rootdir,
          rooted: this.moduler.rootdirOf(file)
        }, matches;
      }
      trace(method, args = [], forceLog = !1) {
        (this._isTracing || forceLog) && console.log(`[css-manager][${method}] ${args.length} args: ${[ ...args ].map(arg => typeof arg).join(",")}`);
      }
      assert(condition, message) {
        if (!condition) throw new Error(message);
      }
      async add(input) {
        let output;
        if ("string" == typeof input) output = await this._addRecursively(input); else {
          if (!Array.isArray(input)) throw new Error("Parameter «arguments[0]» can only be string or array on «CssManager.prototype.add»");
          output = [];
          for (let index = 0; index < input.length; index++) {
            const item = input[index];
            this.moduler.assert("string" == typeof item, `Parameter «arguments[0][${index}]» must be string too on «CssManager.prototype.add»`);
            const result = await this._addRecursively(item);
            output.push(result);
          }
        }
        return output;
      }
      remove(file) {}
      synchronize() {
        return this.getSortedSheets().map(sheet => `\n/*!file:${JSON.stringify(sheet.id)}*/\n${sheet.source}`).join("\n").replace(/\/\*\@requires\:/g, "/*!requires:");
      }
      cloneForFile(file) {
        const submoduler = this.moduler.cloneForFile(file);
        return submoduler.css.sheets = this.sheets, submoduler;
      }
      getSortedSheets() {
        return Object.keys(this.sheets).map(id => ({
          id: id,
          ...this.sheets[id]
        })).sort((a, b) => a.priority - b.priority);
      }
    };
    static SectionsManager=class {
      constructor(root = {}) {
        this.root = root;
      }
      _assert(condition, message) {
        if (!condition) throw new Error(message);
      }
      _isPropertoid(it) {
        return [ "object", "function" ].includes(typeof it);
      }
      isNull(it) {
        return null === it;
      }
      _hasKey(obj, prop) {
        return prop in obj;
      }
      _splitPropertyPath(path) {
        return path.split("/").filter(Boolean);
      }
      _getPropertyAndHolder(path, throwOnMissing = !0, commingFromMethod = "_getPropertyAndHolder") {
        const keys = this._splitPropertyPath(path), last = keys.pop();
        let obj = this.root, counter = -1;
        for (const key of keys) {
          if (counter++, this.isNull(obj[key]) || !this._isPropertoid(obj[key])) {
            if (throwOnMissing) throw new Error(`Missing iterable intermediate property «${key}» at index «${counter}» of path «${path}» on «SectionsManager.prototype._getPropertyAndHolder called from method «SectionsManager.prototype.${commingFromMethod}»`);
            obj[key] = {};
          }
          obj = obj[key];
        }
        return {
          obj: obj,
          last: last
        };
      }
      has(path) {
        const ref = this._getPropertyAndHolder(path, !1, "has");
        return !!this._isPropertoid(ref.obj) && ref.last in ref.obj;
      }
      get(path, defaultValue = Error) {
        const ref = this._getPropertyAndHolder(path, !1, "get");
        if (this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.get»`), 
        !this._hasKey(ref.obj, ref.last)) {
          if (defaultValue === Error) throw new Error(`Could not find section property «${ref.last}» in path «${path}» on «SectionsManager.prototype.get»`);
          return defaultValue;
        }
        return ref.obj[ref.last];
      }
      set(path, value) {
        const ref = this._getPropertyAndHolder(path, !1, "set");
        return this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.set»`), 
        ref.obj[ref.last] = value;
      }
      initialize(path, value) {
        const ref = this._getPropertyAndHolder(path, !1, "initialize");
        return this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.initialize»`), 
        this._hasKey(ref.obj, ref.last) ? ref.obj[ref.last] : ref.obj[ref.last] = value;
      }
      overwrite(path, values = {}) {
        const ref = this._getPropertyAndHolder(path, !1, "overwrite");
        return this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.overwrite»`), 
        Object.assign(ref.obj[ref.last] ??= {}, values);
      }
      fill(path, values = {}) {
        const ref = this._getPropertyAndHolder(path, !1, "fill");
        return this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.fill»`), 
        ref.obj[ref.last] = Object.assign({}, values, ref.obj[ref.last] ??= {});
      }
      expand(path, values = {}) {
        const ref = this._getPropertyAndHolder(path, !1, "expand");
        this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.expand»`), 
        this._hasKey(ref.obj, ref.last) || (ref.obj[ref.last] = {});
        {
          this._assert(this._isPropertoid(ref.obj[ref.last]), `Could not expand last property «${ref.last}» in path «${path}» with more properties because the previous value is of type «${typeof ref.obj[ref.last]}» on «SectionsManager.prototype.expand»`);
          const val = ref.obj[ref.last];
          for (let prop in values) this._assert(!this._hasKey(val, prop), `Property «${prop}» under path «${path}» cannot be expanded because it is already initialized on «SectionsManager.prototype.expand»`);
        }
        return Object.assign(ref.obj[ref.last], values);
      }
      delete(path) {
        const ref = this._getPropertyAndHolder(path, !1, "delete");
        if (![ "object", "function" ].includes(typeof ref.obj)) throw new Error(`Cannot delete property «${ref.last}» of a holder of type «${typeof ref.obj}» of path «${path}» on «SectionsManager.prototype.delete»`);
        if (null === ref.obj) throw new Error(`Cannot delete property «${ref.last}» of a null value of path «${path}» on «SectionsManager.prototype.delete»`);
        return ref.obj instanceof Array ? ref.obj.splice(ref.last, 1) : delete ref.obj[ref.last], 
        ref.obj[ref.last];
      }
      reset() {
        return this.root = {}, this;
      }
    };
    static Settings=class {
      constructor(moduler) {
        this.moduler = moduler, this.data = null;
      }
      async load(forceReload = !1) {
        if (!forceReload && this.data) return this.data;
        try {
          const settings = await this.moduler.import("@/dist/www/dev/settings.dist.js");
          return this.data = "function" == typeof settings ? await settings.call(this) : settings;
        } catch (error) {
          console.log("[!] Could not load settings because:", error);
        }
      }
      async loadSilently(...args) {
        try {
          return await this.load(...args);
        } catch (error) {
          return error;
        }
      }
      async get(property = null, forceReload = !1) {
        return await this.load(forceReload), property ? this.data[property] : this.data;
      }
    };
    static Parser=function(mod) {
      return "undefined" != typeof window && (window.TextParserV1 = mod), "undefined" != typeof global && (global.TextParserV1 = mod), 
      mod;
    }(function() {
      return class {
        static default=this;
        static symbols={
          PARENTHESYS_BALANCE: {}
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
            if (void 0 !== grammar[2] && null !== grammar[2] || (grammar[2] = it => it), void 0 !== grammar[3] && null !== grammar[3] || (grammar[3] = {
              allowInside: !1,
              includeAppendix: void 0
            }), this.assert("object" == typeof grammar, `Grammar «${index}» must be object`), 
            this.assert("string" == typeof grammar[0], `Item «0» in grammar «${index}» must be string`), 
            this.assert("string" == typeof grammar[1] || "object" == typeof grammar[1], `Item «1» in grammar «${index}» must be string or object`), 
            this.assert("function" == typeof grammar[2], `Item «2» in grammar «${index}» must be function`), 
            this.assert("object" == typeof grammar[3], `Item «3» in grammar «${index}» must be object`), 
            "allowInside" in grammar[3] && void 0 !== grammar[3].allowInside && this.assert("boolean" == typeof grammar[3].allowInside, `Property «allowInside» in item «3» in grammar «${index}» must be boolean or none`), 
            "includeAppendix" in grammar[3] && void 0 !== grammar[3].includeAppendix) if (Array.isArray(grammar[3].includeAppendix)) for (let appendixIndex = 0; appendixIndex < grammar[3].includeAppendix.length; appendixIndex++) this.assert([ "string", "function" ].includes(typeof grammar[3].includeAppendix[appendixIndex]), `Property «includeAppendix» in item «3» in grammar «${index}» and in index «${appendixIndex}» must be string or function or none`); else this.assert([ "string", "function" ].includes(typeof grammar[3].includeAppendix), `Property «includeAppendix» in item «3» in grammar «${index}» must be array, string or function or none`);
          }
          this.grammars = grammars;
        }
        parse(text) {
          const tokens = this._extractTokens(text);
          return this._processTokens(text, tokens);
        }
        _getAppendixOffset(text, grammar, currentPosition, ender) {
          const allAppendixes = Array.isArray(grammar[3].includeAppendix) ? grammar[3].includeAppendix : [ grammar[3].includeAppendix ];
          for (let appendixIndex = 0; appendixIndex < allAppendixes.length; appendixIndex++) {
            const oneAppendix = allAppendixes[appendixIndex];
            if (text.startsWith(oneAppendix, currentPosition + ender.length)) return oneAppendix.length;
          }
          return 0;
        }
        _pushToken({state: state, starter: starter, currentPosition: currentPosition, countingFrom: countingFrom, enderLength: enderLength, text: text, extraOffset: extraOffset}) {
          const lastPosition = currentPosition + enderLength + extraOffset;
          return state.output.push({
            type: starter,
            location: [ state.position, lastPosition ],
            text: text.substring(state.position, lastPosition),
            inner: text.substring(countingFrom, currentPosition),
            outer: text.substring(state.position, lastPosition)
          });
        }
        _processTokens(text, tokens) {
          const formattedOutput = {
            size: text.length,
            text: text,
            tokens: tokens,
            formatted: []
          };
          for (let indexToken = 0; indexToken < tokens.length; indexToken++) {
            const token = tokens[indexToken];
            Iterating_grammars: for (let indexGrammar = 0; indexGrammar < this.grammars.length; indexGrammar++) {
              const grammar = this.grammars[indexGrammar];
              if (grammar[0] === token.type) {
                const formattedToken = grammar[2].call(this, token, formattedOutput, indexToken, grammar, indexGrammar, text);
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
            output: []
          };
          for (;state.position < text.length; ) {
            Iterating_grammars: for (let index = 0; index < this.grammars.length; index++) {
              const grammar = this.grammars[index], [starter, ender, formatter, options] = grammar;
              if (!text.startsWith(starter, state.position)) continue Iterating_grammars;
              const countingFrom = state.position + starter.length;
              let offset = 0, wasEnded = !1;
              Processing_match: if ("string" == typeof ender) {
                for (;countingFrom + offset <= text.length; ) {
                  const currentPosition = countingFrom + offset;
                  if (text.startsWith(ender, currentPosition) || currentPosition === text.length && !0 === options.enderCanBeEOF) {
                    wasEnded = !0, this._pushToken({
                      state: state,
                      starter: starter,
                      currentPosition: currentPosition,
                      countingFrom: countingFrom,
                      text: text,
                      enderLength: ender.length,
                      extraOffset: this._getAppendixOffset(text, grammar, currentPosition, ender)
                    });
                    break Processing_match;
                  }
                  offset++;
                }
                if (!wasEnded) throw new Error(`Unclosed starter of grammar «${starter}» reached end of text but «${ender}» was not found on grammar index «${index}»`);
              } else {
                if (ender !== this.constructor.symbols.PARENTHESYS_BALANCE) throw new Error(`Ender (2nd argument) of grammar «${starter}» at grammar index «${index}» has not valid type: «${typeof ender}»`);
                {
                  let openedParenthesys = 1, wasEnded = !1;
                  for (;countingFrom + offset < text.length; ) {
                    const currentPosition = countingFrom + offset;
                    if ("(" === text[currentPosition]) openedParenthesys++; else if (")" === text[currentPosition] && (openedParenthesys--, 
                    0 === openedParenthesys)) {
                      wasEnded = !0, this._pushToken({
                        state: state,
                        starter: starter,
                        currentPosition: currentPosition,
                        countingFrom: countingFrom,
                        text: text,
                        enderLength: 0,
                        extraOffset: this._getAppendixOffset(text, grammar, currentPosition, ender)
                      });
                      break Processing_match;
                    }
                    offset++;
                  }
                  if (!wasEnded) throw new Error(`Unclosed starter of grammar «${starter}» reached end of text but the first parenthesys was not closed on grammar index «${index}»`);
                }
              }
              options.allowInside ? state.position += starter.length : state.position += offset;
            }
            state.position++;
          }
          return state.output;
        }
      };
    }.call());
    static nativeGrammars={
      InjectSource: [ "$compiler.inject.source(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Inject Source",
          inner: token.inner,
          location: token.location
        };
      } ],
      InjectString: [ "$compiler.inject.string(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Inject String",
          inner: token.inner,
          location: token.location
        };
      } ],
      InjectTemplate: [ "$compiler.inject.template(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Inject Template",
          ...token
        };
      } ],
      InjectModule: [ "$compiler.inject.module(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Inject Module",
          ...token
        };
      } ],
      ImportJs: [ "$moduler.import(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Import",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      ExportJs: [ "$moduler.export(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Export",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      SectionGet: [ "$moduler.section.get(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Section Get",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      SectionSet: [ "$moduler.section.set(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Section Set",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      SectionOverwrite: [ "$moduler.section.overwrite(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Section Overwrite",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      SectionExpand: [ "$moduler.section.expand(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Section Expand",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      SectionFill: [ "$moduler.section.fill(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Section Fill",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      SectionHas: [ "$moduler.section.has(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Section Has",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      SectionInitialize: [ "$moduler.section.initialize(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
        return {
          syntax: "Moduler Section Initialize",
          ...token
        };
      }, {
        allowInside: !0
      } ],
      EmbeddedFormFieldOpener: [ "/*=¿", "*/", function(token) {
        return {
          syntax: "Embedded Form Field Opener",
          ...token
        };
      }, {} ],
      EmbeddedFormFieldCloser: [ "/*?*/", "", function(token) {
        return {
          syntax: "Embedded Form Field Closer",
          ...token
        };
      }, {} ],
      MultilineCommentValueInjection: [ "/*%=", "*/", function(token) {
        return {
          syntax: "Multiline Comment Value Injection",
          ...token
        };
      }, {
        includeAppendix: [ '"template"', "0", "() {}" ]
      } ],
      MultilineCommentCodeInjection: [ "/*%", "*/", function(token) {
        return {
          syntax: "Multiline Comment Code Injection",
          ...token
        };
      }, {
        includeAppendix: [ '"template"', "0", "() {}" ]
      } ],
      AtRequires: [ "/*@requires:", "*/", function(token) {
        return {
          syntax: "@Requires",
          ...token
        };
      } ],
      AtInjects: [ "/*@injects:", "*/", function(token) {
        return {
          syntax: "@Injects",
          inner: token.inner,
          location: token.location
        };
      } ],
      MultilineMarkdownComment: [ "/**", "*/", function(token) {
        return {
          syntax: "Multiline Markdown Comment",
          ...token
        };
      } ],
      NewParagraphMarkdownComment: [ "///@@:", "\n", function(token) {
        return {
          syntax: "New Paragraph Markdown Comment",
          ...token
        };
      }, {
        enderCanBeEOF: !0
      } ],
      NewLineMarkdownComment: [ "///@:", "\n", function(token) {
        return {
          syntax: "New Line Markdown Comment",
          ...token
        };
      }, {
        enderCanBeEOF: !0
      } ],
      PrecisedTabulationMarkdownComment: [ "///@~", "\n", function(token) {
        return {
          syntax: "Precised Tabulation Markdown Comment",
          ...token
        };
      }, {
        enderCanBeEOF: !0
      } ],
      IncreasedTabulationMarkdownComment: [ "///@+", "\n", function(token) {
        return {
          syntax: "Increased Tabulation Markdown Comment",
          ...token
        };
      }, {
        enderCanBeEOF: !0
      } ],
      DecreasedTabulationMarkdownComment: [ "///@-", "\n", function(token) {
        return {
          syntax: "Decreased Tabulation Markdown Comment",
          ...token
        };
      }, {
        enderCanBeEOF: !0
      } ],
      InlineMarkdownComment: [ "///@&:", "\n", function(token) {
        return {
          syntax: "Inline Markdown Comment",
          ...token
        };
      }, {
        enderCanBeEOF: !0
      } ],
      UnspacedInlineMarkdownComment: [ "///@&&:", "\n", function(token) {
        return {
          syntax: "Unspaced Inline Markdown Comment",
          ...token
        };
      }, {
        enderCanBeEOF: !0
      } ]
    };
    static defaultGrammars={
      forJs: [ this.nativeGrammars.InjectSource, this.nativeGrammars.InjectString, this.nativeGrammars.InjectTemplate, this.nativeGrammars.InjectModule, this.nativeGrammars.ImportJs, this.nativeGrammars.ExportJs, this.nativeGrammars.AtRequires, this.nativeGrammars.AtInjects, this.nativeGrammars.MultilineMarkdownComment, this.nativeGrammars.NewParagraphMarkdownComment, this.nativeGrammars.NewLineMarkdownComment, this.nativeGrammars.PrecisedTabulationMarkdownComment, this.nativeGrammars.IncreasedTabulationMarkdownComment, this.nativeGrammars.DecreasedTabulationMarkdownComment, this.nativeGrammars.InlineMarkdownComment, this.nativeGrammars.UnspacedInlineMarkdownComment ],
      forCss: [ this.nativeGrammars.InjectSource, this.nativeGrammars.InjectString, this.nativeGrammars.InjectTemplate, this.nativeGrammars.ImportJs, this.nativeGrammars.ExportJs, this.nativeGrammars.AtRequires, this.nativeGrammars.AtInjects ],
      forMd: [ this.nativeGrammars.InjectSource, this.nativeGrammars.InjectString, this.nativeGrammars.ImportJs, this.nativeGrammars.ExportJs, this.nativeGrammars.MultilineCommentValueInjection, this.nativeGrammars.AtRequires, this.nativeGrammars.AtInjects ],
      forHtml: [ this.nativeGrammars.InjectSource, this.nativeGrammars.AtInjects ],
      forCssOnRuntime: [ this.nativeGrammars.AtRequires ],
      forTemplateComments: [ this.nativeGrammars.MultilineCommentValueInjection, this.nativeGrammars.MultilineCommentCodeInjection ],
      forEmbeddedForms: [ this.nativeGrammars.EmbeddedFormFieldOpener, this.nativeGrammars.EmbeddedFormFieldCloser ]
    };
    static assert(condition, message) {
      if (!condition) throw new this.AssertionError(message);
    }
    static async trify(callback, ...args) {
      try {
        return await callback(...args);
      } catch (error) {
        return null;
      }
    }
    static _alphabet="abcdefghijklmnopqrstuvwxyz".split("");
    static _getRandomString(len = 10) {
      let out = "";
      for (;out.length < len; ) out += this._getRandomCharacter();
      return out;
    }
    static _getRandomCharacter(alphabet = this._alphabet) {
      return alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    static includeScript=Object.assign(src => (this.assert(this.isBrowser, `ModulerV6.includeScript cannot include scripts in environments that are not browser and so file «${src}» cannot be loaded`), 
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src, script.onload = () => resolve(), script.onerror = error => reject(error), 
      document.head.appendChild(script);
    })), {
      try: (...args) => this.trify(this.includeScript, ...args)
    });
    static includeStyle=Object.assign(src => (this.assert(this.isBrowser, `ModulerV6.includeStyle cannot include styles in environments that are not browser and so file «${src}» cannot be loaded`), 
    new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet", link.href = src, link.onload = () => resolve(), link.onerror = error => reject(error), 
      document.head.appendChild(link);
    })), {
      try: (...args) => this.trify(this.includeStyle, ...args)
    });
    static isBrowser="undefined" != typeof window;
    static isGithubIo() {
      return !!this.isBrowser && !!/\.github\.io$/i.test(window.location.hostname) && window.location.pathname.split("/").filter(Boolean)[0];
    }
    static symbols={
      REGEX_FOR_SLASH_AT_THE_END: /(\\|\/)$/g,
      REGEX_FOR_PROTOCOL_BASED_PATH: /^([A-Za-z0-9\-\_\$]*)\:\/\//g,
      REGEX_FOR_ABSOLUTE_WINDOWS_PATH: /^(([A-Za-z]:(\\|\/))|((\\|\/){2}))/g
    };
    static getEnvironmentDirectory() {
      if (this.tracer.trace("ModulerV6.static.getEnvironmentDirectory"), this.isBrowser) {
        {
          const projectName = this.isGithubIo();
          if (projectName) return `${window.location.origin}/${projectName}`;
        }
        return window.location.origin;
      }
      return process.cwd();
    }
    static async bindToRefrescador() {
      return this.isBrowser ? this.isGithubIo() ? -3 : (await this.includeScript.try("/socket.io-client.js"), 
      await this.includeScript.try("/client.js"), "bound successfully") : -2;
    }
    static updateAllHtmlLinks() {
      if (!this.isBrowser) return console.error("[!] ModulerV6.updateAllHtmlLinks can only be used in browser"), 
      -2;
      const allAnchors = document.body.querySelectorAll("a");
      console.log(`[*] ModulerV6 found ${allAnchors.length} anchors to update its link`), 
      allAnchors.forEach(el => {
        const dataHref = el.getAttribute("data-mv6-href");
        dataHref?.startsWith("@/") && el.setAttribute("href", $moduler.normalizationOf(dataHref));
      });
    }
    static create(...args) {
      return new this(...args);
    }
    tracer=this.constructor.Tracer.create("ModulerV6.globalInstance");
    _formatImportParameters(signature) {
      if (this.assert(Array.isArray(signature), "Parameter «signature» must be array on «ModulerV6.prototype._formatImportParameters»"), 
      this.assert(0 !== signature.length, "ModulerV6.prototype.import cannot have 0 arguments"), 
      1 === signature.length) {
        if ("string" == typeof signature[0]) {
          const isId = signature[0].startsWith("#");
          return {
            id: isId ? signature[0] : null,
            file: isId ? null : signature[0],
            dependencies: [],
            factory: null
          };
        }
        if ("object" == typeof signature[0]) return {
          id: null,
          file: null,
          dependencies: signature[0],
          factory: null
        };
        if ("function" == typeof signature[0]) return {
          id: null,
          file: null,
          dependencies: [],
          factory: signature[0]
        };
        this.assert(!1, "ModulerV6.prototype.import used with 1 argument does not support the signature: " + typeof signature[0]);
      } else if (2 === signature.length) {
        if ("object" == typeof signature[0] && "function" == typeof signature[1]) return {
          id: null,
          file: null,
          dependencies: signature[0],
          factory: signature[1]
        };
        this.assert(!1, `ModulerV6.prototype.import used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}`);
      } else this.assert(!1, `ModulerV6.prototype.import cannot have ${signature.length} arguments`);
    }
    _formatExportParameters(signature) {
      if (this.assert(Array.isArray(signature), "Parameter «signature» must be array on «ModulerV6.prototype._formatExportParameters»"), 
      this.assert(0 !== signature.length, "ModulerV6.prototype.export cannot have 0 arguments"), 
      this.assert(1 !== signature.length, "ModulerV6.prototype.export cannot have 1 argument only"), 
      this.assert("string" == typeof signature[0], "ModulerV6.prototype.export first argument must be a string"), 
      this.assert(signature[0].startsWith("#"), "ModulerV6.prototype.export first argument must be a string starting with «#»"), 
      2 === signature.length) {
        if ("string" == typeof signature[0] && "function" == typeof signature[1]) return {
          id: signature[0],
          file: null,
          dependencies: [],
          factory: signature[1]
        };
        if ("string" == typeof signature[0] && "string" == typeof signature[1]) return {
          id: signature[0],
          file: signature[1],
          dependencies: [],
          factory: null
        };
        if ("string" == typeof signature[0] && "object" == typeof signature[1]) return {
          id: signature[0],
          file: null,
          dependencies: signature[1],
          factory: null
        };
        this.assert(!1, `ModulerV6.prototype.export used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}`);
      } else if (3 === signature.length) {
        if ("string" == typeof signature[0] && "object" == typeof signature[1] && "function" == typeof signature[2]) return {
          id: signature[0],
          file: null,
          dependencies: signature[1],
          factory: signature[2]
        };
        this.assert(!1, `ModulerV6.prototype.export used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}, ${typeof signature[2]}`);
      } else this.assert(!1, `ModulerV6.prototype.export cannot have ${signature.length} arguments`);
    }
    _joinPaths(subpathsInput, origin = !1) {
      this.assert(Array.isArray(subpathsInput), "Parameter «subpaths» must be array on «ModulerV6.prototype._joinPaths»"), 
      this.assert(0 !== subpathsInput.length, "Parameter «subpaths.length» cannot be 0 on «ModulerV6.prototype._joinPaths»");
      let out = "", activatedOptions = {};
      const subpaths = [].concat(subpathsInput);
      {
        this.assert("string" == typeof subpaths[0], `Parameter «subpaths[0]» must be string but «${typeof subpaths[0]}» was found instead on «ModulerV6.prototype._joinPaths»`);
        const [_subpath, _activatedOptions] = this._removeSymbolsFromFilepath(subpaths[0], !0);
        subpaths[0] = _subpath, activatedOptions = _activatedOptions;
      }
      for (let index = 0; index < subpaths.length; index++) {
        const subpath = subpaths[index];
        this.assert("string" == typeof subpath, `Parameter «subpaths[${index}]» must be string too on «ModulerV6.prototype._joinPaths»`), 
        this.assert("" !== subpath, `Parameter «subpaths[${index}]» cannot be empty string on «ModulerV6.prototype._joinPaths»`), 
        subpath.includes("://") ? (this.assert(subpath.match(this.constructor.symbols.REGEX_FOR_PROTOCOL_BASED_PATH), `Paths can only have «://» at the begining, and preceded only by a protocol id, if any in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`), 
        out = subpath) : subpath.includes(":\\") || subpath.includes(":/") || subpath.startsWith("\\\\") || subpath.startsWith("//") ? (this.assert(subpath.match(this.constructor.symbols.REGEX_FOR_ABSOLUTE_WINDOWS_PATH), `Paths can only have «:\\|:/|\\\\|//» at the begining, and preceded only by a standard Windows disk unit identifier, if any in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`), 
        out = subpath) : subpath.startsWith("/") ? out = subpath : subpath.startsWith("./") ? (this.assert("string" == typeof this.basedir, `Cannot use «./» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`), 
        out = this._appendPathSeparator(this.basedir) + subpath.substr(2)) : subpath.startsWith("../") ? (this.assert("string" == typeof this.basedir, `Cannot use «../» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`), 
        out = this._appendPathSeparator(this.basedir, "..") + subpath.substr(3)) : subpath.startsWith("@/") ? (this.assert("string" == typeof this.rootdir, `Cannot use «@/» expression because «this.rootdir» is «${typeof this.rootdir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`), 
        out = this._appendPathSeparator(this.rootdir) + subpath.substr(2)) : out = out.length ? this._appendPathSeparator(out) + subpath : subpath;
      }
      {
        const parts = this.splitPath(out), newParts = [];
        for (let index = 0; index < parts.length; index++) {
          const part = parts[index];
          ".." === part ? newParts.pop() : "." === part || newParts.push(part);
        }
        out = newParts.join("/");
      }
      return activatedOptions.justTry && (out = `!${out}`), out;
    }
    splitPath(path) {
      const out = [ "" ];
      let index = 0;
      for (;index < path.length; ) {
        const ch = path[index];
        "/" === ch || "\\" === ch ? out.push("") : out[out.length - 1] += ch, index++;
      }
      return out;
    }
    _appendPathSeparator(subpath) {
      return subpath.replace(this.constructor.symbols.REGEX_FOR_SLASH_AT_THE_END, "") + "/";
    }
    _readFile(file) {
      return require("fs").promises.readFile(this.normalizationOf(file), "utf8");
    }
    _readUrl(url) {
      return fetch(this.normalizationOf(url), {
        method: "GET"
      }).then(response => {
        if (!response.ok) throw Object.assign(new Error(`[!] Could not read URL because of HTTP ${response.status} Error: ${response.statusText}`), {
          name: "FetchError"
        });
        return response.text();
      });
    }
    _readPath(url, options = {}) {
      return (this.runtime.isBrowser ? this._readUrl(url) : this._readFile(url)).then(it => (this.settings.data?.traceExternalSources && (console.log(`[*] Read from external source «${url}»:`), 
      console.log("--------------------:"), console.log(it), console.log("--------------------/")), 
      it));
    }
    _wrapInTry(source, parameters = {}, file = null) {
      let js = "";
      return js += "try {\n", js += `  ${source}\n`, js += "} catch(error) {\n", js += `  console.error("Injection source failed somewhere:", ${JSON.stringify(source)});\n`, 
      js += `  console.error("Injection parameters:", ${JSON.stringify(Object.keys(parameters).map(id => id + ":" + typeof parameters[id]))});\n`, 
      null !== file && (js += `  console.error("Injected file:", ${JSON.stringify(file)});\n`), 
      js += '  console.error("Injection failed:", error);\n', js += "}", js;
    }
    _createAsyncFunction(source, parameters = []) {
      return new async function() {}.constructor(...parameters, source);
    }
    _importFile(filepathInput) {
      let filepath, filepathMask, isInstr, isJson;
      const [filepathBrute, activeOptions] = this._removeSymbolsFromFilepath(filepathInput, !0);
      isJson = filepathBrute.endsWith(".json"), filepath = filepathMask = this.normalizationOf(filepathBrute), 
      isJson || (this.runtime.isDev || this.runtime.isTest) && this.settings.data?.instrumentalize?.length && this.settings.data.instrumentalize.map(file => this.normalizationOf(file)).includes(filepath) && (isInstr = !0, 
      filepath = filepath.replace(/\.js$/g, ".instr.js")), console.log("[*] ModulerV6 imports: " + this.rootdirOf(filepath));
      {
        if (isJson) return this.modules[filepathMask] = this._readPath(filepathBrute).catch(error => {
          if (!activeOptions.justTry) throw error;
        }).then(content => {
          if (void 0 !== content) return JSON.parse(content);
        });
        let firstHolder = {}, originalHolder = firstHolder;
        const moduleHolder = {
          get exports() {
            return originalHolder;
          },
          set exports(value) {
            originalHolder = value;
          }
        };
        return this.evaluateFile(filepath, {
          module: moduleHolder,
          exports: moduleHolder.exports,
          $moduler: this.cloneForFile(filepath)
        }, {
          onMissingResource: !0 === activeOptions.justTry && (() => {})
        }).then(result => {
          let output;
          return void 0 !== result ? output = moduleHolder.exports = result : moduleHolder.exports === firstHolder && 0 === Object.keys(firstHolder).length || (output = moduleHolder.exports), 
          this.modules[filepathMask] = output;
        });
      }
    }
    _importFactory(factory, dependencies = []) {
      let output, firstHolder = {}, originalHolder = firstHolder;
      const moduleHolder = {
        get exports() {
          return originalHolder;
        },
        set exports(anotherOutput) {
          originalHolder = anotherOutput;
        }
      }, syncResult = factory(dependencies, {
        module: moduleHolder,
        exports: moduleHolder.exports,
        $moduler: this
      });
      if (syncResult instanceof Promise) return syncResult.then(result => (output = void 0, 
      void 0 !== result ? output = moduleHolder.exports = result : moduleHolder.exports === firstHolder && 0 === Object.keys(firstHolder).length || (output = moduleHolder.exports), 
      output));
      {
        output = void 0;
        const result = syncResult;
        void 0 === result ? (() => moduleHolder.exports === firstHolder && 0 === Object.keys(firstHolder).length)() || (output = moduleHolder.exports) : output = moduleHolder.exports = result;
      }
      return output;
    }
    _importSectionByMap(sectionId, returnsOnMissing = void 0) {
      if (!this.settings.data?.sectionsMap) return returnsOnMissing;
      const originalMap = this.settings.data.sectionsMap;
      if (!(sectionId in originalMap)) return returnsOnMissing;
      const sectionPath = originalMap[sectionId];
      return this.import(sectionPath);
    }
    _removeSymbolsFromFilepath(filepathInput, returnData = !1) {
      let output = filepathInput;
      const activeOptions = {};
      return output.startsWith("!") && (output = output.substr(1), activeOptions.justTry = !0), 
      returnData ? [ output, activeOptions ] : output;
    }
    assert(condition, message) {
      return this.constructor.assert(condition, message);
    }
    trify=this.constructor.trify;
    createAssertFunction() {
      return (...args) => this.assert(...args);
    }
    setBasedir(basedir) {
      this.basedir = this.normalizationOf(basedir), this.compiler && (this.compiler.basedir = this.basedir);
    }
    setRootdir(rootdir) {
      this.rootdir = this.normalizationOf(rootdir), this.compiler && (this.compiler.rootdir = this.rootdir);
    }
    normalizationOf(subpath) {
      return this.assert("string" == typeof subpath, "Parameter «subpath» must be string on «ModulerV6.prototype.normalizationOf»"), 
      this._joinPaths([ subpath ], "normalizationOf");
    }
    basedirOf(subpath) {
      const normalized = this._joinPaths([ subpath ], "basedirOf"), basedirSeparated = this._appendPathSeparator(this.basedir);
      return normalized.startsWith(basedirSeparated) ? normalized.replace(basedirSeparated, "./") : normalized;
    }
    rootdirOf(subpath) {
      const normalized = this._joinPaths([ subpath ], "rootdirOf"), rootdirSeparated = this._appendPathSeparator(this.rootdir);
      return normalized.startsWith(rootdirSeparated) ? normalized.replace(rootdirSeparated, "@/") : normalized;
    }
    cloneForFile(filepath) {
      const dirpath = this._joinPaths([ filepath, ".." ]);
      return new ModulerV6(dirpath, this);
    }
    evaluateFile(file, injections = {}, options = {}) {
      return this._readPath(file, options).catch(error => {
        if (options.onMissingResource) return options.onMissingResource(error);
        throw error;
      }).then(source => this.evaluateSource(source, injections, file));
    }
    evaluateSource(source, injections = {}, file = null) {
      if (void 0 === source) return;
      this.assert("string" == typeof source, `Parameter «source» must be string but «${typeof source}» was passed instead on «ModulerV6.prototype.evaluateSource»`), 
      this.assert("object" == typeof injections, `Parameter «injections» must be object but «${typeof injections}» was passed instead on «ModulerV6.prototype.evaluateSource»`), 
      this.assert(!Array.isArray(injections), "Parameter «injections» must be object but not array on «ModulerV6.prototype.evaluateSource»"), 
      this.assert(null !== injections, "Parameter «injections» must be object but not null on «ModulerV6.prototype.evaluateSource»");
      const allKeys = Object.keys(injections), allObjects = Object.values(injections), finalSource = this._wrapInTry(source, injections, file);
      return this._createAsyncFunction(finalSource, allKeys)(...allObjects);
    }
    import(...signature) {
      let filepath, dependencies;
      const parameters = this._formatImportParameters(signature), {id: _id = null, file: _file = null, dependencies: _dependencies = null, factory: _factory = null} = parameters;
      if (_id) {
        if (this.section.has(_id)) return this.section.get(_id);
        {
          const uniqueFailure = {}, sectionByMap = this._importSectionByMap(_id, uniqueFailure);
          return this.assert(sectionByMap !== uniqueFailure, `No section named «${_id}» on «ModulerV6.prototype.import»`), 
          sectionByMap;
        }
      }
      if (_file) return filepath = this.normalizationOf(_file), filepath in this.modules ? this.modules[filepath] : this._importFile(filepath);
      if (_dependencies && _dependencies.length && (dependencies = Promise.all(_dependencies.map(dependency => this.import(dependency))), 
      !_factory)) return dependencies;
      if (_factory && dependencies) return dependencies.then(resolvedDependencies => this._importFactory(_factory, resolvedDependencies));
      if (_factory && !dependencies) return this._importFactory(_factory, []);
      if (dependencies) return dependencies;
      throw new Error("This error should never happen by design (8210)");
    }
    export(...signature) {
      let output;
      const parameters = this._formatExportParameters(signature), {id: _id = null, file: _file = null, dependencies: _dependencies = null, factory: _factory = null} = parameters;
      this.assert(this.section instanceof ModulerV6.SectionsManager, "For some random reason, the section manager global instance is not available on «ModulerV6.prototype.export»"), 
      this.assert(!this.section.has(_id), `Cannot export section by id «${_id}» because it already exists on «ModulerV6.prototype.export»`);
      {
        const signatureCopy = [ ...signature ];
        signatureCopy.splice(0, 1), output = this.import(...signatureCopy);
      }
      return null === output ? this.section.set(_id, output) : [ "object" ].includes(typeof output) ? this.section.expand(_id, output) : this.section.set(_id, output), 
      output;
    }
    static globalSectionsManagerInstance=new this.SectionsManager({});
    section=this.constructor.globalSectionsManagerInstance;
    constructor(basedirArg = null, cloneOf = null) {
      const basedir = null === basedirArg ? this.constructor.getEnvironmentDirectory() : basedirArg;
      this.assert("string" == typeof basedir, `Parameter «basedir» must be string and not «${typeof basedir}» on «ModulerV6.constructor»`), 
      this.assert("object" == typeof cloneOf, `Parameter «cloneOf» must be object or null not «${typeof cloneOf}» on «ModulerV6.constructor»`), 
      this.assert("string" == typeof basedir, "Parameter «basedir» must be string on «Moduler.constructor»"), 
      this.basedir = basedir, this.rootdir = cloneOf ? cloneOf.rootdir : basedir, this.modules = cloneOf ? cloneOf.modules : {}, 
      this.compiler = null, this.grammars = {
        forJs: this.constructor.defaultGrammars.forJs,
        forCss: this.constructor.defaultGrammars.forCss,
        forMd: this.constructor.defaultGrammars.forMd,
        forHtml: this.constructor.defaultGrammars.forHtml,
        forTemplateComments: this.constructor.defaultGrammars.forTemplateComments,
        forEmbeddedForms: this.constructor.defaultGrammars.forEmbeddedForms
      }, this.parser = {
        forJs: this.constructor.Parser.create(this.grammars.forJs),
        forCss: this.constructor.Parser.create(this.grammars.forCss),
        forMd: this.constructor.Parser.create(this.grammars.forMd),
        forHtml: this.constructor.Parser.create(this.grammars.forHtml),
        forTemplateComments: this.constructor.Parser.create(this.grammars.forTemplateComments),
        forEmbeddedForms: this.constructor.Parser.create(this.grammars.forEmbeddedForms)
      }, this.css = new ModulerV6.CssManager(this), this.settings = new ModulerV6.Settings(this), 
      cloneOf && (this.settings.data = cloneOf.settings.data), this.runtime = ModulerV6.Runtime.globalInstance;
    }
    static globalInstance=new this;
    static isLoaded=(async () => {
      this.bindToRefrescador(), await this.globalInstance.runtime.load(), this.onLoaded.resolve();
    })();
  };
}.call(), "undefined" == typeof $moduler && ("undefined" != typeof window && (window.$moduler = mod.globalInstance), 
"undefined" != typeof global && (global.$moduler = mod.globalInstance)), "undefined" == typeof ModulerV6 && ("undefined" != typeof window && (window.ModulerV6 = mod), 
"undefined" != typeof global && (global.ModulerV6 = mod)), ModulerV6, window.addEventListener("load", async function() {
  console.log("[*] Page loaded");
});