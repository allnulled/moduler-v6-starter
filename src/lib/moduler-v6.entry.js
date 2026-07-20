(function(mod) {
    if (typeof $moduler === "undefined") {
        if (typeof window !== "undefined") window["$moduler"] = mod.globalInstance;
        if (typeof global !== "undefined") global["$moduler"] = mod.globalInstance;
    }
    if (typeof ModulerV6 === "undefined") {
        if (typeof window !== "undefined") window["ModulerV6"] = mod;
        if (typeof global !== "undefined") global["ModulerV6"] = mod;
    }
    return ModulerV6;
})(function() {
    return class ModulerV6 {
        static AssertionError=class AssertionError extends Error {
            constructor(message) {
                super(message);
                this.name = "AssertionError";
            }
        };
        static CssManager=class CssManager {
            constructor(moduler, cloneOfCssManager = null) {
                this.trace("constructor", arguments);
                this.assert(typeof moduler === "object", `Parameter «moduler» must be object on «CssManager.constructor»`);
                this.assert(moduler instanceof ModulerV6, `Parameter «moduler» must be instance of ModulerV6 on «CssManager.constructor»`);
                this.moduler = moduler;
                this.sheets = {};
                this.parser = TextParserV1.create(ModulerV6.defaultGrammars.forCssOnRuntime);
                this._isTracing = true;
            }
            async _addRecursively(fileBrute, addEvent = {
                sheets: {}
            }) {
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
                    addEvent.sheets[file] = {
                        priority: undefined
                    };
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
            _fetchSheet(file) {
                return this.moduler._readPath(file);
            }
            _extractRequires(source, file) {
                const matches = this.parser.parse(source);
                matches.file = {
                    original: file,
                    absolute: this.moduler.normalizationOf(file),
                    basedir: this.moduler.basedir,
                    based: this.moduler.basedirOf(file),
                    rootdir: this.moduler.rootdir,
                    rooted: this.moduler.rootdirOf(file)
                };
                return matches;
            }
            trace(method, args = [], forceLog = false) {
                if (this._isTracing || forceLog) {
                    console.log(`[css-manager][${method}] ${args.length} args: ${[ ...args ].map(arg => typeof arg).join(",")}`);
                }
            }
            assert(condition, message) {
                if (!condition) throw new Error(message);
            }
            async add(input) {
                let output = undefined;
                if (typeof input === "string") {
                    output = await this._addRecursively(input);
                } else if (Array.isArray(input)) {
                    output = [];
                    for (let index = 0; index < input.length; index++) {
                        const item = input[index];
                        this.moduler.assert(typeof item === "string", `Parameter «arguments[0][${index}]» must be string too on «CssManager.prototype.add»`);
                        const result = await this._addRecursively(item);
                        output.push(result);
                    }
                } else {
                    throw new Error(`Parameter «arguments[0]» can only be string or array on «CssManager.prototype.add»`);
                }
                return output;
            }
            remove(file) {}
            synchronize() {
                let outputCss = "";
                const sorted = this.getSortedSheets().map(sheet => `\n/*!file:${JSON.stringify(sheet.id)}*/\n${sheet.source}`).join("\n").replace(/\/\*\@requires\:/g, "/*!requires:");
                return sorted;
            }
            cloneForFile(file) {
                const submoduler = this.moduler.cloneForFile(file);
                Synchronized_inheritance_between_css_managers: {
                    submoduler.css.sheets = this.sheets;
                }
                return submoduler;
            }
            getSortedSheets() {
                return Object.keys(this.sheets).map(id => ({
                    id: id,
                    ...this.sheets[id]
                })).sort((a, b) => a.priority - b.priority);
            }
        };
        static SectionsManager=class SectionsManager {
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
                return it === null;
            }
            _hasKey(obj, prop) {
                return prop in obj;
            }
            _splitPropertyPath(path) {
                return path.split("/").filter(Boolean);
            }
            _getPropertyAndHolder(path, throwOnMissing = true, commingFromMethod = "_getPropertyAndHolder") {
                const keys = this._splitPropertyPath(path);
                const last = keys.pop();
                let obj = this.root;
                let counter = -1;
                for (const key of keys) {
                    counter++;
                    if (this.isNull(obj[key]) || !this._isPropertoid(obj[key])) {
                        if (throwOnMissing) {
                            throw new Error(`Missing iterable intermediate property «${key}» at index «${counter}» of path «${path}» on «SectionsManager.prototype._getPropertyAndHolder called from method «SectionsManager.prototype.${commingFromMethod}»`);
                        }
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
                const ref = this._getPropertyAndHolder(path, false, "has");
                if (!this._isPropertoid(ref.obj)) return false;
                return ref.last in ref.obj;
            }
            get(path, defaultValue = Error) {
                const ref = this._getPropertyAndHolder(path, false, "get");
                this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.get»`);
                if (!this._hasKey(ref.obj, ref.last)) {
                    if (defaultValue === Error) throw new Error(`Could not find section property «${ref.last}» in path «${path}» on «SectionsManager.prototype.get»`);
                    return defaultValue;
                }
                return ref.obj[ref.last];
            }
            set(path, value) {
                const ref = this._getPropertyAndHolder(path, false, "set");
                this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.set»`);
                return ref.obj[ref.last] = value;
            }
            initialize(path, value) {
                const ref = this._getPropertyAndHolder(path, false, "initialize");
                this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.initialize»`);
                if (this._hasKey(ref.obj, ref.last)) return ref.obj[ref.last];
                return ref.obj[ref.last] = value;
            }
            overwrite(path, values = {}) {
                const ref = this._getPropertyAndHolder(path, false, "overwrite");
                this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.overwrite»`);
                return Object.assign(ref.obj[ref.last] ??= {}, values);
            }
            fill(path, values = {}) {
                const ref = this._getPropertyAndHolder(path, false, "fill");
                this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.fill»`);
                return ref.obj[ref.last] = Object.assign({}, values, ref.obj[ref.last] ??= {});
            }
            expand(path, values = {}) {
                const ref = this._getPropertyAndHolder(path, false, "expand");
                Initialize_if_it_is_empty: {
                    this._assert(this._isPropertoid(ref.obj), `Could not access last property «${ref.last}» in path «${path}» because its holder is not «object» or «function» but «${typeof ref.obj}» on «SectionsManager.prototype.expand»`);
                    if (!this._hasKey(ref.obj, ref.last)) {
                        ref.obj[ref.last] = {};
                    }
                }
                Check_it_has_no_common_properties_before_overwriting: {
                    this._assert(this._isPropertoid(ref.obj[ref.last]), `Could not expand last property «${ref.last}» in path «${path}» with more properties because the previous value is of type «${typeof ref.obj[ref.last]}» on «SectionsManager.prototype.expand»`);
                    const val = ref.obj[ref.last];
                    for (let prop in values) {
                        this._assert(!this._hasKey(val, prop), `Property «${prop}» under path «${path}» cannot be expanded because it is already initialized on «SectionsManager.prototype.expand»`);
                    }
                }
                Overwrite: {
                    return Object.assign(ref.obj[ref.last], values);
                }
            }
            delete(path) {
                const ref = this._getPropertyAndHolder(path, false, "delete");
                if ([ "object", "function" ].includes(typeof ref.obj)) {
                    if (ref.obj === null) {
                        throw new Error(`Cannot delete property «${ref.last}» of a null value of path «${path}» on «SectionsManager.prototype.delete»`);
                    } else if (ref.obj instanceof Array) {
                        ref.obj.splice(ref.last, 1);
                    } else {
                        delete ref.obj[ref.last];
                    }
                } else {
                    throw new Error(`Cannot delete property «${ref.last}» of a holder of type «${typeof ref.obj}» of path «${path}» on «SectionsManager.prototype.delete»`);
                }
                return ref.obj[ref.last];
            }
            reset() {
                this.root = {};
                return this;
            }
        };
        static Parser=function(mod) {
            if (typeof window !== "undefined") window["TextParserV1"] = mod;
            if (typeof global !== "undefined") global["TextParserV1"] = mod;
            return mod;
        }(function() {
            const TextParserV1 = class TextParserV1 {
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
                        if (typeof grammar[2] === "undefined" || grammar[2] === null) {
                            grammar[2] = it => it;
                        }
                        if (typeof grammar[3] === "undefined" || grammar[3] === null) {
                            grammar[3] = {
                                allowInside: false,
                                includeAppendix: undefined
                            };
                        }
                        this.assert(typeof grammar === "object", `Grammar «${index}» must be object`);
                        this.assert(typeof grammar[0] === "string", `Item «0» in grammar «${index}» must be string`);
                        this.assert(typeof grammar[1] === "string" || typeof grammar[1] === "object", `Item «1» in grammar «${index}» must be string or object`);
                        this.assert(typeof grammar[2] === "function", `Item «2» in grammar «${index}» must be function`);
                        this.assert(typeof grammar[3] === "object", `Item «3» in grammar «${index}» must be object`);
                        if ("allowInside" in grammar[3] && typeof grammar[3].allowInside !== "undefined") {
                            this.assert(typeof grammar[3].allowInside === "boolean", `Property «allowInside» in item «3» in grammar «${index}» must be boolean or none`);
                        }
                        if ("includeAppendix" in grammar[3] && typeof grammar[3].includeAppendix !== "undefined") {
                            if (Array.isArray(grammar[3].includeAppendix)) {
                                for (let appendixIndex = 0; appendixIndex < grammar[3].includeAppendix.length; appendixIndex++) {
                                    this.assert([ "string", "function" ].includes(typeof grammar[3].includeAppendix[appendixIndex]), `Property «includeAppendix» in item «3» in grammar «${index}» and in index «${appendixIndex}» must be string or function or none`);
                                }
                            } else {
                                this.assert([ "string", "function" ].includes(typeof grammar[3].includeAppendix), `Property «includeAppendix» in item «3» in grammar «${index}» must be array, string or function or none`);
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
                    const allAppendixes = Array.isArray(grammar[3].includeAppendix) ? grammar[3].includeAppendix : [ grammar[3].includeAppendix ];
                    for (let appendixIndex = 0; appendixIndex < allAppendixes.length; appendixIndex++) {
                        const oneAppendix = allAppendixes[appendixIndex];
                        if (text.startsWith(oneAppendix, currentPosition + ender.length)) {
                            return oneAppendix.length;
                        }
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
                    Iterating_tokens: for (let indexToken = 0; indexToken < tokens.length; indexToken++) {
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
                    Iterating_text: while (state.position < text.length) {
                        Iterating_grammars: for (let index = 0; index < this.grammars.length; index++) {
                            const grammar = this.grammars[index];
                            const [starter, ender, formatter, options] = grammar;
                            const isMatchingStarter = text.startsWith(starter, state.position);
                            On_not_matched: if (!isMatchingStarter) {
                                continue Iterating_grammars;
                            }
                            const countingFrom = state.position + starter.length;
                            let offset = 0;
                            let wasEnded = false;
                            Processing_match: if (typeof ender === "string") {
                                while (countingFrom + offset < text.length) {
                                    const currentPosition = countingFrom + offset;
                                    const isMatchingEnder = text.startsWith(ender, currentPosition);
                                    if (isMatchingEnder) {
                                        wasEnded = true;
                                        this._pushToken({
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
                            } else if (ender === this.constructor.symbols.PARENTHESYS_BALANCE) {
                                let openedParenthesys = 1;
                                let wasEnded = false;
                                while (countingFrom + offset < text.length) {
                                    const currentPosition = countingFrom + offset;
                                    if (text[currentPosition] === "(") {
                                        openedParenthesys++;
                                    } else if (text[currentPosition] === ")") {
                                        openedParenthesys--;
                                        if (openedParenthesys === 0) {
                                            wasEnded = true;
                                            this._pushToken({
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
                                    }
                                    offset++;
                                }
                                if (!wasEnded) throw new Error(`Unclosed starter of grammar «${starter}» reached end of text but the first parenthesys was not closed on grammar index «${index}»`);
                            } else {
                                throw new Error(`Ender (2nd argument) of grammar «${starter}» at grammar index «${index}» has not valid type: «${typeof ender}»`);
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
        }.call());
        static assert(condition, message) {
            if (!condition) throw new this.AssertionError(message);
        }
        static isBrowser=typeof window !== "undefined";
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
            ImportJs: [ "$moduler.import(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Import",
                    ...token
                };
            }, {
                allowInside: true
            } ],
            ExportJs: [ "$moduler.export(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Export",
                    ...token
                };
            }, {
                allowInside: true
            } ],
            SectionGet: [ "$moduler.section.get(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Section Get",
                    ...token
                };
            }, {
                allowInside: true
            } ],
            SectionSet: [ "$moduler.section.set(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Section Set",
                    ...token
                };
            }, {
                allowInside: true
            } ],
            SectionOverwrite: [ "$moduler.section.overwrite(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Section Overwrite",
                    ...token
                };
            }, {
                allowInside: true
            } ],
            SectionExpand: [ "$moduler.section.expand(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Section Expand",
                    ...token
                };
            }, {
                allowInside: true
            } ],
            SectionFill: [ "$moduler.section.fill(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Section Fill",
                    ...token
                };
            }, {
                allowInside: true
            } ],
            SectionHas: [ "$moduler.section.has(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Section Has",
                    ...token
                };
            }, {
                allowInside: true
            } ],
            SectionInitialize: [ "$moduler.section.initialize(", this.Parser.symbols.PARENTHESYS_BALANCE, function(token) {
                return {
                    syntax: "Moduler Section Initialize",
                    ...token
                };
            }, {
                allowInside: true
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
                    ...token
                };
            } ],
            JavadocComment: [ "/**", "*/", function(token) {
                return {
                    syntax: "Javadoc Comment",
                    ...token
                };
            }, {
                allowInside: true
            } ]
        };
        static defaultGrammars={
            forJs: [ this.nativeGrammars.InjectSource, this.nativeGrammars.InjectString, this.nativeGrammars.InjectTemplate, this.nativeGrammars.ImportJs, this.nativeGrammars.ExportJs, this.nativeGrammars.AtRequires, this.nativeGrammars.AtInjects, this.nativeGrammars.JavadocComment ],
            forCss: [ this.nativeGrammars.InjectSource, this.nativeGrammars.InjectString, this.nativeGrammars.InjectTemplate, this.nativeGrammars.ImportJs, this.nativeGrammars.ExportJs, this.nativeGrammars.AtRequires, this.nativeGrammars.AtInjects, this.nativeGrammars.JavadocComment ],
            forMd: [ this.nativeGrammars.InjectSource, this.nativeGrammars.InjectString, this.nativeGrammars.ImportJs, this.nativeGrammars.ExportJs, this.nativeGrammars.MultilineCommentValueInjection, this.nativeGrammars.AtRequires, this.nativeGrammars.AtInjects, this.nativeGrammars.JavadocComment ],
            forCssOnRuntime: [ this.nativeGrammars.AtRequires ],
            forTemplateComments: [ this.nativeGrammars.MultilineCommentValueInjection, this.nativeGrammars.MultilineCommentCodeInjection ],
            forEmbeddedForms: [ this.nativeGrammars.EmbeddedFormFieldOpener, this.nativeGrammars.EmbeddedFormFieldCloser ]
        };
        static symbols={
            REGEX_FOR_SLASH_AT_THE_END: /(\\|\/)$/g,
            REGEX_FOR_PROTOCOL_BASED_PATH: /^([A-Za-z0-9\-\_\$]*)\:\/\//g,
            REGEX_FOR_ABSOLUTE_WINDOWS_PATH: /^(([A-Za-z]:(\\|\/))|((\\|\/){2}))/g
        };
        static getEnvironmentDirectory() {
            if (this.isBrowser) {
                return window.location.origin;
            } else {
                return process.cwd();
            }
        }
        _formatImportParameters(signature) {
            this.assert(Array.isArray(signature), "Parameter «signature» must be array on «ModulerV6.prototype._formatImportParameters»");
            this.assert(signature.length !== 0, "ModulerV6.prototype.import cannot have 0 arguments");
            if (signature.length === 1) {
                if (typeof signature[0] === "string") {
                    const isId = signature[0].startsWith("#");
                    return {
                        id: isId ? signature[0] : null,
                        file: !isId ? signature[0] : null,
                        dependencies: [],
                        factory: null
                    };
                } else if (typeof signature[0] === "object") {
                    return {
                        id: null,
                        file: null,
                        dependencies: signature[0],
                        factory: null
                    };
                } else if (typeof signature[0] === "function") {
                    return {
                        id: null,
                        file: null,
                        dependencies: [],
                        factory: signature[0]
                    };
                } else {
                    this.assert(false, `ModulerV6.prototype.import used with 1 argument does not support the signature: ${typeof signature[0]}`);
                }
            } else if (signature.length === 2) {
                if (typeof signature[0] === "object" && typeof signature[1] === "function") {
                    return {
                        id: null,
                        file: null,
                        dependencies: signature[0],
                        factory: signature[1]
                    };
                } else {
                    this.assert(false, `ModulerV6.prototype.import used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}`);
                }
            } else {
                this.assert(false, `ModulerV6.prototype.import cannot have ${signature.length} arguments`);
            }
        }
        _formatExportParameters(signature) {
            this.assert(Array.isArray(signature), "Parameter «signature» must be array on «ModulerV6.prototype._formatExportParameters»");
            this.assert(signature.length !== 0, "ModulerV6.prototype.export cannot have 0 arguments");
            this.assert(signature.length !== 1, "ModulerV6.prototype.export cannot have 1 argument only");
            this.assert(typeof signature[0] === "string", "ModulerV6.prototype.export first argument must be a string");
            this.assert(signature[0].startsWith("#"), "ModulerV6.prototype.export first argument must be a string starting with «#»");
            if (signature.length === 2) {
                if (typeof signature[0] === "string" && typeof signature[1] === "function") {
                    return {
                        id: signature[0],
                        file: null,
                        dependencies: [],
                        factory: signature[1]
                    };
                } else if (typeof signature[0] === "string" && typeof signature[1] === "string") {
                    return {
                        id: signature[0],
                        file: signature[1],
                        dependencies: [],
                        factory: null
                    };
                } else if (typeof signature[0] === "string" && typeof signature[1] === "object") {
                    return {
                        id: signature[0],
                        file: null,
                        dependencies: signature[1],
                        factory: null
                    };
                } else {
                    this.assert(false, `ModulerV6.prototype.export used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}`);
                }
            } else if (signature.length === 3) {
                if (typeof signature[0] === "string" && typeof signature[1] === "object" && typeof signature[2] === "function") {
                    return {
                        id: signature[0],
                        file: null,
                        dependencies: signature[1],
                        factory: signature[2]
                    };
                } else {
                    this.assert(false, `ModulerV6.prototype.export used with 2 arguments does not support the signature: ${typeof signature[0]}, ${typeof signature[1]}, ${typeof signature[2]}`);
                }
            } else {
                this.assert(false, `ModulerV6.prototype.export cannot have ${signature.length} arguments`);
            }
        }
        _joinPaths(subpaths, origin = false) {
            this.assert(Array.isArray(subpaths), `Parameter «subpaths» must be array on «ModulerV6.prototype._joinPaths»`);
            this.assert(subpaths.length !== 0, `Parameter «subpaths.length» cannot be 0 on «ModulerV6.prototype._joinPaths»`);
            let out = "";
            Join_paths_overwritting_when_required: for (let index = 0; index < subpaths.length; index++) {
                const subpath = subpaths[index];
                this.assert(typeof subpath === "string", `Parameter «subpaths[${index}]» must be string too on «ModulerV6.prototype._joinPaths»`);
                this.assert(typeof subpath !== "", `Parameter «subpaths[${index}]» cannot be empty string on «ModulerV6.prototype._joinPaths»`);
                if (subpath.includes("://")) {
                    this.assert(subpath.match(this.constructor.symbols.REGEX_FOR_PROTOCOL_BASED_PATH), `Paths can only have «://» at the begining, and preceded only by a protocol id, if any in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
                    out = subpath;
                } else if (subpath.includes(":\\") || subpath.includes(":/") || subpath.startsWith("\\\\") || subpath.startsWith("//")) {
                    this.assert(subpath.match(this.constructor.symbols.REGEX_FOR_ABSOLUTE_WINDOWS_PATH), `Paths can only have «:\\|:/|\\\\|//» at the begining, and preceded only by a standard Windows disk unit identifier, if any in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
                    out = subpath;
                } else if (subpath.startsWith("/")) {
                    out = subpath;
                } else if (subpath.startsWith("./")) {
                    this.assert(typeof this.basedir === "string", `Cannot use «./» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
                    out = this._appendPathSeparator(this.basedir) + subpath.substr(2);
                } else if (subpath.startsWith("../")) {
                    this.assert(typeof this.basedir === "string", `Cannot use «../» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
                    out = this._appendPathSeparator(this.basedir, "..") + subpath.substr(3);
                } else if (subpath.startsWith("@/")) {
                    this.assert(typeof this.rootdir === "string", `Cannot use «@/» expression because «this.rootdir» is «${typeof this.rootdir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
                    out = this._appendPathSeparator(this.rootdir) + subpath.substr(2);
                } else {
                    if (out.length) {
                        out = this._appendPathSeparator(out) + subpath;
                    } else {
                        out = subpath;
                    }
                }
            }
            Resolve_one_and_two_dots: {
                const parts = this.splitPath(out);
                const newParts = [];
                for (let index = 0; index < parts.length; index++) {
                    const part = parts[index];
                    if (part === "..") {
                        newParts.pop();
                    } else if (part === ".") {} else {
                        newParts.push(part);
                    }
                }
                out = newParts.join("/");
            }
            return out;
        }
        splitPath(path) {
            const out = [ "" ];
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
        _appendPathSeparator(subpath) {
            return subpath.replace(this.constructor.symbols.REGEX_FOR_SLASH_AT_THE_END, "") + "/";
        }
        _readFile(file) {
            return require("fs").promises.readFile(this.normalizationOf(file), "utf8");
        }
        _readUrl(url) {
            return fetch(this.normalizationOf(url), {
                method: "GET"
            }).then(response => response.text());
        }
        _readPath(url) {
            return this._isBrowser ? this._readUrl(url) : this._readFile(url);
        }
        _wrapInTry(source, parameters = {}, file = null) {
            let js = "";
            js += `try {\n`;
            js += `  ${source}\n`;
            js += `} catch(error) {\n`;
            js += `  console.error("Injection source failed somewhere:", ${JSON.stringify(source)});\n`;
            js += `  console.error("Injection parameters:", ${JSON.stringify(Object.keys(parameters).map(id => id + ":" + typeof parameters[id]))});\n`;
            if (file !== null) {
                js += `  console.error("Injected file:", ${JSON.stringify(file)});\n`;
            }
            js += `  console.error("Injection failed:", error);\n`;
            js += `}`;
            return js;
        }
        _createAsyncFunction(source, parameters = []) {
            return new async function() {}.constructor(...parameters, source);
        }
        _importFile(filepathBrute) {
            let originalHolder = {};
            const filepath = this.normalizationOf(filepathBrute);
            const moduleHolder = {
                get exports() {
                    return originalHolder;
                },
                set exports(output) {
                    originalHolder = output;
                }
            };
            return this.evaluateFile(filepath, {
                module: moduleHolder,
                exports: moduleHolder.exports,
                $moduler: this.cloneForFile(filepath)
            }).then(result => {
                let output = undefined;
                if (typeof result === "undefined") {
                    output = moduleHolder.exports;
                } else {
                    output = moduleHolder.exports = result;
                }
                return this.modules[filepath] = output;
            });
        }
        _importFactory(factory, dependencies = []) {
            let originalHolder = {};
            const moduleHolder = {
                get exports() {
                    return originalHolder;
                },
                set exports(output) {
                    originalHolder = output;
                }
            };
            const result = factory(dependencies, {
                module: moduleHolder,
                exports: moduleHolder.exports,
                $moduler: this
            });
            return typeof result === "undefined" ? originalHolder : result;
        }
        assert(condition, message) {
            return this.constructor.assert(condition, message);
        }
        createAssertFunction() {
            return (...args) => this.assert(...args);
        }
        setBasedir(basedir) {
            this.basedir = this.normalizationOf(basedir);
            if (this.compiler) {
                this.compiler.basedir = this.basedir;
            }
        }
        setRootdir(rootdir) {
            this.rootdir = this.normalizationOf(rootdir);
            if (this.compiler) {
                this.compiler.rootdir = this.rootdir;
            }
        }
        normalizationOf(subpath) {
            this.assert(typeof subpath === "string", `Parameter «subpath» must be string on «ModulerV6.prototype.normalizationOf»`);
            return this._joinPaths([ subpath ], "normalizationOf");
        }
        basedirOf(subpath) {
            const normalized = this._joinPaths([ subpath ], "basedirOf");
            const basedirSeparated = this._appendPathSeparator(this.basedir);
            if (normalized.startsWith(basedirSeparated)) {
                return normalized.replace(basedirSeparated, "./");
            }
            return normalized;
        }
        rootdirOf(subpath) {
            const normalized = this._joinPaths([ subpath ], "rootdirOf");
            const rootdirSeparated = this._appendPathSeparator(this.rootdir);
            if (normalized.startsWith(rootdirSeparated)) {
                return normalized.replace(rootdirSeparated, "@/");
            }
            return normalized;
        }
        cloneForFile(filepath) {
            const dirpath = this._joinPaths([ filepath, ".." ]);
            return new ModulerV6(dirpath, this);
        }
        evaluateFile(file, injections = {}) {
            return this._readPath(file).then(source => this.evaluateSource(source, injections, file));
        }
        evaluateSource(source, injections = {}, file = null) {
            this.assert(typeof source === "string", `Parameter «source» must be string but «${typeof source}» was passed instead on «ModulerV6.prototype.evaluateSource»`);
            this.assert(typeof injections === "object", `Parameter «injections» must be object but «${typeof injections}» was passed instead on «ModulerV6.prototype.evaluateSource»`);
            this.assert(!Array.isArray(injections), `Parameter «injections» must be object but not array on «ModulerV6.prototype.evaluateSource»`);
            this.assert(injections !== null, `Parameter «injections» must be object but not null on «ModulerV6.prototype.evaluateSource»`);
            const allKeys = Object.keys(injections);
            const allObjects = Object.values(injections);
            const finalSource = this._wrapInTry(source, injections, file);
            const asyncFunction = this._createAsyncFunction(finalSource, allKeys);
            return asyncFunction(...allObjects);
        }
        import(...signature) {
            let filepath, dependencies;
            const parameters = this._formatImportParameters(signature);
            const {id: _id = null, file: _file = null, dependencies: _dependencies = null, factory: _factory = null} = parameters;
            Resolve_by_id: {
                if (_id) {
                    this.assert(this.section.has(_id), `No section named «${_id}» on «ModulerV6.prototype.import»`);
                    return this.section.get(_id);
                }
            }
            Resolve_by_file: {
                if (_file) {
                    filepath = this.normalizationOf(_file);
                    if (filepath in this.modules) {
                        return this.modules[filepath];
                    }
                    return this._importFile(filepath);
                }
            }
            Resolve_by_dependencies: {
                if (_dependencies && _dependencies.length) {
                    dependencies = Promise.all(_dependencies.map(dependency => this._importFile(dependency)));
                    if (!_factory) {
                        return dependencies;
                    }
                }
            }
            Resolve_by_factory: {
                if (_factory && dependencies) {
                    return dependencies.then(resolvedDependencies => this._importFactory(_factory, resolvedDependencies));
                } else if (_factory && !dependencies) {
                    return this._importFactory(_factory, []);
                } else if (dependencies) {
                    return dependencies;
                } else {
                    throw new Error("This error should never happen by design (8210)");
                }
            }
            throw new Error("This error should never happen by design (4993)");
        }
        export(...signature) {
            let filepath, dependencies, output;
            const parameters = this._formatExportParameters(signature);
            const {id: _id = null, file: _file = null, dependencies: _dependencies = null, factory: _factory = null} = parameters;
            this.assert(!this.section.has(_id), `Cannot export section by id «${_id}» because it already exists on «ModulerV6.prototype.export»`);
            Resolving_module: {
                const signatureCopy = [ ...signature ];
                signatureCopy.splice(0, 1);
                output = this.import(...signatureCopy);
            }
            if (output === null) {
                this.section.set(_id, output);
            } else if ([ "object" ].includes(typeof output)) {
                this.section.expand(_id, output);
            } else {
                this.section.set(_id, output);
            }
            return output;
        }
        static globalInstance=new this;
        static globalSectionsManagerInstance=new this.SectionsManager;
        section=this.constructor.globalSectionsManagerInstance;
        constructor(basedirArg = null, cloneOf = null) {
            const basedir = basedirArg === null ? this.constructor.getEnvironmentDirectory() : basedirArg;
            this.assert(typeof basedir === "string", `Parameter «basedir» must be string and not «${typeof basedir}» on «ModulerV6.constructor»`);
            this.assert(typeof cloneOf === "object", `Parameter «cloneOf» must be object or null not «${typeof cloneOf}» on «ModulerV6.constructor»`);
            this.assert(typeof basedir === "string", `Parameter «basedir» must be string on «Moduler.constructor»`);
            this.basedir = basedir;
            this.rootdir = cloneOf ? cloneOf.rootdir : basedir;
            this.modules = cloneOf ? cloneOf.modules : {};
            this.compiler = null;
            this.grammars = {
                forJs: this.constructor.defaultGrammars.forJs,
                forCss: this.constructor.defaultGrammars.forCss,
                forMd: this.constructor.defaultGrammars.forMd,
                forTemplateComments: this.constructor.defaultGrammars.forTemplateComments,
                forEmbeddedForms: this.constructor.defaultGrammars.forEmbeddedForms
            };
            this.parser = {
                forJs: this.constructor.Parser.create(this.grammars.forJs),
                forCss: this.constructor.Parser.create(this.grammars.forCss),
                forMd: this.constructor.Parser.create(this.grammars.forMd),
                forTemplateComments: this.constructor.Parser.create(this.grammars.forTemplateComments),
                forEmbeddedForms: this.constructor.Parser.create(this.grammars.forEmbeddedForms)
            };
            this.css = new ModulerV6.CssManager(this);
        }
    };
}.call());