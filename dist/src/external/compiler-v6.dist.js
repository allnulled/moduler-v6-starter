!function(mod) {
  if ("undefined" != typeof CompilerV6) return CompilerV6;
  "undefined" != typeof window && (window.CompilerV6 = mod), "undefined" != typeof global && (global.CompilerV6 = mod);
}(function() {
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
          return void 0 !== CompilerV6;
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
          const result = syncResult, isSameEmptyObject = () => moduleHolder.exports === firstHolder && 0 === Object.keys(firstHolder).length;
          void 0 === result ? isSameEmptyObject() || (output = moduleHolder.exports) : output = moduleHolder.exports = result;
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
  "undefined" != typeof global && (global.ModulerV6 = mod)), ModulerV6;
  const CompilerV6 = class CompilerV6 {
    static Parser=ModulerV6.Parser;
    static Tracer=class {
      constructor(compiler) {
        this.compiler = compiler, this.isBrowser = compiler.isBrowser, this.isTracing = !1, 
        this.isLogging = !0, this.stack = [], this.highlightedPatterns = [ [ "assert", "blackBright" ], [ "_compileRecursively", "cyan,underline" ], [ "_tokenizeText", "cyan,underline" ], [ "_compileTokens", "cyan,underline" ], [ ".constructor", "blue" ], [ "_replaceTextRange", "yellow,bold" ] ], 
        this.ignoredPatterns = [ "assert" ];
      }
      activate(really = !0) {
        return this.isTracing = !!really, this;
      }
      deactivate(really = !0) {
        return this.isTracing = !really, this;
      }
      addHighlighter(text) {
        -1 === highlightedPatterns.indexOf(text) && highlightedPatterns.push(text);
      }
      removeHighlighter(text) {
        const pos = highlightedPatterns.indexOf(text);
        -1 !== pos && highlightedPatterns.splice(pos, 1);
      }
      indentByLevel(input) {
        return " ".repeat(this.stack.length) + input;
      }
      matchesIgnorer(text) {
        for (let index = 0; index < this.ignoredPatterns.length; index++) {
          const pattern = this.ignoredPatterns[index];
          if (text.includes(pattern)) return !0;
        }
        return !1;
      }
      highlightIfMatched(output) {
        let styling = !1;
        Iterating_patterns: for (let index = 0; index < this.highlightedPatterns.length; index++) {
          const details = this.highlightedPatterns[index], [text] = details;
          if (-1 !== output.indexOf(text)) {
            styling = details[1] || "yellow,bold";
            break Iterating_patterns;
          }
        }
        return (output.includes("++]") || output.includes("--]")) && (styling = "bold," + (styling || "")), 
        !1 === styling ? output : this.compiler.constructor.ansi.colors.style(styling).text(output);
      }
      trace(message, args, spaceDiff = 0) {
        if (this.isTracing) {
          let output = "";
          output += `[${this.stack.length}${1 === spaceDiff ? "++" : -1 === spaceDiff ? "--" : ""}] `, 
          output += this.compiler.name ? `[${this.compiler.name}] ` : "[mv6] ", output += `[${message}] `, 
          output += `arguments: ${args.length}`, output = this.highlightIfMatched(output), 
          output = this.indentByLevel(output), this.matchesIgnorer(output) || console.log(output), 
          this.isLogging && this.compiler.log(CompilerV6.ansi.colors.stripAnsi(output));
        }
      }
      traceIn(msg, args) {
        this.trace(msg, args, 1), this.stack.push(msg);
      }
      traceOut(msg, args) {
        this.stack[this.stack.length - 1];
        this.stack.pop(), this.trace(msg, args, -1);
      }
      printStack() {
        console.log(`Tracer «${this.compiler.name || "mv6"}» with:`, this.stack);
      }
    };
    static AssertionError=class extends Error {
      constructor(message) {
        super(message), this.name = "AssertionError";
      }
    };
    static Logger=class Logger {
      static fromFile(file) {
        return new this({
          file: file
        });
      }
      static Manager=class {
        static fromDirectory(basedir) {
          return new this(basedir);
        }
        constructor(basedir) {
          this.basedir = basedir, this.selected = "default", this.subloggers = {
            default: new Logger({
              file: require("path").resolve(basedir, "default.txt")
            })
          };
        }
        get current() {
          return this.subloggers[this.selected];
        }
        addLogger(id) {
          this.subloggers[id] = new Logger({
            file: require("path").resolve(this.basedir, id + ".txt")
          });
        }
        has(id) {
          return id in this.subloggers;
        }
        into(id) {
          return this.has(id) || this.addLogger(id), this.subloggers[id];
        }
        select(id = !1) {
          return !1 === id ? (this.has(this.selected) || this.addLogger(this.selected), this.subloggers[this.selected]) : (this.has(id) || this.addLogger(this.selected), 
          this.selected = id, this.select());
        }
        resetFile(...args) {
          return this.has(this.selected) || this.addLogger(this.selected), this.subloggers[this.selected].resetFile(...args);
        }
        log(...args) {
          return this.has(this.selected) || this.addLogger(this.selected), this.subloggers[this.selected].log(...args);
        }
      };
      static create(...args) {
        return new this(...args);
      }
      static defaultOptions={
        console: !0
      };
      constructor(options, compiler) {
        this.options = Object.assign({}, this.constructor.defaultOptions, options), this.compiler = compiler, 
        this.startedAt = new Date, this.lastLogAt = new Date;
      }
      resetFile(...args) {
        return require("fs").promises.writeFile(this.options.file, "", "utf8").then(() => (this.startedAt = new Date, 
        this.lastLogAt = new Date, this.log(...args)));
      }
      getTimeOffset() {
        return "+" + ((new Date).getTime() - this.startedAt.getTime());
      }
      getLastLogOffset() {
        return "+" + ((new Date).getTime() - this.lastLogAt.getTime());
      }
      log(...args) {
        const line = this.stringifySafe({
          "@": this.getMomentToString(),
          "#": this.getTimeOffset(),
          "##": this.getLastLogOffset(),
          "*": args
        });
        if (this.options.console && console.log(`~[LOG] ${line}`), this.lastLogAt = new Date, 
        this.options.file) return require("fs").promises.appendFile(this.options.file, line + "\n", "utf8").catch(console.error);
      }
      setOption(id, value) {
        return this.options[id] = value, this;
      }
      getMomentToString() {
        const d = new Date, pad = n => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${n = d.getMilliseconds(), 
        String(n).padStart(3, "0")}`;
        var n;
      }
      stringifySafe(value) {
        const seen = new WeakSet;
        return JSON.stringify(value, (key, val) => {
          if ("bigint" == typeof val) return `${val}n`;
          if ("function" == typeof val) return `[Function ${val.name || "anonymous"}]`;
          if (val instanceof Error) return {
            name: val.name,
            message: val.message,
            stack: val.stack
          };
          if ("object" == typeof val && null !== val) {
            if (seen.has(val)) return "[Circular]";
            seen.add(val);
          }
          return val;
        }, 0);
      }
    };
    static Moduler=ModulerV6;
    static Files=class {
      static create(...args) {
        return new this(...args);
      }
      constructor(compiler) {
        this.compiler = compiler;
      }
      async trify(callback, ...args) {
        try {
          return await callback(...args);
        } catch (error) {
          return null;
        }
      }
      deleteFile=Object.assign(file => require("fs").promises.unlink(file), {
        try: (...args) => this.trify(this.deleteFile, ...args)
      });
      deleteDirectory=Object.assign(dir => {
        const fullDir = this.compiler.moduler.normalizationOf(dir);
        return require("fs").promises.rm(fullDir, {
          recursive: !0
        });
      }, {
        try: (...args) => this.trify(this.deleteDirectory, ...args)
      });
      hasFile(file) {
        return require("fs").promises.access(file).then(() => !0).catch(error => !1);
      }
      hasDirectory(dir) {
        return require("fs").promises.access(dir).then(() => !0).catch(error => !1);
      }
      writeFile=Object.assign((file, contents, encoding = "utf8") => {
        const absolutePath = this.compiler.normalizationOf(file);
        return require("fs").promises.writeFile(absolutePath, contents, encoding);
      }, {
        try: (...args) => this.trify(this.writeFile, ...args)
      });
      makeDirectory=Object.assign(dir => {
        const fullDir = this.compiler.normalizationOf(dir);
        return require("fs").promises.mkdir(fullDir);
      }, {
        try: (...args) => this.trify(this.makeDirectory, ...args)
      });
      readFile=Object.assign((file, encoding = "utf8") => {
        const absolutePath = this.compiler.normalizationOf(file);
        return require("fs").promises.readFile(absolutePath, encoding);
      }, {
        try: (...args) => this.trify(this.readFile, ...args)
      });
      copyDirectory=Object.assign(async (src, dst) => {
        const fullSrc = this.compiler.moduler.normalizationOf(src), fullDst = this.compiler.moduler.normalizationOf(dst);
        return await this.ensureDirectory(fullDst), await require("fs").promises.cp(fullSrc, fullDst, {
          recursive: !0
        });
      }, {
        try: (...args) => this.trify(this.copyDirectory, ...args)
      });
      copyFile=Object.assign(async (src, dst) => {
        const fullSrc = this.compiler.moduler.normalizationOf(src), fullDst = this.compiler.moduler.normalizationOf(dst);
        return await require("fs").promises.copyFile(fullSrc, fullDst);
      }, {
        try: (...args) => this.trify(this.copyFile, ...args)
      });
      ensureDirectory(dir) {
        return require("fs").promises.mkdir(dir, {
          recursive: !0
        }).catch(error => -2);
      }
    };
    static CompilationProcess=class {
      static assert(condition, message) {
        if (!condition) throw new Error(message);
      }
      static get _defaultProcessData() {
        return {
          processedEntries: {},
          dontCreateOnInjectSource: !0,
          disableTemplates: !1
        };
      }
      constructor(compilationFile, compilationProcess, compiler) {
        return this.constructor.assert("object" == typeof compiler, "Parameter «compiler» must be object on «CompilerV6.CompilationProcess.constructor»"), 
        this.constructor.assert(compiler instanceof CompilerV6, "Parameter «compiler» must be instance of «CompilerV6» on «CompilerV6.CompilationProcess.constructor»"), 
        this.compiler = compiler, this.compiler._traceIn("CompilationProcess.constructor", arguments), 
        compilationProcess instanceof this.constructor ? (this.compiler._traceOut("CompilationProcess.constructor", arguments), 
        Object.assign(this, this.constructor._defaultProcessData, compilationProcess), this) : (this.compiler.assert("object" == typeof compilationFile, "Parameter «compilationFile» must be object on «CompilerV6.CompilationProcess.constructor»"), 
        this.compiler.assert("object" == typeof compilationProcess, "Parameter «compilationProcess» must be object on «CompilerV6.CompilationProcess.constructor»"), 
        Object.assign(this, this.constructor._defaultProcessData, compilationProcess), void 0 === this.resource && (this.compiler.assert("string" == typeof compilationFile.resource, "Parameter «compilationProcess.resource» or «compilationFile.resource» must be string on «CompilerV6.CompilationProcess.constructor»"), 
        this.resource = compilationFile.resource), void 0 === this.isRoot && (this.isRoot = compilationFile.isRoot), 
        this.compiler.assert("string" == typeof this.resource, "Parameter «compilationProcess.resource» must be string on «CompilerV6.CompilationProcess.constructor»"), 
        this.compiler.assert("boolean" == typeof this.isRoot, "Parameter «compilationProcess.isRoot» must be boolean on «CompilerV6.CompilationProcess.constructor»"), 
        this.compiler._traceOut("CompilationProcess.constructor", arguments), this);
      }
      static from(...args) {
        return new this(...args);
      }
    };
    static CompilationFile=class {
      static assert(condition, message) {
        if (!condition) throw new Error(message);
      }
      static get _defaultFileData() {
        return {
          compilation: {
            js: "",
            css: "",
            md: ""
          },
          report: {
            tree: {}
          },
          mdUnification: []
        };
      }
      constructor(compilationFile, compilationProcess, compiler) {
        this.constructor.assert("object" == typeof compiler, "Parameter «compiler» must be object on «CompilerV6.CompilationFile.constructor»"), 
        this.constructor.assert(compiler instanceof CompilerV6, "Parameter «compiler» must be instance of «CompilerV6» on «CompilerV6.CompilationFile.constructor»"), 
        this.compiler = compiler, this.compiler._traceIn("CompilationFile.constructor", arguments), 
        compilationProcess instanceof this.constructor ? (Object.assign(this, this.constructor._defaultFileData, compilationFile), 
        this.compiler._traceOut("CompilationProcess.constructor", arguments)) : (this.compiler.assert("object" == typeof compilationFile, "Parameter «compilationFile» must be object on «CompilerV6.CompilationFile.constructor»"), 
        this.compiler.assert("object" == typeof compilationProcess, "Parameter «compilationProcess» must be object on «CompilerV6.CompilationFile.constructor»"), 
        Object.assign(this, this.constructor._defaultFileData, compilationFile), this.compiler.assert("string" == typeof this.resource, "Parameter «compilationFile.resource» must be string on «CompilerV6.CompilationFile.constructor»"), 
        this.compiler.assert("boolean" == typeof this.isRoot, "Parameter «compilationFile.isRoot» must be boolean on «CompilerV6.CompilationFile.constructor»"), 
        this.compiler._traceOut("CompilationFile.constructor", arguments));
      }
      static from(...args) {
        return new this(...args);
      }
    };
    static CompilationResult=class {
      constructor(output = {}, compiler = null) {
        Object.assign(this, output), this.compiler = compiler;
      }
      toFile(file, options = {}) {
        this.compiler.assert(require("path").basename(file).includes(".dist."), `Method «toFile» only accepts files containing «.dist.» pattern and file «${file}» does not incur the case`);
        require("path").extname(file);
        const fileNormalization = this.compiler.normalizationOf(file), fileJs = this.compiler.constructor._changeFileExtension(fileNormalization, ".js"), promises = (this.compiler.constructor._changeFileExtension(fileNormalization, ".css"), 
        this.compiler.constructor._changeFileExtension(fileNormalization, ".md"), []);
        this.js;
        {
          const outputJs = "beautified" === options.mode && this.beautifiedJs ? this.beautifiedJs.code : "minified" === options.mode && this.minifiedJs ? this.minifiedJs.code : this.js;
          promises.push(require("fs").promises.writeFile(fileJs, outputJs, "utf8")), console.log(`[*] Saving compilation.js (${options.mode || "raw code"}) at: ` + fileJs);
        }
        return Promise.all(promises);
      }
      toJsonable() {
        return Object.assign({}, this, {
          compiler: void 0,
          moduler: void 0
        });
      }
    };
    static _nativeGrammars=ModulerV6.nativeGrammars;
    static _defaultGrammars=ModulerV6.defaultGrammars;
    static _changeFileExtension(file, nuevaExt) {
      const path = require("path");
      nuevaExt.startsWith(".") || (nuevaExt = "." + nuevaExt);
      const dir = path.dirname(file), nombre = path.basename(file, path.extname(file));
      return path.join(dir, nombre + nuevaExt);
    }
    static beautifyJs(code) {
      try {
        return require("prettier").format(code, {
          parser: "babel"
        });
      } catch (error) {
        return console.error("[!] ERROR DESDE EL BEAUTIFIER:", error), code;
      }
    }
    static async softMinifyJs(code) {
      try {
        return await require("terser").minify(code, {
          compress: {
            sequences: !0
          },
          mangle: !1,
          toplevel: !0,
          format: {
            comments: !1,
            beautify: !0,
            indent_level: 2,
            max_line_len: !0
          }
        });
      } catch (error) {
        return console.log("[!] ERROR EN EL SOFT-MINIFIER:", error), {
          code: code
        };
      }
    }
    static async hardMinifyJs(code) {
      try {
        return await require("terser").minify(code, {
          compress: {
            defaults: !0,
            passes: 5,
            unsafe: !0,
            toplevel: !0
          },
          mangle: {
            toplevel: !0
          }
        });
      } catch (error) {
        return console.log("[!] ERROR EN EL HARD-MINIFIER:", error), {
          code: code
        };
      }
    }
    static getStringSize(text) {
      let bytes;
      return bytes = this.isBrowser ? (new TextEncoder).encode(text).length : Buffer.byteLength(text, "utf8"), 
      bytes < 1048576 ? `${(bytes / 1024).toFixed(2)}KB` : `${(bytes / 1024 / 1024).toFixed(2)}MB`;
    }
    static create(...args) {
      return new this(...args);
    }
    static fromDirectory(dir) {
      return new this(dir);
    }
    static async fromRootOf(file) {
      return new this(await this.findRootOf(file));
    }
    static async findRootOf(file, whenContains = "package.json") {
      const fs = require("fs"), path = require("path");
      let dir0 = null, dir1 = file;
      for (;dir0 !== dir1; ) try {
        const filepath = path.resolve(dir1, whenContains);
        return await fs.promises.readFile(filepath), dir1;
      } catch (error) {
        dir0 = dir1, dir1 = path.dirname(dir1);
      }
      return null;
    }
    static ansi={
      colors: Object.assign({
        available: {
          bold: [ 1, 22 ],
          italic: [ 3, 23 ],
          underline: [ 4, 24 ],
          blink: [ 5, 25 ],
          inverse: [ 7, 27 ],
          strike: [ 9, 29 ],
          black: [ 30, 39 ],
          red: [ 31, 39 ],
          green: [ 32, 39 ],
          yellow: [ 33, 39 ],
          blue: [ 34, 39 ],
          magenta: [ 35, 39 ],
          cyan: [ 36, 39 ],
          white: [ 37, 39 ],
          bgBlack: [ 40, 49 ],
          bgRed: [ 41, 49 ],
          bgGreen: [ 42, 49 ],
          bgYellow: [ 43, 49 ],
          bgBlue: [ 44, 49 ],
          bgMagenta: [ 45, 49 ],
          bgCyan: [ 46, 49 ],
          bgWhite: [ 47, 49 ],
          blackBright: [ 90, 39 ],
          redBright: [ 91, 39 ],
          greenBright: [ 92, 39 ],
          yellowBright: [ 93, 39 ],
          blueBright: [ 94, 39 ],
          magentaBright: [ 95, 39 ],
          cyanBright: [ 96, 39 ],
          whiteBright: [ 97, 39 ],
          bgBlackBright: [ 100, 49 ],
          bgRedBright: [ 101, 49 ],
          bgGreenBright: [ 102, 49 ],
          bgYellowBright: [ 103, 49 ],
          bgBlueBright: [ 104, 49 ],
          bgMagentaBright: [ 105, 49 ],
          bgCyanBright: [ 106, 49 ],
          bgWhiteBright: [ 107, 49 ]
        },
        endToken: "[0m",
        squad: {
          tl: "┌",
          tr: "┐",
          bl: "└",
          br: "┘"
        },
        line: {
          h: "─",
          v: "│"
        },
        style: function(config = "red,bold,underline") {
          const styles = config.split(",");
          return {
            text: text => `${styles.reduce((out, it) => {
              if (!(it in this.available)) return out;
              return out += `[${this.available[it][0]}m`;
            }, "")}${text}${this.endToken}`,
            print(text) {
              console.log(this.text(text));
            }
          };
        },
        stripAnsi: function(str) {
          return str.replace(/\x1b\[[0-9;]*m/g, "");
        },
        wrapAnsi: function(str, maxWidth) {
          return require("wrap-ansi").default(str, maxWidth, {
            hard: !0
          });
        },
        box: function(text, maxWidth = 110) {
          const lines = this.wrapAnsi(text, maxWidth).split("\n"), cleanLines = lines.map(l => this.stripAnsi(l)), width = Math.max(...cleanLines.map(l => l.length)), top = "┌" + "─".repeat(width + 2) + "┐", bottom = "└" + "─".repeat(width + 2) + "┘";
          return `${top}\n${lines.map(line => {
            const clean = this.stripAnsi(line), pad = width - clean.length;
            return "│ " + line + " ".repeat(pad) + " │";
          }).join("\n")}\n${bottom}`;
        }
      }, {
        table: function(listOfColumns, options = {}) {
          const table = new (require("cli-table3"))(options);
          return table.push(...listOfColumns), table.toString();
        },
        borderlessTable: function(listOfColumns, optionsObject = {}) {
          return this.alignTable(listOfColumns, 2, optionsObject);
        },
        visibleLength: str => require("strip-ansi").default(str).length,
        alignTable(rows, gap = 2, max = {}) {
          for (let indexRow = 0; indexRow < rows.length; indexRow++) {
            const row = rows[indexRow];
            for (let indexCol = 0; indexCol < row.length; indexCol++) {
              const cell = row[indexCol], cellLen = this.visibleLength(cell);
              indexCol in max || (max[indexCol] = 5), max[indexCol] < cellLen && (max[indexCol] = cellLen);
            }
          }
          let out = "";
          for (let indexRow = 0; indexRow < rows.length; indexRow++) {
            const row = rows[indexRow];
            for (let indexCol = 0; indexCol < row.length; indexCol++) {
              const cell = row[indexCol], currCellLen = this.visibleLength(cell), cellLen = max[indexCol];
              0 !== indexCol && (out += " │ "), out += cell + " ".repeat(cellLen - currCellLen);
            }
            out += "\n";
          }
          return out.trimEnd();
        },
        padLinesToMax: function(text) {
          const lines = text.split("\n");
          let out = "", max = 0;
          for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            max < line.length && (max = line.length);
          }
          for (let index = 0; index < lines.length; index++) {
            0 !== index && (out += "\n"), out += lines[index].padEnd(max, " ");
          }
          return out;
        }
      })
    };
    constructor(basedirInput, parent = null, grammars = this.constructor._defaultGrammars) {
      if ("string" != typeof basedirInput) throw new this.constructor.AssertionError(`Parameter «basedir» must be string not «${typeof basedirInput}» on «CompilerV6.constructor»`);
      if ("object" != typeof parent) throw new this.constructor.AssertionError(`Parameter «parent» must be object not «${typeof parent}» on «CompilerV6.constructor»`);
      if ("object" != typeof grammars) throw new this.constructor.AssertionError(`Parameter «grammars» must be object not «${typeof grammars}» on «CompilerV6.constructor»`);
      parent && (this._tracer = parent._tracer), this._trace("constructor", arguments);
      const basedir = parent ? parent.fullpathOf(basedirInput) : this.fullpathOf(basedirInput);
      this.isBrowser = "undefined" != typeof window, this.basedir = basedir, this.previousdir = parent ? parent.basedir : basedir, 
      this.rootdir = parent ? parent.rootdir : basedir, this.moduler = new ModulerV6(basedir), 
      this.moduler.compiler = this, this.files = parent ? parent.files : new this.constructor.Files(this), 
      this._grammars = this.moduler.grammars, this._parser = this.moduler.parser;
    }
    _readPath(url) {
      return this._trace("_readPath", arguments), this._isBrowser ? this._readUrl(url) : this._readFile(url);
    }
    _readUrl(url) {
      return this._trace("_readUrl", arguments), fetch(this.normalizationOf(url), {
        method: "GET"
      }).then(response => response.text());
    }
    _readFile(file) {
      return this._trace("_readFile", arguments), require("fs").promises.readFile(this.normalizationOf(file), "utf8");
    }
    assert(condition, message) {
      if (this._trace("assert", arguments), !condition) throw new this.constructor.AssertionError(message);
      this._tracer.isTracing && this._notifyAssertion(message);
    }
    async assertThrows(callback, message, checker = () => !0) {
      const localError = new Error("Should have thrown: " + message);
      try {
        throw await callback(), localError;
      } catch (err) {
        if (err === localError) throw new this.constructor.AssertionError(`Should have thrown: ${err.name}: ${err.message} | ${err.stack}`);
        if (!checker(err)) throw new this.constructor.AssertionError(`Should have thrown but not specific error: ${err.name}: ${err.message} | ${err.stack}`);
        this._notifyAssertion(message);
      }
    }
    async assertDoesNotThrow(callback, message, checker = () => !0) {
      try {
        await callback(), this._notifyAssertion(message);
      } catch (err) {
        if (!checker(err)) throw new this.constructor.AssertionError(`Should not have thrown specific error: ${err.name}: ${err.message}`);
        throw new this.constructor.AssertionError(`Should not have thrown: ${err.name}: ${err.message}`);
      }
    }
    createAssertFunction() {
      return (...args) => this.assert(...args);
    }
    _notifyAssertion(message) {
      const text = `[ok] ${message}`;
      this._tracer.isTracing && !this._tracer.matchesIgnorer(text) && console.log(this._tracer.indentByLevel(this.constructor.ansi.colors.style("blackBright").text(text)));
    }
    _logger=null;
    _tracer=new this.constructor.Tracer(this);
    _trace(method, args = []) {
      return this._tracer.trace(method, args);
    }
    _traceIn(method, args = []) {
      return this._tracer.traceIn(method, args);
    }
    _traceOut(method, args = []) {
      return this._tracer.traceOut(method, args);
    }
    _debug(...list) {
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        let output = item;
        try {
          output = JSON.stringify(item, null, 2);
        } catch (error) {
          console.warn(error);
        }
        console.log(this.constructor.ansi.colors.style("yellow,bold,underline").text(`[debug] parameter ${index}:`), output);
      }
      return list[0];
    }
    _die(...args) {
      this._trace("die", arguments), console.log("[DIE]", ...args), process.exit(0);
    }
    _tokenizeText(compilationFile, compilationProcess) {
      let out;
      if (this._traceIn("_tokenizeText", arguments), this.assert("object" == typeof compilationProcess, "Parameter «compilationProcess» must be object on «CompilerV6.prototype._tokenizeText»"), 
      this.assert("string" == typeof compilationProcess.resource, "Parameter «compilationProcess.resource» must be string on «CompilerV6.prototype._tokenizeText»"), 
      this.assert("object" == typeof compilationFile, "Parameter «compilationFile» must be object on «CompilerV6.prototype._tokenizeText»"), 
      this.assert("string" == typeof compilationFile.source, "Parameter «compilationFile.source» must be string on «CompilerV6.prototype._tokenizeText»"), 
      this.assert("string" == typeof compilationFile.extension, "Parameter «compilationFile.extension» must be string on «CompilerV6.prototype._tokenizeText»"), 
      "js" === compilationFile.extension) out = this._parser.forJs.parse(compilationFile.source); else if ("css" === compilationFile.extension) out = this._parser.forCss.parse(compilationFile.source); else if ("md" === compilationFile.extension) out = this._parser.forMd.parse(compilationFile.source); else if ("json" === compilationFile.extension) out = {
        formatted: []
      }; else {
        if ("html" !== compilationFile.extension) throw new Error(`File extension cannot be tokenized: «${compilationFile.resource}»`);
        out = this._parser.forHtml.parse(compilationFile.source);
      }
      return delete out.text, compilationFile.tokenization = out, this._traceOut("_tokenizeText", arguments), 
      out;
    }
    _replaceTextRange(text, start, end, replacement, token = !1) {
      if (this._trace("_replaceTextRange", arguments), text.length < start) throw this._tracer.printStack(), 
      new Error("Text replacement out of text boundaries (1)");
      if (text.length < end) throw this._tracer.printStack(), new Error("Text replacement out of text boundaries (2)");
      const offset = token || "@Injects" !== token.syntax ? 1 : 2;
      return text.slice(0, start) + replacement + text.slice(end + offset);
    }
    async _compileTokens(compilationFile, compilationProcess) {
      this._traceIn("_compileTokens", arguments);
      const {resource: resource, source: source, tokenization: {formatted: tokens}} = compilationFile, _tokenCompilationSwitcher = {
        "Inject Source": this._compileAsInjectSource,
        "Inject String": this._compileAsInjectString,
        "Inject Template": this._compileAsInjectTemplate,
        "Inject Module": this._compileAsInjectModule,
        "Multiline Comment Code Injection": this._compileAsMultilineCommentCodeInjection,
        "Multiline Comment Value Injection": this._compileAsMultilineCommentValueInjection,
        "Moduler Import": this._compileAsModulerImport,
        "Moduler Export": this._compileAsModulerExport,
        "@Requires": this._compileAsRequires,
        "@Injects": this._compileAsInjects,
        "Javadoc Comment": this._compileAsJavadocComment,
        "Moduler Section Get": this._compileAsModulerSectionGet,
        "Moduler Section Set": this._compileAsModulerSectionSet,
        "Moduler Section Delete": this._compileAsModulerSectionDelete,
        "Moduler Section Overwrite": this._compileAsModulerSectionOverwrite,
        "Moduler Section Fill": this._compileAsModulerSectionFill,
        "Moduler Section Expand": this._compileAsModulerSectionExpand,
        "Multiline Markdown Comment": this._compileAsMultilineMarkdownComment,
        "New Paragraph Markdown Comment": this._compileAsNewParagraphMarkdownComment,
        "New Line Markdown Comment": this._compileAsNewLineMarkdownComment,
        "Precised Tabulation Markdown Comment": this._compileAsPrecisedTabulationMarkdownComment,
        "Increased Tabulation Markdown Comment": this._compileAsIncreasedTabulationMarkdownComment,
        "Decreased Tabulation Markdown Comment": this._compileAsDecreasedTabulationMarkdownComment,
        "Inline Markdown Comment": this._compileAsInlineMarkdownComment,
        "Unspaced Inline Markdown Comment": this._compileAsUnspacedInlineMarkdownComment
      }, state = {};
      for (let tokenIndex = tokens.length - 1; tokenIndex >= 0; tokenIndex--) {
        const token = tokens[tokenIndex];
        {
          this.assert(token.syntax in _tokenCompilationSwitcher, `Syntax not identified «${token.syntax}»`);
          const methodCallback = _tokenCompilationSwitcher[token.syntax];
          await methodCallback.call(this, compilationFile, compilationProcess, {
            token: token,
            tokenIndex: tokenIndex,
            state: state
          });
        }
      }
      return this._unifyCompilationMarkdown(compilationFile, compilationProcess), this._traceOut("_compileTokens", arguments), 
      compilationFile.compilation;
    }
    async _compileRecursively(fileParameters = {}, processParameters = {}) {
      let compilationFile, compilationProcess, subcompiler, output;
      this._traceIn("_compileRecursively", arguments), this.assert("object" == typeof fileParameters, "Parameter «fileParameters» must be object on «CompilerV6.prototype._compileRecursively»"), 
      this.assert("string" == typeof fileParameters.resource, "Parameter «fileParameters.resource» must be string on «CompilerV6.prototype._compileRecursively»"), 
      this.assert("object" == typeof processParameters, "Parameter «processParameters» must be object on «CompilerV6.prototype._compileRecursively»"), 
      compilationFile = this.constructor.CompilationFile.from(fileParameters, processParameters, this), 
      compilationProcess = this.constructor.CompilationProcess.from(fileParameters, processParameters, this), 
      this.assert(processParameters.uncacheInjections === compilationProcess.uncacheInjections, "Las inyecciones 1");
      {
        const id = this.rootdirOf(compilationFile.resource);
        compilationFile.report.tree[id] = compilationFile.report.tree[id] || {};
      }
      if (compilationFile.titleIndentation = compilationFile.parentCompilation?.titleIndentation || 0, 
      compilationFile.resource.endsWith(".entry.js") && compilationFile.titleIndentation++, 
      subcompiler = this._cloneForFile(compilationFile.resource, this), compilationFile.subcompiler = subcompiler, 
      await subcompiler._fetchCompilable(compilationFile, compilationProcess), await subcompiler._renderSourceAsTemplate(compilationFile, compilationProcess), 
      subcompiler._tokenizeText(compilationFile, compilationProcess), await subcompiler._compileTokens(compilationFile, compilationProcess), 
      output = subcompiler._getPreferredOutput(compilationFile, compilationProcess), fileParameters.isRoot && (processParameters.beautify || processParameters.minify) && !this.isBrowser && "string" == typeof output.js) {
        const originalSize = this.constructor.getStringSize(output.js);
        if (processParameters.beautify) {
          const startedAt = new Date, beautifiedCode = await this.constructor.beautifyJs(output.js);
          output.beautifiedJs = {
            code: beautifiedCode,
            chars: beautifiedCode.length,
            originalSize: originalSize,
            size: this.constructor.getStringSize(beautifiedCode),
            sizeRelationOf: (beautifiedCode.length / (output.js.length || 1) * 100).toFixed(2) + "%",
            time: ((new Date - startedAt) / 1e3).toFixed(3) + "s"
          };
        }
        if (processParameters.minify) {
          const startedAt = new Date, minifiedCode = (await this.constructor.hardMinifyJs(output.js)).code;
          output.minifiedJs = {
            code: minifiedCode,
            chars: minifiedCode.length,
            originalSize: originalSize,
            size: this.constructor.getStringSize(minifiedCode),
            sizeRelationOf: (minifiedCode.length / (output.js.length || 1) * 100).toFixed(2) + "%",
            time: ((new Date - startedAt) / 1e3).toFixed(3) + "s"
          };
        }
      }
      if (fileParameters.isRoot && (output = new this.constructor.CompilationResult(output, this), 
      compilationFile.resource.endsWith(".entry.js"))) {
        const relsFile = this.normalizationOf(this.rootdirOf(compilationFile.resource).replace(/^\@\/src\//g, "@/dist/").replace(/\.entry\.js$/g, ".rels.json"));
        await this.files.writeFile.try(relsFile, JSON.stringify(compilationFile.report, null, 2), "utf8");
      }
      return this._traceOut("_compileRecursively", arguments), output;
    }
    _fetchCompilable(compilationFile, compilationProcess) {
      return this.assert("object" == typeof compilationFile, "Parameter «compilationFile» must be object on «CompilerV6.prototype._fetchCompilable»"), 
      this.assert("string" == typeof compilationFile.resource, "Parameter «compilationFile.resource» must be string on «CompilerV6.prototype._fetchCompilable»"), 
      compilationFile.resource.endsWith(".json") ? (compilationFile.extension = "json", 
      this._readPath(compilationFile.resource).then(source => (compilationFile.source = "", 
      compilationFile.compilation.json = ""))) : (this.assert(/\.(js|css|md|html)$/g.test(compilationFile.resource), `Parameter «compilationFile.resource» now «${compilationFile.resource}» must match with valid extension on «CompilerV6.prototype._fetchCompilable»`), 
      compilationFile.extension = compilationFile.resource.match(/\.(js|css|md|html)$/g)[0].substr(1), 
      void 0 === compilationProcess.extension && (compilationProcess.extension = compilationFile.extension), 
      "js" === compilationProcess.extension || ("css" === compilationProcess.extension ? this.assert("js" !== compilationFile.extension, `From a «css» file «${compilationProcess.resource}» cannot inject «js» file «${compilationFile.resource}»`) : "md" === compilationProcess.extension && (this.assert("js" !== compilationFile.extension, `From an «md» file «${compilationProcess.resource}» cannot inject «js» file «${compilationFile.resource}»`), 
      this.assert("css" !== compilationFile.extension, `From an «md» file «${compilationProcess.resource}» cannot inject «css» file «${compilationFile.resource}»`))), 
      this._readPath(compilationFile.resource).then(source => (compilationFile.source = source, 
      compilationFile.compilation[compilationFile.extension] = source)));
    }
    _tryToReadFile(file, altContent = void 0) {
      return require("fs").promises.readFile(file, "utf8").catch(err => altContent);
    }
    _prependToParentCompilationFile(compilationFile, content, extension = "md", betterAppend = !1) {
      const method = betterAppend ? "unshift" : "push";
      let mdItemMetadata = content;
      "object" == typeof content && ("titleIndentation" in content || (content.titleIndentation = compilationFile.titleIndentation)), 
      compilationFile.mdUnification[method](mdItemMetadata);
    }
    _compileAsModulerSectionGet(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      if ("data" !== compilationProcess.to) return this._trace("_compileAsModulerSectionGet", arguments), 
      !1;
    }
    _compileAsModulerSectionSet(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      if ("data" !== compilationProcess.to) return this._trace("_compileAsModulerSectionSet", arguments), 
      !1;
    }
    _compileAsModulerSectionDelete(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      if ("data" !== compilationProcess.to) return this._trace("_compileAsModulerSectionDelete", arguments), 
      !1;
    }
    _compileAsModulerSectionExpand(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      if ("data" !== compilationProcess.to) return this._trace("_compileAsModulerSectionExpand", arguments), 
      !1;
    }
    _compileAsModulerSectionOverwrite(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      if ("data" !== compilationProcess.to) return this._trace("_compileAsModulerSectionOverwrite", arguments), 
      !1;
    }
    _compileAsModulerSectionFill(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      if ("data" !== compilationProcess.to) return this._trace("_compileAsModulerSectionFill", arguments), 
      !1;
    }
    async _compileAsInjectSource(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}, options = {}) {
      this._traceIn("_compileAsInjectSource", arguments);
      let parameters, targetPath, targetCompilation, targetCaches = {};
      const currentStep = [];
      try {
        const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
        currentStep.push("1. evaluate parameters"), parameters = await this._getDataForTokenCompilation({
          compilationFile: compilationFile,
          compilationProcess: compilationProcess,
          token: token,
          tokenIndex: tokenIndex
        }), currentStep.push("2. extend token"), this._extendToken(token, [ "referenceOf" ]), 
        currentStep.push("3. extract target path"), this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectSource»"), 
        targetPath = token.referenceOf.fullpath;
        Compile_target: {
          if (currentStep.push("4. compile target"), "data" !== compilationProcess.to && !compilationProcess.uncacheInjections && Object.keys(compilationProcess.processedEntries).length && targetPath in compilationProcess.processedEntries) {
            currentStep.push("4.a. get compiled source from cache");
            const previousCache = compilationProcess.processedEntries[targetPath];
            targetCaches.js = await require("fs").promises.readFile(previousCache.distJs, "utf8"), 
            previousCache.distCss && (targetCaches.css = await this._tryToReadFile(previousCache.distCss, null)), 
            previousCache.distMd && (targetCaches.md = await this._tryToReadFile(previousCache.distMd, null));
            break Compile_target;
          }
          if (currentStep.push("4.b. compiled target newly"), !compilationProcess.dontCreateOnInjectSource) {
            if (!await this._existsFile(targetPath)) {
              currentStep.push("4.b.1. create injected file as it does not exist");
              require("path");
              const targetId = this.rootdirOf(targetPath).replace(/\.(js|css|html)$/g, "");
              await this._createDefaultInjectedFile(targetPath, targetId);
            }
          }
          currentStep.push("4.b.2. compile target recursively"), targetCompilation = await this._compileRecursively({
            resource: targetPath,
            isRoot: !1,
            parentCompilation: compilationFile
          }, compilationProcess);
        }
        currentStep.push("5. inject text in compilation");
        if ("html" === compilationFile.extension) {
          currentStep.push("5.a. from html");
          const targetIsJs = targetPath.endsWith(".js"), targetIsCss = targetPath.endsWith(".css");
          this.assert(targetIsJs || targetIsCss, `Syntax of «$compiler.inject.source» from html files can only inject «js,css» files and not when importing «${targetPath}» from «${compilationFile.resource}»`), 
          "string" != typeof targetCaches.js && (targetCaches.js = targetCompilation.js), 
          targetCaches.css = targetCaches.css || targetCompilation?.css, targetCaches.md = targetCaches.md || targetCompilation?.md;
          let newContent = targetCompilation[targetIsJs ? "js" : "css"];
          targetIsJs && (newContent = newContent.replace(/(\< *)\/( *script *\>)/gi, (match, g1, g2) => `${g1}\\/${g2}`)), 
          targetIsCss && (newContent = newContent.replace(/(\< *)\/( *style *\>)/gi, (match, g1, g2) => `${g1}\\/${g2}`)), 
          compilationFile.compilation.html = this._replaceTextRange(compilationFile.compilation.html, token.location[0], token.location[1], newContent, token);
        } else {
          currentStep.push("5.a. from js"), this.assert("js" === compilationFile.extension, `Syntax of «$compiler.inject.source» can only inject files from «js,html» files and not on «${compilationFile.extension}» when importing «${targetPath}» from «${compilationFile.resource}»`), 
          this.assert(targetPath.endsWith(".js"), `Syntax of «$compiler.inject.source» is trying to import foraneous extension format file «${targetPath}» from «${compilationFile.resource}» on «CompilerV6.prototype._compileAsInjectSource»`), 
          "string" != typeof targetCaches.js && (targetCaches.js = targetCompilation.js), 
          targetCaches.css = targetCaches.css || targetCompilation?.css, targetCaches.md = targetCaches.md || targetCompilation?.md;
          let outputJs = targetCaches.js;
          options?.modifySource && (outputJs = options.modifySource(outputJs)), compilationFile.compilation.js = this._replaceTextRange(compilationFile.compilation.js, token.location[0], token.location[1], outputJs, token);
        }
        compilationProcess.to, compilationFile?.report?.tree && targetCompilation && (currentStep.push("6. report tree of tokens"), 
        this._reportFileToken(compilationFile, targetPath, token), Object.assign(compilationFile.report.tree, targetCompilation.report.tree)), 
        this._traceOut("_compileAsInjectSource", arguments);
      } catch (error) {
        throw console.log(`[!] Error on method «_compileAsInjectSource» on root «${this.rootdir}» on resource «${this.rootdirOf(compilationFile.resource)}» and target «${this.rootdirOf(targetPath || "?")}» on step «${currentStep.reverse().join(" < ")}»`, error), 
        error;
      }
    }
    async _compileAsInjectString(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      let parameters, targetPath, fileContent;
      this._traceIn("_compileAsInjectString", arguments);
      const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
      parameters = await this._getDataForTokenCompilation({
        compilationFile: compilationFile,
        compilationProcess: compilationProcess,
        token: token,
        tokenIndex: tokenIndex
      }), this._extendToken(token, [ "referenceOf" ]), this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectString»"), 
      targetPath = token.referenceOf.fullpath, fileContent = await this._readPath(targetPath), 
      "js" === compilationFile.extension && (compilationFile.compilation.js = this._replaceTextRange(compilationFile.compilation.js, token.location[0], token.location[1], this._getStringForDevelopment(fileContent))), 
      "data" === compilationProcess.to && (this._reportFileToken(compilationFile, targetPath, token), 
      Object.assign(compilationFile.report.tree, targetCompilation.report.tree)), this._traceOut("_compileAsInjectString", arguments);
    }
    async _compileAsInjectTemplate(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      let parameters, targetPath, fileContent;
      this._traceIn("_compileAsInjectTemplate", arguments);
      const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
      parameters = await this._getDataForTokenCompilation({
        compilationFile: compilationFile,
        compilationProcess: compilationProcess,
        token: token,
        tokenIndex: tokenIndex
      }), this._extendToken(token, [ "referenceOf" ]), this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectTemplate»"), 
      targetPath = token.referenceOf.fullpath, fileContent = await this._readPath(targetPath);
      Inject_in_compilation_text: {
        if ("js" !== compilationFile.extension) break Inject_in_compilation_text;
        const templateOutput = await this._renderTemplate(fileContent, {
          __filename: targetPath,
          __dirname: require("path").dirname(targetPath),
          ...parameters[1] || {}
        });
        compilationFile.compilation.js = this._replaceTextRange(compilationFile.compilation.js, token.location[0], token.location[1], templateOutput);
      }
      "data" === compilationProcess.to && (this._reportFileToken(compilationFile, targetPath, token), 
      Object.assign(compilationFile.report.tree, targetCompilation.report.tree)), this._traceOut("_compileAsInjectTemplate", arguments);
    }
    _compileAsInjectModule(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      return this._compileAsInjectSource(compilationFile, compilationProcess, {
        token: token,
        tokenIndex: tokenIndex
      }, {
        modifySource: function(source) {
          return [ "(() => {", "let __firstHolder = {};", "let __originalHolder = __firstHolder;", "const module = {", "  get exports() {", "    return __originalHolder;", "  },", "  set exports(value) {", "    __originalHolder = value;", "  }", "};", "const exports = module.exports;", "const __result = (() => {", source, "})();", "let __output = undefined;", 'const __returnsUndefined = () => typeof __result === "undefined";', "const __isSameEmptyObject = () => (module.exports === __firstHolder) && ((Object.keys(__firstHolder).length === 0));", "if(!__returnsUndefined()) {", "  __output = module.exports = __result;", "} else if(!__isSameEmptyObject()) {", "  __output = module.exports;", "}", "return __output;", "})()" ].join("\n");
        }
      });
    }
    _compileAsMultilineCommentCodeInjection() {
      this._trace("_compileAsMultilineCommentCodeInjection", arguments);
    }
    _compileAsMultilineCommentValueInjection() {
      this._trace("_compileAsMultilineCommentValueInjection", arguments);
    }
    async _compileAsModulerImport(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      "data" !== compilationProcess.to && this._trace("_compileAsModulerImport", arguments), 
      this._traceIn("_compileAsModulerImport", arguments);
      let parameters, namedParameters = {}, targetPaths = [];
      const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot, subcompiler: subcompiler} = compilationFile;
      if (parameters = await this._getDataForTokenCompilation({
        compilationFile: compilationFile,
        compilationProcess: compilationProcess,
        token: token,
        tokenIndex: tokenIndex
      }, {
        onError: error => error
      }), parameters instanceof Error) console.error(`The load of inner parameters of token type «$moduler.import» on file «${compilationFile.resource}» could not be retrieved maybe because of runtime code that cannot be solved on compilation-time on «ModulerV6.prototype._compileAsModulerImport»`), 
      console.error(parameters); else {
        namedParameters = this.moduler._formatImportParameters(parameters, compilationFile.resource), 
        targetPaths = (namedParameters.file ? [ namedParameters.file ] : []).concat(namedParameters.dependencies), 
        token.dependenciesOf = targetPaths;
        for (let indexTarget = 0; indexTarget < targetPaths.length; indexTarget++) {
          const targetPath = targetPaths[indexTarget], targetCompilation = await subcompiler._compileRecursively({
            resource: subcompiler.fullpathOf(targetPath),
            isRoot: !1,
            parentCompilation: compilationFile
          }, compilationProcess);
          this._reportFileToken(compilationFile, targetPath, token), Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
        }
      }
      this._traceOut("_compileAsModulerImport", arguments);
    }
    async _compileAsModulerExport(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      "data" !== compilationProcess.to && this._trace("_compileAsModulerExport", arguments), 
      this._traceIn("_compileAsModulerExport", arguments);
      let parameters, namedParameters = {}, targetPaths = [];
      const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot, subcompiler: subcompiler} = compilationFile;
      if (parameters = await this._getDataForTokenCompilation({
        compilationFile: compilationFile,
        compilationProcess: compilationProcess,
        token: token,
        tokenIndex: tokenIndex
      }, {
        onError: error => error
      }), parameters instanceof Error) console.error(`The load of inner parameters of token type «$moduler.export» on file «${compilationFile.resource}» could not be retrieved maybe because of runtime code that cannot be solved on compilation-time on «ModulerV6.prototype._compileAsModulerExport»`), 
      console.error(parameters); else {
        namedParameters = this.moduler._formatExportParameters(parameters, compilationFile.resource), 
        targetPaths = (namedParameters.file ? [ namedParameters.file ] : []).concat(namedParameters.dependencies), 
        token.dependenciesOf = targetPaths;
        for (let indexTarget = 0; indexTarget < targetPaths.length; indexTarget++) {
          const targetPath = targetPaths[indexTarget], targetCompilation = await subcompiler._compileRecursively({
            resource: subcompiler.fullpathOf(targetPath),
            isRoot: !1,
            parentCompilation: compilationFile
          }, compilationProcess);
          this._reportFileToken(compilationFile, targetPath, token), Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
        }
      }
      this._traceOut("_compileAsModulerExport", arguments);
    }
    async _compileAsRequires(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      if ("data" !== compilationProcess.to) return this._trace("_compileAsRequires", arguments), 
      !1;
      let parameters, targetPath, targetCompilation;
      this._traceIn("_compileAsRequires", arguments);
      const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
      parameters = await this._getDataForTokenCompilation({
        compilationFile: compilationFile,
        compilationProcess: compilationProcess,
        token: token,
        tokenIndex: tokenIndex
      }), this._extendToken(token, [ "referenceOf" ]), this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsRequires»"), 
      targetPath = token.referenceOf.fullpath, targetCompilation = await this._compileRecursively({
        resource: targetPath,
        isRoot: !1,
        parentCompilation: compilationFile
      }, compilationProcess), "data" === compilationProcess.to && (this._reportFileToken(compilationFile, targetPath, token), 
      Object.assign(compilationFile.report.tree, targetCompilation.report.tree)), this._traceOut("_compileAsRequires", arguments);
    }
    async _compileAsInjects(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
      this._traceIn("_compileAsInjects", arguments);
      let parameters, targetPath, targetCompilation, wasPrepended = !1;
      const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
      parameters = await this._getDataForTokenCompilation({
        compilationFile: compilationFile,
        compilationProcess: compilationProcess,
        token: token,
        tokenIndex: tokenIndex
      });
      Early_delegation_to_compileAsInjectSource: {
        const fromJs = compilationFile.resource?.endsWith(".js");
        if (!fromJs) break Early_delegation_to_compileAsInjectSource;
        if (parameters[0].endsWith(".js")) return await this._compileAsInjectSource(compilationFile, compilationProcess, {
          token: token,
          tokenIndex: tokenIndex
        });
      }
      if (this._extendToken(token, [ "referenceOf" ]), this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjects»"), 
      targetPath = token.referenceOf.fullpath, targetCompilation = await this._compileRecursively({
        resource: targetPath,
        isRoot: !1,
        parentCompilation: compilationFile
      }, compilationProcess), compilationFile.resource.endsWith(".js")) {
        let replacement = "";
        if (targetPath.endsWith(".js")) return this._compileAsInjectSource(...arguments);
        if (targetPath.endsWith(".css")) compilationFile.compilation.css += "\n" + targetCompilation.css; else if (!targetPath.endsWith(".md")) throw new Error(`Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`);
        compilationFile.compilation.js = this._replaceTextRange(compilationFile.compilation.js, token.location[0], token.location[1], replacement);
      } else if (compilationFile.resource.endsWith(".css")) {
        let replacement = "";
        if (targetPath.endsWith(".js")) throw new Error("Syntax of «@injects» can't be used to import «js» files from «css» files. Use another syntax instead.");
        if (targetPath.endsWith(".css")) compilationFile.compilation.css += "\n" + targetCompilation.css; else if (!targetPath.endsWith(".md")) throw new Error(`Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`);
        compilationFile.compilation.css = this._replaceTextRange(compilationFile.compilation.css, token.location[0], token.location[1], replacement);
      } else {
        if (!compilationFile.resource.endsWith(".md")) {
          if (compilationFile.resource.endsWith(".html")) {
            if (targetPath.endsWith(".js")) return this._compileAsInjectSource(...arguments);
            if (targetPath.endsWith(".css")) return this._compileAsInjectSource(...arguments);
            throw new Error("Syntax of «@injects» can only be used to import «js,css» files from «html» files.");
          }
          throw new Error(`Syntax of «@injects» should only be available on «css,md» files and not on «${compilationFile.extension}»`);
        }
        if (targetPath.endsWith(".js")) throw new Error("Syntax of «@injects» can't be used to import «js» files from «md» files. Use another syntax instead.");
        if (targetPath.endsWith(".css")) throw new Error("Syntax of «@injects» can't be used to import «css» files from «md» files. Use another syntax instead.");
        if (!targetPath.endsWith(".md")) throw new Error(`Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`);
        this._prependToParentCompilationFile(compilationFile, {
          prefix: "\n\n",
          tabulation: 0,
          body: this._replaceTextRange(compilationFile.compilation.md, token.location[0], token.location[1] - 0, targetCompilation.md)
        }, "md", !1), wasPrepended = !0;
      }
      wasPrepended || this._prependToParentCompilationFile(compilationFile, {
        prefix: "\n\n",
        tabulation: 0,
        body: targetCompilation.md
      }, "md", !1), compilationProcess.to, compilationFile?.report?.tree && targetCompilation && (this._reportFileToken(compilationFile, targetPath, token), 
      Object.assign(compilationFile.report.tree, targetCompilation.report.tree)), this._traceOut("_compileAsInjects", arguments);
    }
    _compileAsJavadocComment() {
      this._trace("_compileAsJavadocComment", arguments);
    }
    async _compileAsMultilineMarkdownComment(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex, state: state}) {
      let output = "";
      output += this._removeInitialSpace(token.inner).split("\n").map(line => line.replace(/^[ \t]*\* ?/g, "")).join("\n").replace(/\n[\t ]*$/g, ""), 
      this._prependToParentCompilationFile(compilationFile, {
        prefix: "\n",
        tabulation: 0,
        body: output
      }, "md");
    }
    async _compileAsNewParagraphMarkdownComment(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex, state: state}) {
      let output = "";
      output += this._removeInitialSpace(token.inner), this._prependToParentCompilationFile(compilationFile, {
        prefix: "\n\n",
        tabulation: 0,
        body: output
      }, "md");
    }
    async _compileAsNewLineMarkdownComment(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex, state: state}) {
      let output = "";
      output += this._removeInitialSpace(token.inner), this._prependToParentCompilationFile(compilationFile, {
        prefix: "\n",
        tabulation: 0,
        body: output
      }, "md");
    }
    async _compileAsPrecisedTabulationMarkdownComment(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex, state: state}) {
      const precisionText = token.inner.match(/^[0-9]+/g)[0], precisionNumber = parseInt(precisionText), innerText = token.inner.substr(precisionText.length + 1);
      if (innerText.trim()) {
        let output = "";
        output += this._removeInitialSpace(innerText), this._prependToParentCompilationFile(compilationFile, {
          prefix: "\n",
          tabulation: "." + precisionNumber,
          body: output
        }, "md");
      } else this._prependToParentCompilationFile(compilationFile, {
        prefix: "",
        tabulation: "." + precisionNumber,
        body: ""
      }, "md");
    }
    async _compileAsIncreasedTabulationMarkdownComment(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex, state: state}) {
      const increasionNumber = (token.inner.match(/^(\+)+/g) || [ "" ])[0].length + 1;
      let output = "";
      output += this._removeInitialSpace(token.inner.substr(increasionNumber + 1)), this._prependToParentCompilationFile(compilationFile, {
        prefix: "\n",
        tabulation: 1,
        body: output
      }, "md");
    }
    async _compileAsDecreasedTabulationMarkdownComment(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex, state: state}) {
      const decreasionNumber = (token.inner.match(/^(\-)+/g) || [ "" ])[0].length + 1;
      let output = "";
      output += this._removeInitialSpace(token.inner.substr(decreasionNumber + 1)), this._prependToParentCompilationFile(compilationFile, {
        prefix: "\n",
        tabulation: -1,
        body: output
      }, "md");
    }
    async _compileAsInlineMarkdownComment(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex, state: state}) {
      let output = " ";
      output += this._removeInitialSpace(token.inner), this._prependToParentCompilationFile(compilationFile, {
        prefix: " ",
        tabulation: 0,
        body: output
      }, "md");
    }
    async _compileAsUnspacedInlineMarkdownComment(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex, state: state}) {
      let output = "";
      output += this._removeInitialSpace(token.inner), this._prependToParentCompilationFile(compilationFile, {
        prefix: "",
        tabulation: 0,
        body: output
      }, "md");
    }
    _extractMarkdownTableOfContents(text, asMarkdown = !1) {
      const entries = [], slugCounters = {}, lines = text.split(/\r?\n/);
      let insideCodeBlock = !1;
      for (const line of lines) {
        if (/^\s*```/.test(line)) {
          insideCodeBlock = !insideCodeBlock;
          continue;
        }
        if (insideCodeBlock) continue;
        const match = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/);
        if (!match) continue;
        const level = match[1].length - 1, title = match[2].trim();
        let slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/<[^>]*>/g, "").replace(/[`*_~]/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
        void 0 === slugCounters[slug] ? slugCounters[slug] = 0 : (slugCounters[slug]++, 
        slug += "-" + slugCounters[slug]), entries.push({
          level: level,
          title: title,
          slug: slug
        });
      }
      if (!asMarkdown) return entries;
      const minLevel = entries.length ? Math.min(...entries.map(it => it.level)) : 0;
      return entries.map(it => `${"  ".repeat(Math.max(0, it.level - minLevel))}- ${this._toMarkdownLink(it.title)}`).join("\n");
    }
    _extractMarkdownRelations(compilationFile) {
      let output = "";
      const input = compilationFile.report.tree, files = Object.keys(input);
      for (let indexFile = 0; indexFile < files.length; indexFile++) {
        const fileId = files[indexFile], file = input[fileId], tokens = Object.keys(file);
        output += `- **${fileId}**`, output += tokens.length ? ` uses **${tokens.length} files**\n` : " *free*\n";
        let counter = 0;
        for (let indexToken = 0; indexToken < tokens.length; indexToken++) {
          const token = file[tokens[indexToken]];
          output += `  ${++counter}. *${(() => token.referenceOf?.rootpath ? token.referenceOf.rootpath : token.inner)()}* with **${token.syntax}**\n`;
        }
      }
      return output;
    }
    _toMarkdownLink(title) {
      const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/<[^>]*>/g, "").replace(/[`*_~]/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
      return `[${title}](#${slug})`;
    }
    _initializeLogger(directory) {
      return this._trace("_initializeLogger", arguments), this._logger = this.constructor.Logger.Manager.fromDirectory(directory, this);
    }
    _reportFileToken(compilationFile, targetBrute, token) {
      this._traceIn("_reportFileToken", arguments);
      const owner = this.rootdirOf(compilationFile.resource);
      this.rootdirOf(targetBrute);
      owner in compilationFile.report.tree || (compilationFile.report.tree[owner] = {});
      const reportedToken = this._cloneStructureAsJson(token);
      delete reportedToken.location, compilationFile.report.tree[owner][token.location.join("-")] = reportedToken, 
      this._traceOut("_reportFileToken", arguments);
    }
    _getPreferredOutput(compilationFile, compilationProcess) {
      return this._trace("_getPreferredOutput", arguments), {
        file: compilationFile.resource,
        report: compilationFile.report || !1,
        ...compilationFile.compilation
      };
    }
    _hydrateParameters(parametersSource) {
      return this._trace("_hydrateParameters", arguments), new Function(`return [${parametersSource}]`).call();
    }
    _cloneForFile(resource, compiler = !1) {
      this._traceIn("_cloneForFile", arguments), this.assert("string" == typeof resource, "Parameter «resource» must be string on «CompilerV6.prototype._cloneForFile»"), 
      this.assert("string" == typeof this.basedir, "Property «this.basedir» must be string on «CompilerV6.prototype._cloneForFile»");
      const dirpath = require("path").dirname(this.fullpathOf(resource)), clone = new this.constructor(dirpath, compiler || this);
      return this._traceOut("_cloneForFile", arguments), clone;
    }
    _cloneStructureAsJson(data) {
      return JSON.parse(JSON.stringify(data));
    }
    _extendToken(token, fields = [], submoduler = !1) {
      return this._trace("_extendToken", arguments), Object.assign(token, fields.includes("referenceOf") ? {
        referenceOf: (() => {
          const entry = this._hydrateParameters(token.inner)[0], fullpath = this.fullpathOf(entry);
          return {
            type: "file",
            entry: entry,
            fullpath: fullpath,
            rootpath: this.rootdirOf(fullpath)
          };
        })()
      } : {});
    }
    async _getDataForTokenCompilation(input, options = {}) {
      let output, parameters;
      if (this._traceIn("_getDataForTokenCompilation", arguments), this.assert("object" == typeof input, "Parameter «input» must be object on «CompilerV6.prototype._getDataForTokenCompilation»"), 
      this.assert("object" == typeof input.token, "Parameter «input.token» must be object on «CompilerV6.prototype._getDataForTokenCompilation»"), 
      this.assert("string" == typeof input.token.inner, "Parameter «input.token.inner» must be string on «CompilerV6.prototype._getDataForTokenCompilation»"), 
      "function" == typeof options.onError) try {
        parameters = this._hydrateParameters(input.token.inner), this.assert(Array.isArray(parameters), `Parameters of injection must be an array in «${input.token.inner}» extracting parameters from resource «${input.resource}» on «CompilerV6.prototype._getDataForTokenCompilation»`), 
        output = parameters;
      } catch (error) {
        output = options.onError(error, parameters);
      } else parameters = this._hydrateParameters(input.token.inner), this.assert(Array.isArray(parameters), `Parameters of injection must be an array in «${input.token.inner}» on «CompilerV6.prototype._getDataForTokenCompilation»`), 
      output = parameters;
      return this._traceOut("_getDataForTokenCompilation", arguments), output;
    }
    _getStringForDevelopment(text, tab = 0) {
      return this._trace("_getStringForDevelopment", arguments), text.split("\n").map(line => JSON.stringify(line)).join("\n + ");
    }
    _existsFile(file) {
      const fullpathFile = this.normalizationOf(file);
      return require("fs").promises.readFile(fullpathFile).then(out => !0).catch(err => !1);
    }
    _createDefaultInjectedFile(file, targetId) {
      const filename = require("path").basename(file).replace(/\.js$/g, "");
      let name, targetType, targetRootdir;
      targetType = "any", targetRootdir = this.rootdirOf(file), name = (() => {
        const isPrototype = filename.startsWith("prototype."), isStatic = filename.startsWith("static."), isClass = filename.endsWith(".class"), isAsync = filename.match(/(^async\.)|(\.async\.)|(\.async$)/g), isSync = filename.match(/(^sync\.)|(\.sync\.)|(\.sync$)/g), isOnlyClass = isClass && !isPrototype && !isStatic, fileId = filename.replace(/^(prototype|static)\./g, "").replace(/^a?sync\./g, "").replace(/\.a?sync$/g, "").replace(/\.class$/g, ""), isJsFriendly = fileId.match(/^[A-Za-z_$][A-Za-z0-9_$]*$/g);
        let out = "", prefixes = "", middle = "", suffixes = "";
        return isStatic ? (prefixes += "static ", targetType = "static class member") : isPrototype ? targetType = "prototype class member" : isClass && (targetType = "only class"), 
        isClass ? ((isStatic || isPrototype) && (suffixes += " = "), suffixes += `class ${fileId}`, 
        targetType = "class" === targetType ? targetType : targetType + " + class") : isAsync ? (prefixes += "async ", 
        suffixes += "()", targetType += " + async") : isSync ? (prefixes += "", suffixes += "()", 
        targetType += " + sync") : suffixes = " ()", isOnlyClass || (middle = isJsFriendly ? fileId : JSON.stringify(fileId)), 
        out = prefixes + middle + suffixes, out;
      })();
      const headerComment = `${[ "/", "*", "*" ].join("")}\n   * @file ${targetRootdir}\n   * @type ${targetType}\n   */`;
      return require("fs").promises.writeFile(file, `${name} {\n  ${headerComment}\n}`, "utf8").catch(error => {
        console.log(`[!] Could not create injected path «${file}» on «ModulerV6.prototype._compileAsInjectSource»`);
      });
    }
    async _renderSourceAsTemplate(compilationFile, compilationProcess) {
      return compilationFile.resource.endsWith(".js") ? compilationProcess.disableTemplates ? "ok:2:disabled templates" : void (compilationFile.compilation.js = compilationFile.source = await this._renderTemplate(compilationFile.source, {
        compilationFile: compilationFile,
        compilationProcess: compilationProcess,
        $compiler: this
      })) : "ok:1:no js file so no template";
    }
    async _renderTemplate(templateSource, argsBrute = {}) {
      const {tokens: tokens} = this._parser.forTemplateComments.parse(templateSource);
      if (!tokens.length) return templateSource;
      const tokenType1 = [ "/", "*", "%" ].join(""), tokenType2 = [ "/", "*", "%", "=" ].join(""), args = Object.assign({}, argsBrute), code = [ "const __out=[];\nconst print = function(...x) {\n  return __out.push(...x);\n};" ];
      let cursor = 0;
      for (const token of tokens) cursor < token.location[0] && code.push(`__out.push(${JSON.stringify(templateSource.slice(cursor, token.location[0]))});`), 
      token.type === tokenType1 ? code.push(token.inner) : token.type === tokenType2 && code.push(`__out.push(await (${token.inner}));`), 
      cursor = token.location[1] + 0;
      cursor < templateSource.length && code.push(`__out.push(${JSON.stringify(templateSource.slice(cursor))});`), 
      code.push("return __out.join('');");
      const templateCallback = new async function() {}.constructor(...Object.keys(args), code.join(""));
      return await templateCallback.call(this, ...Object.values(args));
    }
    _removeInitialSpace(text) {
      return text.startsWith(" ") ? text.substr(1) : text;
    }
    _unifyCompilationMarkdown(compilationFile, compilationProcess) {
      let output, tabulation = 0;
      output = compilationFile.mdUnification.slice().reverse().map(it => {
        if ("string" == typeof it) return it;
        "number" == typeof it.tabulation ? tabulation += it.tabulation : "string" == typeof it.tabulation && (tabulation = parseInt(it.tabulation.substr(1)));
        let finalText, indentedBody = it.body;
        return it.titleIndentation && (indentedBody = indentedBody.replace(/(^|\n)\#/g, "\n#" + "#".repeat(it.titleIndentation))), 
        finalText = it.prefix + "   ".repeat(tabulation) + indentedBody, finalText;
      }).join("");
      Inject_table_of_contents: {
        if (!output.includes("{{ Table of contents }}")) break Inject_table_of_contents;
        const toc = this._extractMarkdownTableOfContents(output, !0);
        output = output.replace("{{ Table of contents }}", toc);
      }
      Inject_relations: {
        if (!output.includes("{{ Relations }}")) break Inject_relations;
        const rels = this._extractMarkdownRelations(compilationFile);
        output = output.replace("{{ Relations }}", rels);
      }
      compilationFile.compilation.md += output, compilationFile.parentCompilation && this._prependToParentCompilationFile(compilationFile.parentCompilation, output, "md", !1);
    }
    normalizationOf(nodepath, origin = !1) {
      return this._trace("normalizationOf", arguments), this.moduler.normalizationOf(nodepath);
    }
    rootdirOf(fullpath) {
      this._trace("rootdirOf", arguments);
      const normalization = this.normalizationOf(fullpath);
      return normalization.startsWith(this.rootdir + "/") ? normalization.replace(this.rootdir + "/", "@/") : normalization;
    }
    fullpathOf(nodepath) {
      return this._trace("fullpathOf", arguments), nodepath.startsWith("@/") ? require("path").resolve(this.rootdir, nodepath.substr(2)) : require("path").resolve(this.basedir, nodepath);
    }
    async compile(resource, options = {}) {
      return this._compileRecursively({
        resource: this.normalizationOf(resource),
        isRoot: !0
      }, {
        ...options
      });
    }
    setBasedir(basedir) {
      this.basedir = this.normalizationOf(basedir), this.moduler.basedir = this.basedir;
    }
    setRootdir(rootdir) {
      this.rootdir = this.normalizationOf(rootdir), this.moduler.rootdir = this.rootdir;
    }
    log(...args) {
      this._logger || (this._logger = new this.constructor.Logger({
        file: !1
      }, this)), this._logger.log(...args);
    }
  };
  return CompilerV6;
}.call());