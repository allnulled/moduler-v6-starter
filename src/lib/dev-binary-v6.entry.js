(function(mod) {
    if (typeof $devbin === "undefined") {
        if (typeof window !== "undefined") window["$devbin"] = mod.globalInstance;
        if (typeof global !== "undefined") global["$devbin"] = mod.globalInstance;
    }
    if (typeof DevBinaryV6 === "undefined") {
        if (typeof window !== "undefined") window["DevBinaryV6"] = mod;
        if (typeof global !== "undefined") global["DevBinaryV6"] = mod;
    }
    return DevBinaryV6;
})(function() {
    (function(mod) {
        if (typeof CompilerV6 !== "undefined") return CompilerV6;
        if (typeof window !== "undefined") window["CompilerV6"] = mod;
        if (typeof global !== "undefined") global["CompilerV6"] = mod;
    })(function() {
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
                    this.assert(this.section instanceof ModulerV6.SectionsManager, `For some random reason, the section manager global instance is not available on «ModulerV6.prototype.export»`);
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
                static globalSectionsManagerInstance=new this.SectionsManager({});
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
                static globalInstance=new this;
            };
        }.call());
        const CompilerV6 = class CompilerV6 {
            static Parser=ModulerV6.Parser;
            static Tracer=class Tracer {
                constructor(compiler) {
                    this.compiler = compiler;
                    this.isBrowser = compiler.isBrowser;
                    this.isTracing = false;
                    this.isLogging = true;
                    this.stack = [];
                    this.highlightedPatterns = [ [ "assert", "blackBright" ], [ "_compileRecursively", "cyan,underline" ], [ "_tokenizeText", "cyan,underline" ], [ "_compileTokens", "cyan,underline" ], [ ".constructor", "blue" ], [ "_replaceTextRange", "yellow,bold" ] ];
                    this.ignoredPatterns = [ "assert" ];
                }
                activate(really = true) {
                    this.isTracing = !!really;
                    return this;
                }
                deactivate(really = true) {
                    this.isTracing = !!!really;
                    return this;
                }
                addHighlighter(text) {
                    if (highlightedPatterns.indexOf(text) === -1) {
                        highlightedPatterns.push(text);
                    }
                }
                removeHighlighter(text) {
                    const pos = highlightedPatterns.indexOf(text);
                    if (pos !== -1) {
                        highlightedPatterns.splice(pos, 1);
                    }
                }
                indentByLevel(input) {
                    return " ".repeat(this.stack.length) + input;
                }
                matchesIgnorer(text) {
                    for (let index = 0; index < this.ignoredPatterns.length; index++) {
                        const pattern = this.ignoredPatterns[index];
                        if (text.includes(pattern)) {
                            return true;
                        }
                    }
                    return false;
                }
                highlightIfMatched(output) {
                    let styling = false;
                    Iterating_patterns: for (let index = 0; index < this.highlightedPatterns.length; index++) {
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
                    return this.compiler.constructor.ansi.colors.style(styling).text(output);
                }
                trace(message, args, spaceDiff = 0) {
                    if (this.isTracing) {
                        let output = ``;
                        output += `[${this.stack.length}${spaceDiff === 1 ? "++" : spaceDiff === -1 ? "--" : ""}] `;
                        output += this.compiler.name ? `[${this.compiler.name}] ` : `[mv6] `;
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
                traceIn(msg, args) {
                    this.trace(msg, args, 1);
                    this.stack.push(msg);
                }
                traceOut(msg, args) {
                    const lastInStack = this.stack[this.stack.length - 1];
                    this.stack.pop();
                    this.trace(msg, args, -1);
                }
                printStack() {
                    console.log(`Tracer «${this.compiler.name || "mv6"}» with:`, this.stack);
                }
            };
            static AssertionError=class AssertionError extends Error {
                constructor(message) {
                    super(message);
                    this.name = "AssertionError";
                }
            };
            static Logger=class Logger {
                static fromFile(file) {
                    return new this({
                        file: file
                    });
                }
                static Manager=class LoggerManager {
                    static fromDirectory(basedir) {
                        return new this(basedir);
                    }
                    constructor(basedir) {
                        this.basedir = basedir;
                        this.selected = "default";
                        this.subloggers = {
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
                        if (!this.has(id)) {
                            this.addLogger(id);
                        }
                        return this.subloggers[id];
                    }
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
                    resetFile(...args) {
                        if (!this.has(this.selected)) {
                            this.addLogger(this.selected);
                        }
                        return this.subloggers[this.selected].resetFile(...args);
                    }
                    log(...args) {
                        if (!this.has(this.selected)) {
                            this.addLogger(this.selected);
                        }
                        return this.subloggers[this.selected].log(...args);
                    }
                };
                static create(...args) {
                    return new this(...args);
                }
                static defaultOptions={
                    console: true
                };
                constructor(options, compiler) {
                    this.options = Object.assign({}, this.constructor.defaultOptions, options);
                    this.compiler = compiler;
                    this.startedAt = new Date;
                    this.lastLogAt = new Date;
                }
                resetFile(...args) {
                    return require("fs").promises.writeFile(this.options.file, "", "utf8").then(() => {
                        this.startedAt = new Date;
                        this.lastLogAt = new Date;
                        return this.log(...args);
                    });
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
                    if (this.options.console) {
                        console.log(`~[LOG] ${line}`);
                    }
                    this.lastLogAt = new Date;
                    if (this.options.file) {
                        return require("fs").promises.appendFile(this.options.file, line + "\n", "utf8").catch(console.error);
                    }
                }
                setOption(id, value) {
                    this.options[id] = value;
                    return this;
                }
                getMomentToString() {
                    const d = new Date;
                    const pad = n => String(n).padStart(2, "0");
                    const pad3 = n => String(n).padStart(3, "0");
                    return `${d.getFullYear()}-` + `${pad(d.getMonth() + 1)}-` + `${pad(d.getDate())} ` + `${pad(d.getHours())}:` + `${pad(d.getMinutes())}:` + `${pad(d.getSeconds())}.` + `${pad3(d.getMilliseconds())}`;
                }
                stringifySafe(value) {
                    const seen = new WeakSet;
                    return JSON.stringify(value, (key, val) => {
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
                                stack: val.stack
                            };
                        }
                        if (typeof val === "object" && val !== null) {
                            if (seen.has(val)) {
                                return "[Circular]";
                            }
                            seen.add(val);
                        }
                        return val;
                    }, 0);
                }
            };
            static Moduler=ModulerV6;
            static CompilationProcess=class CompilationProcess {
                static assert(condition, message) {
                    if (!condition) throw new Error(message);
                }
                static get _defaultProcessData() {
                    return {
                        processedEntries: {},
                        dontCreateOnInjectSource: true,
                        disableTemplates: false
                    };
                }
                constructor(compilationFile, compilationProcess, compiler) {
                    this.constructor.assert(typeof compiler === "object", "Parameter «compiler» must be object on «CompilerV6.CompilationProcess.constructor»");
                    this.constructor.assert(compiler instanceof CompilerV6, "Parameter «compiler» must be instance of «CompilerV6» on «CompilerV6.CompilationProcess.constructor»");
                    this.compiler = compiler;
                    this.compiler._traceIn("CompilationProcess.constructor", arguments);
                    if (compilationProcess instanceof this.constructor) {
                        this.compiler._traceOut("CompilationProcess.constructor", arguments);
                        Object.assign(this, this.constructor._defaultProcessData, compilationProcess);
                        return this;
                    } else {
                        this.compiler.assert(typeof compilationFile === "object", "Parameter «compilationFile» must be object on «CompilerV6.CompilationProcess.constructor»");
                        this.compiler.assert(typeof compilationProcess === "object", "Parameter «compilationProcess» must be object on «CompilerV6.CompilationProcess.constructor»");
                        Object.assign(this, this.constructor._defaultProcessData, compilationProcess);
                        if (typeof this.resource === "undefined") {
                            this.compiler.assert(typeof compilationFile.resource === "string", "Parameter «compilationProcess.resource» or «compilationFile.resource» must be string on «CompilerV6.CompilationProcess.constructor»");
                            this.resource = compilationFile.resource;
                        }
                        if (typeof this.isRoot === "undefined") {
                            this.isRoot = compilationFile.isRoot;
                        }
                        this.compiler.assert(typeof this.resource === "string", "Parameter «compilationProcess.resource» must be string on «CompilerV6.CompilationProcess.constructor»");
                        this.compiler.assert(typeof this.isRoot === "boolean", "Parameter «compilationProcess.isRoot» must be boolean on «CompilerV6.CompilationProcess.constructor»");
                        this.compiler._traceOut("CompilationProcess.constructor", arguments);
                        return this;
                    }
                }
                static from(...args) {
                    return new this(...args);
                }
            };
            static CompilationFile=class CompilationFile {
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
                        }
                    };
                }
                constructor(compilationFile, compilationProcess, compiler) {
                    this.constructor.assert(typeof compiler === "object", "Parameter «compiler» must be object on «CompilerV6.CompilationFile.constructor»");
                    this.constructor.assert(compiler instanceof CompilerV6, "Parameter «compiler» must be instance of «CompilerV6» on «CompilerV6.CompilationFile.constructor»");
                    this.compiler = compiler;
                    if (compilationProcess instanceof this.constructor) {
                        this.compiler._traceOut("CompilationProcess.constructor", arguments);
                        Object.assign(this, this.constructor._defaultFileData, compilationFile);
                        return this;
                    }
                    this.compiler._traceIn("CompilationFile.constructor", arguments);
                    this.compiler.assert(typeof compilationFile === "object", "Parameter «compilationFile» must be object on «CompilerV6.CompilationFile.constructor»");
                    this.compiler.assert(typeof compilationProcess === "object", "Parameter «compilationProcess» must be object on «CompilerV6.CompilationFile.constructor»");
                    Object.assign(this, this.constructor._defaultFileData, compilationFile);
                    this.compiler.assert(typeof this.resource === "string", "Parameter «compilationFile.resource» must be string on «CompilerV6.CompilationFile.constructor»");
                    this.compiler.assert(typeof this.isRoot === "boolean", "Parameter «compilationFile.isRoot» must be boolean on «CompilerV6.CompilationFile.constructor»");
                    this.compiler._traceOut("CompilationFile.constructor", arguments);
                }
                static from(...args) {
                    return new this(...args);
                }
            };
            static CompilationResult=class {
                constructor(output = {}, compiler = null) {
                    Object.assign(this, output);
                    this.compiler = compiler;
                }
                toFile(file, options = {}) {
                    this.compiler.assert(require("path").basename(file).includes(".dist."), `Method «toFile» only accepts files containing «.dist.» pattern and file «${file}» does not incur the case`);
                    const fileExtension = require("path").extname(file);
                    const fileNormalization = this.compiler.normalizationOf(file);
                    const fileJs = this.compiler.constructor._changeFileExtension(fileNormalization, ".js");
                    const fileCss = this.compiler.constructor._changeFileExtension(fileNormalization, ".css");
                    const fileMd = this.compiler.constructor._changeFileExtension(fileNormalization, ".md");
                    const promises = [];
                    if (this.js) {
                        const outputJs = options.mode === "beautified" && this.beautifiedJs ? this.beautifiedJs.code : options.mode === "minified" && this.minifiedJs ? this.minifiedJs.code : this.js;
                        promises.push(require("fs").promises.writeFile(fileJs, outputJs, "utf8"));
                    } else if (this.css) {
                        promises.push(require("fs").promises.writeFile(fileCss, this.css, "utf8"));
                    } else if (this.md) {
                        promises.push(require("fs").promises.writeFile(fileMd, this.md, "utf8"));
                    }
                    return Promise.all(promises);
                }
                toJsonable() {
                    return Object.assign({}, this, {
                        compiler: undefined,
                        moduler: undefined
                    });
                }
            };
            static _nativeGrammars=ModulerV6.nativeGrammars;
            static _defaultGrammars=ModulerV6.defaultGrammars;
            static _changeFileExtension(file, nuevaExt) {
                const path = require("path");
                if (!nuevaExt.startsWith(".")) {
                    nuevaExt = "." + nuevaExt;
                }
                const dir = path.dirname(file);
                const nombre = path.basename(file, path.extname(file));
                return path.join(dir, nombre + nuevaExt);
            }
            static beautifyJs(code) {
                return require("prettier").format(code, {
                    parser: "babel"
                });
            }
            static softMinifyJs(code) {
                return require("terser").minify(code, {
                    compress: {
                        sequences: true
                    },
                    mangle: false,
                    toplevel: true,
                    format: {
                        comments: false,
                        beautify: true,
                        indent_level: 2,
                        max_line_len: true
                    }
                });
            }
            static hardMinifyJs(code) {
                return require("terser").minify(code, {
                    compress: {
                        defaults: true,
                        passes: 5,
                        unsafe: true,
                        toplevel: true
                    },
                    mangle: {
                        toplevel: true
                    }
                });
            }
            static getStringSize(text) {
                let bytes = undefined;
                if (this.isBrowser) {
                    bytes = (new TextEncoder).encode(text).length;
                } else {
                    bytes = Buffer.byteLength(text, "utf8");
                }
                if (bytes < 1024 * 1024) {
                    return `${(bytes / 1024).toFixed(2)}KB`;
                } else {
                    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
                }
            }
            static create(...args) {
                return new this(...args);
            }
            static fromDirectory(dir) {
                return new this(dir);
            }
            static async fromRootOf(file) {
                const root = await this.findRootOf(file);
                return new this(root);
            }
            static async findRootOf(file, whenContains = "package.json") {
                const fs = require("fs");
                const path = require("path");
                let dir0 = null;
                let dir1 = file;
                while (dir0 !== dir1) {
                    try {
                        const filepath = path.resolve(dir1, whenContains);
                        await fs.promises.readFile(filepath);
                        return filepath;
                    } catch (error) {
                        dir0 = dir1;
                        dir1 = fs.promises.readdir(dir1);
                    }
                }
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
                            text: text => {
                                const begin = styles.reduce((out, it) => {
                                    if (!(it in this.available)) {
                                        return out;
                                    }
                                    const code = this.available[it];
                                    out += `[${code[0]}m`;
                                    return out;
                                }, "");
                                const end = this.endToken;
                                return `${begin}${text}${end}`;
                            },
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
                            hard: true
                        });
                    },
                    box: function(text, maxWidth = 110) {
                        const lines = this.wrapAnsi(text, maxWidth).split("\n");
                        const cleanLines = lines.map(l => this.stripAnsi(l));
                        const width = Math.max(...cleanLines.map(l => l.length));
                        const top = "┌" + "─".repeat(width + 2) + "┐";
                        const bottom = "└" + "─".repeat(width + 2) + "┘";
                        const body = lines.map(line => {
                            const clean = this.stripAnsi(line);
                            const pad = width - clean.length;
                            return "│ " + line + " ".repeat(pad) + " │";
                        }).join("\n");
                        return `${top}\n${body}\n${bottom}`;
                    }
                }, {
                    table: function table(listOfColumns, options = {}) {
                        const Table = require("cli-table3");
                        const table = new Table(options);
                        table.push(...listOfColumns);
                        return table.toString();
                    },
                    borderlessTable: function borderlessTable(listOfColumns, optionsObject = {}) {
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
                    }
                })
            };
            constructor(basedirInput, parent = null, grammars = this.constructor._defaultGrammars) {
                if (!(typeof basedirInput === "string")) {
                    throw new this.constructor.AssertionError(`Parameter «basedir» must be string not «${typeof basedirInput}» on «CompilerV6.constructor»`);
                }
                if (!(typeof parent === "object")) {
                    throw new this.constructor.AssertionError(`Parameter «parent» must be object not «${typeof parent}» on «CompilerV6.constructor»`);
                }
                if (!(typeof grammars === "object")) {
                    throw new this.constructor.AssertionError(`Parameter «grammars» must be object not «${typeof grammars}» on «CompilerV6.constructor»`);
                }
                if (parent) {
                    this._tracer = parent._tracer;
                }
                this._trace("constructor", arguments);
                const basedir = parent ? parent.fullpathOf(basedirInput) : this.fullpathOf(basedirInput);
                this.isBrowser = typeof window !== "undefined";
                this.basedir = basedir;
                this.previousdir = parent ? parent.basedir : basedir;
                this.rootdir = parent ? parent.rootdir : basedir;
                this.moduler = new ModulerV6(basedir);
                this.moduler.compiler = this;
                this._grammars = this.moduler.grammars;
                this._parser = this.moduler.parser;
            }
            _readPath(url) {
                this._trace("_readPath", arguments);
                return this._isBrowser ? this._readUrl(url) : this._readFile(url);
            }
            _readUrl(url) {
                this._trace("_readUrl", arguments);
                return fetch(this.normalizationOf(url), {
                    method: "GET"
                }).then(response => response.text());
            }
            _readFile(file) {
                this._trace("_readFile", arguments);
                return require("fs").promises.readFile(this.normalizationOf(file), "utf8");
            }
            assert(condition, message) {
                this._trace("assert", arguments);
                if (!condition) {
                    throw new this.constructor.AssertionError(message);
                } else if (this._tracer.isTracing) {
                    this._notifyAssertion(message);
                }
            }
            async assertThrows(callback, message, checker = () => true) {
                const localError = new Error("Should have thrown: " + message);
                try {
                    await callback();
                    throw localError;
                } catch (err) {
                    if (err === localError) {
                        throw new this.constructor.AssertionError(`Should have thrown: ${err.name}: ${err.message} | ${err.stack}`);
                    }
                    if (!checker(err)) {
                        throw new this.constructor.AssertionError(`Should have thrown but not specific error: ${err.name}: ${err.message} | ${err.stack}`);
                    }
                    this._notifyAssertion(message);
                }
            }
            async assertDoesNotThrow(callback, message, checker = () => true) {
                try {
                    await callback();
                    this._notifyAssertion(message);
                } catch (err) {
                    if (!checker(err)) {
                        throw new this.constructor.AssertionError(`Should not have thrown specific error: ${err.name}: ${err.message}`);
                    }
                    throw new this.constructor.AssertionError(`Should not have thrown: ${err.name}: ${err.message}`);
                }
            }
            createAssertFunction() {
                return (...args) => this.assert(...args);
            }
            _notifyAssertion(message) {
                const text = `[ok] ${message}`;
                if (this._tracer.isTracing && !this._tracer.matchesIgnorer(text)) {
                    console.log(this._tracer.indentByLevel(this.constructor.ansi.colors.style("blackBright").text(text)));
                }
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
                this._trace("die", arguments);
                console.log("[DIE]", ...args);
                process.exit(0);
            }
            _tokenizeText(compilationFile, compilationProcess) {
                this._traceIn("_tokenizeText", arguments);
                this.assert(typeof compilationProcess === "object", "Parameter «compilationProcess» must be object on «CompilerV6.prototype._tokenizeText»");
                this.assert(typeof compilationProcess.resource === "string", "Parameter «compilationProcess.resource» must be string on «CompilerV6.prototype._tokenizeText»");
                this.assert(typeof compilationFile === "object", "Parameter «compilationFile» must be object on «CompilerV6.prototype._tokenizeText»");
                this.assert(typeof compilationFile.source === "string", "Parameter «compilationFile.source» must be string on «CompilerV6.prototype._tokenizeText»");
                this.assert(typeof compilationFile.extension === "string", "Parameter «compilationFile.extension» must be string on «CompilerV6.prototype._tokenizeText»");
                let out = undefined;
                if (compilationFile.extension === "js") {
                    out = this._parser.forJs.parse(compilationFile.source);
                } else if (compilationFile.extension === "css") {
                    out = this._parser.forCss.parse(compilationFile.source);
                } else if (compilationFile.extension === "md") {
                    out = this._parser.forMd.parse(compilationFile.source);
                } else {
                    throw new Error(`File extension cannot be tokenized: «${compilationFile.resource}»`);
                }
                delete out.text;
                compilationFile.tokenization = out;
                this._traceOut("_tokenizeText", arguments);
                return out;
            }
            _replaceTextRange(text, start, end, replacement) {
                this._trace("_replaceTextRange", arguments);
                if (text.length < start) {
                    this._tracer.printStack();
                    throw new Error("Text replacement out of text boundaries (1)");
                }
                if (text.length < end) {
                    this._tracer.printStack();
                    throw new Error("Text replacement out of text boundaries (2)");
                }
                const output = text.slice(0, start) + replacement + text.slice(end + 1);
                return output;
            }
            async _compileTokens(compilationFile, compilationProcess) {
                this._traceIn("_compileTokens", arguments);
                const {resource: resource, source: source, tokenization: {formatted: tokens}} = compilationFile;
                const _tokenCompilationSwitcher = {
                    "Inject Source": this._compileAsInjectSource,
                    "Inject String": this._compileAsInjectString,
                    "Inject Template": this._compileAsInjectTemplate,
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
                    "Moduler Section Expand": this._compileAsModulerSectionExpand
                };
                Iterating_tokens: for (let tokenIndex = tokens.length - 1; tokenIndex >= 0; tokenIndex--) {
                    const token = tokens[tokenIndex];
                    Extraer_las_rutas_dependencia: {
                        this.assert(token.syntax in _tokenCompilationSwitcher, `Syntax not identified «${token.syntax}»`);
                        const methodCallback = _tokenCompilationSwitcher[token.syntax];
                        await methodCallback.call(this, compilationFile, compilationProcess, {
                            token: token,
                            tokenIndex: tokenIndex
                        });
                    }
                }
                this._traceOut("_compileTokens", arguments);
                return compilationFile.compilation;
            }
            async _compileRecursively(fileParameters = {}, processParameters = {}) {
                this._traceIn("_compileRecursively", arguments);
                this.assert(typeof fileParameters === "object", "Parameter «fileParameters» must be object on «CompilerV6.prototype._compileRecursively»");
                this.assert(typeof fileParameters.resource === "string", "Parameter «fileParameters.resource» must be string on «CompilerV6.prototype._compileRecursively»");
                this.assert(typeof processParameters === "object", "Parameter «processParameters» must be object on «CompilerV6.prototype._compileRecursively»");
                let compilationFile, compilationProcess, subcompiler, output;
                Initialize_parameters: {
                    compilationFile = this.constructor.CompilationFile.from(fileParameters, processParameters, this);
                    compilationProcess = this.constructor.CompilationProcess.from(fileParameters, processParameters, this);
                }
                this.assert(processParameters.uncacheInjections === compilationProcess.uncacheInjections, "Las inyecciones 1");
                Add_entry_in_tree: {
                    const id = this.rootdirOf(compilationFile.resource);
                    compilationFile.report.tree[id] = compilationFile.report.tree[id] || {};
                }
                Compile_inner_files_recursively_with_subcompiler: {
                    subcompiler = this._cloneForFile(compilationFile.resource, this);
                    compilationFile.subcompiler = subcompiler;
                    await subcompiler._fetchCompilable(compilationFile, compilationProcess);
                    await subcompiler._renderSourceAsTemplate(compilationFile, compilationProcess);
                    subcompiler._tokenizeText(compilationFile, compilationProcess);
                    await subcompiler._compileTokens(compilationFile, compilationProcess);
                    output = subcompiler._getPreferredOutput(compilationFile, compilationProcess);
                }
                Beautify_and_minify: {
                    if (fileParameters.isRoot && (processParameters.beautify || processParameters.minify) && !this.isBrowser && typeof output.js === "string") {
                        const originalSize = this.constructor.getStringSize(output.js);
                        if (processParameters.beautify) {
                            const startedAt = new Date;
                            const beautifiedCode = await this.constructor.beautifyJs(output.js);
                            output.beautifiedJs = {
                                code: beautifiedCode,
                                chars: beautifiedCode.length,
                                originalSize: originalSize,
                                size: this.constructor.getStringSize(beautifiedCode),
                                sizeRelationOf: (beautifiedCode.length / output.js.length * 100).toFixed(2) + "%",
                                time: ((new Date - startedAt) / 1e3).toFixed(3) + "s"
                            };
                        }
                        if (processParameters.minify) {
                            const startedAt = new Date;
                            const minifiedCode = (await this.constructor.hardMinifyJs(output.js)).code;
                            output.minifiedJs = {
                                code: minifiedCode,
                                chars: minifiedCode.length,
                                originalSize: originalSize,
                                size: this.constructor.getStringSize(minifiedCode),
                                sizeRelationOf: (minifiedCode.length / output.js.length * 100).toFixed(2) + "%",
                                time: ((new Date - startedAt) / 1e3).toFixed(3) + "s"
                            };
                        }
                    }
                }
                Bundle_as_CompilationResult_if_file_is_root: if (fileParameters.isRoot) {
                    output = new this.constructor.CompilationResult(output, this);
                }
                this._traceOut("_compileRecursively", arguments);
                return output;
            }
            _fetchCompilable(compilationFile, compilationProcess) {
                this.assert(typeof compilationFile === "object", "Parameter «compilationFile» must be object on «CompilerV6.prototype._fetchCompilable»");
                this.assert(typeof compilationFile.resource === "string", "Parameter «compilationFile.resource» must be string on «CompilerV6.prototype._fetchCompilable»");
                this.assert(/\.(js|css|md)$/g.test(compilationFile.resource), `Parameter «compilationFile.resource» now «${compilationFile.resource}» must match with valid extension on «CompilerV6.prototype._fetchCompilable»`);
                Sacar_la_extension_del_fichero: {
                    compilationFile.extension = compilationFile.resource.match(/\.(js|css|md)$/g)[0].substr(1);
                }
                Propagar_la_extension_al_proceso_si_es_la_primera: {
                    if (typeof compilationProcess.extension === "undefined") {
                        compilationProcess.extension = compilationFile.extension;
                    }
                }
                Bloquear_imports_segun_extension_de_compilable_original: {
                    if (compilationProcess.extension === "js") {} else if (compilationProcess.extension === "css") {
                        this.assert(compilationFile.extension !== "js", `From a «css» file «${compilationProcess.resource}» cannot inject «js» file «${compilationFile.resource}»`);
                    } else if (compilationProcess.extension === "md") {
                        this.assert(compilationFile.extension !== "js", `From an «md» file «${compilationProcess.resource}» cannot inject «js» file «${compilationFile.resource}»`);
                        this.assert(compilationFile.extension !== "css", `From an «md» file «${compilationProcess.resource}» cannot inject «css» file «${compilationFile.resource}»`);
                    }
                }
                return this._readPath(compilationFile.resource).then(source => {
                    compilationFile.source = source;
                    return compilationFile.compilation[compilationFile.extension] = source;
                });
            }
            _compileAsModulerSectionGet(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsModulerSectionGet", arguments);
                    return false;
                }
            }
            _compileAsModulerSectionSet(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsModulerSectionSet", arguments);
                    return false;
                }
            }
            _compileAsModulerSectionDelete(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsModulerSectionDelete", arguments);
                    return false;
                }
            }
            _compileAsModulerSectionExpand(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsModulerSectionExpand", arguments);
                    return false;
                }
            }
            _compileAsModulerSectionOverwrite(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsModulerSectionOverwrite", arguments);
                    return false;
                }
            }
            _compileAsModulerSectionFill(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsModulerSectionFill", arguments);
                    return false;
                }
            }
            async _compileAsInjectSource(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                this._traceIn("_compileAsInjectSource", arguments);
                let parameters, targetPath, targetCompilation, targetInjection;
                const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
                Evaluate_parameters: {
                    parameters = await this._getDataForTokenCompilation({
                        compilationFile: compilationFile,
                        compilationProcess: compilationProcess,
                        token: token,
                        tokenIndex: tokenIndex
                    });
                }
                Extend_token: {
                    this._extendToken(token, [ "referenceOf" ]);
                }
                Extract_target_path: {
                    this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectSource»");
                    targetPath = token.referenceOf.fullpath;
                }
                Compile_target: {
                    Use_processedEntries_cache_if_possible: {
                        if (compilationProcess.to === "data") {
                            break Use_processedEntries_cache_if_possible;
                        }
                        if (compilationProcess.uncacheInjections) {
                            break Use_processedEntries_cache_if_possible;
                        }
                        if (Object.keys(compilationProcess.processedEntries).length) {
                            if (targetPath in compilationProcess.processedEntries) {
                                targetInjection = await require("fs").promises.readFile(compilationProcess.processedEntries[targetPath].distJs, "utf8");
                                break Compile_target;
                            }
                        }
                    }
                    Create_file_unless_it_exists_or_option_dontCreateOnInjectSource_is_true: {
                        if (!compilationProcess.dontCreateOnInjectSource) {
                            const existsFile = await this._existsFile(targetPath);
                            if (!existsFile) {
                                const path = require("path");
                                const targetId = this.rootdirOf(targetPath).replace(/\.js$/g, "");
                                await this._createDefaultInjectedFile(targetPath, targetId);
                            }
                        }
                    }
                    targetCompilation = await this._compileRecursively({
                        resource: targetPath,
                        isRoot: false
                    }, compilationProcess);
                }
                Inject_in_compilation_text: {
                    this.assert(compilationFile.extension === "js", `Syntax of «$compiler.inject.source» should only be available on «js» files and not on «${compilationFile.extension}»`);
                    this.assert(targetPath.endsWith(".js"), `Syntax of «$compiler.inject.source» on file «${targetPath}» is trying to import foraneous extension format from file «${targetPath}» on «CompilerV6.prototype._compileAsInjectSource»`);
                    if (!targetInjection) {
                        targetInjection = targetCompilation.js;
                    }
                    compilationFile.compilation.js = this._replaceTextRange(compilationFile.compilation.js, token.location[0], token.location[1], targetInjection);
                }
                Inject_in_report_object: {
                    if (compilationProcess.to !== "data") {
                        break Inject_in_report_object;
                    }
                    this._reportFileToken(compilationFile, targetPath, token);
                    Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
                }
                this._traceOut("_compileAsInjectSource", arguments);
            }
            async _compileAsInjectString(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                this._traceIn("_compileAsInjectString", arguments);
                let parameters, targetPath, fileContent;
                const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
                Evaluate_parameters: {
                    parameters = await this._getDataForTokenCompilation({
                        compilationFile: compilationFile,
                        compilationProcess: compilationProcess,
                        token: token,
                        tokenIndex: tokenIndex
                    });
                }
                Extend_token: {
                    this._extendToken(token, [ "referenceOf" ]);
                }
                Extract_target_path: {
                    this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectString»");
                    targetPath = token.referenceOf.fullpath;
                }
                Compile_target: {
                    fileContent = await this._readPath(targetPath);
                }
                Inject_in_compilation_text: {
                    if (compilationFile.extension !== "js") {
                        break Inject_in_compilation_text;
                    }
                    compilationFile.compilation.js = this._replaceTextRange(compilationFile.compilation.js, token.location[0], token.location[1], this._getStringForDevelopment(fileContent));
                }
                Inject_in_report_object: {
                    if (compilationProcess.to !== "data") {
                        break Inject_in_report_object;
                    }
                    this._reportFileToken(compilationFile, targetPath, token);
                    Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
                }
                this._traceOut("_compileAsInjectString", arguments);
            }
            async _compileAsInjectTemplate(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                this._traceIn("_compileAsInjectTemplate", arguments);
                let parameters, targetPath, fileContent;
                const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
                Evaluate_parameters: {
                    parameters = await this._getDataForTokenCompilation({
                        compilationFile: compilationFile,
                        compilationProcess: compilationProcess,
                        token: token,
                        tokenIndex: tokenIndex
                    });
                }
                Extend_token: {
                    this._extendToken(token, [ "referenceOf" ]);
                }
                Extract_target_path: {
                    this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjectTemplate»");
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
                        ...parameters[1] || {}
                    });
                    compilationFile.compilation.js = this._replaceTextRange(compilationFile.compilation.js, token.location[0], token.location[1], templateOutput);
                }
                Inject_in_report_object: {
                    if (compilationProcess.to !== "data") {
                        break Inject_in_report_object;
                    }
                    this._reportFileToken(compilationFile, targetPath, token);
                    Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
                }
                this._traceOut("_compileAsInjectTemplate", arguments);
            }
            _compileAsMultilineCommentCodeInjection() {
                this._trace("_compileAsMultilineCommentCodeInjection", arguments);
            }
            _compileAsMultilineCommentValueInjection() {
                this._trace("_compileAsMultilineCommentValueInjection", arguments);
            }
            async _compileAsModulerImport(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsModulerImport", arguments);
                    return false;
                }
                this._traceIn("_compileAsModulerImport", arguments);
                let parameters, namedParameters = {}, targetPaths = [];
                const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot, subcompiler: subcompiler} = compilationFile;
                Evaluate_parameters: {
                    parameters = await this._getDataForTokenCompilation({
                        compilationFile: compilationFile,
                        compilationProcess: compilationProcess,
                        token: token,
                        tokenIndex: tokenIndex
                    }, {
                        onError(error) {
                            return error;
                        }
                    });
                }
                if (parameters instanceof Error) {
                    Handle_errors_evaluating_parameters: {
                        console.error(`The load of inner parameters of token type «$moduler.import» on file «${compilationFile.resource}» could not be retrieved maybe because of runtime code that cannot be solved on compilation-time on «ModulerV6.prototype._compileAsModulerImport»`);
                        console.error(parameters);
                    }
                } else {
                    Extract_targets_path: {
                        namedParameters = this.moduler._formatImportParameters(parameters, compilationFile.resource);
                        targetPaths = (namedParameters.file ? [ namedParameters.file ] : []).concat(namedParameters.dependencies);
                    }
                    Extend_token: {
                        token.dependenciesOf = targetPaths;
                    }
                    Compile_all_targets: {
                        for (let indexTarget = 0; indexTarget < targetPaths.length; indexTarget++) {
                            const targetPath = targetPaths[indexTarget];
                            const targetCompilation = await subcompiler._compileRecursively({
                                resource: subcompiler.fullpathOf(targetPath),
                                isRoot: false
                            }, compilationProcess);
                            Inject_in_compilation_text: {}
                            Inject_in_report_object: {
                                this._reportFileToken(compilationFile, targetPath, token);
                                Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
                            }
                        }
                    }
                }
                this._traceOut("_compileAsModulerImport", arguments);
            }
            async _compileAsModulerExport(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsModulerExport", arguments);
                    return false;
                }
                this._traceIn("_compileAsModulerExport", arguments);
                let parameters, namedParameters = {}, targetPaths = [];
                const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot, subcompiler: subcompiler} = compilationFile;
                Evaluate_parameters: {
                    parameters = await this._getDataForTokenCompilation({
                        compilationFile: compilationFile,
                        compilationProcess: compilationProcess,
                        token: token,
                        tokenIndex: tokenIndex
                    }, {
                        onError(error) {
                            return error;
                        }
                    });
                }
                if (parameters instanceof Error) {
                    Handle_errors_evaluating_parameters: {
                        console.error(`The load of inner parameters of token type «$moduler.export» on file «${compilationFile.resource}» could not be retrieved maybe because of runtime code that cannot be solved on compilation-time on «ModulerV6.prototype._compileAsModulerExport»`);
                        console.error(parameters);
                    }
                } else {
                    Extract_targets_path: {
                        namedParameters = this.moduler._formatExportParameters(parameters, compilationFile.resource);
                        targetPaths = (namedParameters.file ? [ namedParameters.file ] : []).concat(namedParameters.dependencies);
                    }
                    Extend_token: {
                        token.dependenciesOf = targetPaths;
                    }
                    Compile_all_targets: {
                        for (let indexTarget = 0; indexTarget < targetPaths.length; indexTarget++) {
                            const targetPath = targetPaths[indexTarget];
                            const targetCompilation = await subcompiler._compileRecursively({
                                resource: subcompiler.fullpathOf(targetPath),
                                isRoot: false
                            }, compilationProcess);
                            Inject_in_compilation_text: {}
                            Inject_in_report_object: {
                                this._reportFileToken(compilationFile, targetPath, token);
                                Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
                            }
                        }
                    }
                }
                this._traceOut("_compileAsModulerExport", arguments);
            }
            async _compileAsRequires(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                if (compilationProcess.to !== "data") {
                    this._trace("_compileAsRequires", arguments);
                    return false;
                }
                this._traceIn("_compileAsRequires", arguments);
                let parameters, targetPath, targetCompilation;
                const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
                Evaluate_parameters: {
                    parameters = await this._getDataForTokenCompilation({
                        compilationFile: compilationFile,
                        compilationProcess: compilationProcess,
                        token: token,
                        tokenIndex: tokenIndex
                    });
                }
                Extend_token: {
                    this._extendToken(token, [ "referenceOf" ]);
                }
                Extract_target_path: {
                    this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsRequires»");
                    targetPath = token.referenceOf.fullpath;
                }
                Compile_target: {
                    targetCompilation = await this._compileRecursively({
                        resource: targetPath,
                        isRoot: false
                    }, compilationProcess);
                }
                Inject_in_compilation_text: {}
                Inject_in_report_object: {
                    if (compilationProcess.to !== "data") {
                        break Inject_in_report_object;
                    }
                    this._reportFileToken(compilationFile, targetPath, token);
                    Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
                }
                this._traceOut("_compileAsRequires", arguments);
            }
            async _compileAsInjects(compilationFile, compilationProcess, {token: token, tokenIndex: tokenIndex}) {
                this._traceIn("_compileAsInjects", arguments);
                let parameters, targetPath, targetCompilation;
                const {tokenization: tokenization, source: source, resource: resource, isRoot: isRoot} = compilationFile;
                Evaluate_parameters: {
                    parameters = await this._getDataForTokenCompilation({
                        compilationFile: compilationFile,
                        compilationProcess: compilationProcess,
                        token: token,
                        tokenIndex: tokenIndex
                    });
                }
                Extend_token: {
                    this._extendToken(token, [ "referenceOf" ]);
                }
                Extract_target_path: {
                    this.assert(token.referenceOf.fullpath === this.fullpathOf(parameters[0]), "DesignError: The first parameter and the token.referenceOf.fullpath should be the same on «CompilerV6.prototype._compileAsInjects»");
                    targetPath = token.referenceOf.fullpath;
                }
                Compile_target: {
                    targetCompilation = await this._compileRecursively({
                        resource: targetPath,
                        isRoot: false
                    }, compilationProcess);
                }
                Inject_in_compilation_text: {
                    if (compilationFile.resource.endsWith(".js")) {
                        let replacement = "";
                        if (targetPath.endsWith("js")) {
                            throw new Error("Syntax of «@injects» should not be used to import «js» files from «js» files. Use another syntax instead, like «$v6.injects.source» or «commented template injection» on «CompilerV6.prototype._compileAsInjects»");
                            replacement = targetCompilation.js;
                        } else if (targetPath.endsWith("css")) {
                            compilationFile.compilation.css += "\n" + targetCompilation.css;
                        } else if (targetPath.endsWith("md")) {
                            compilationFile.compilation.md += "\n\n" + targetCompilation.md;
                        } else {
                            throw new Error(`Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`);
                        }
                        compilationFile.compilation.js = this._replaceTextRange(compilationFile.compilation.js, token.location[0], token.location[1], replacement);
                    } else if (compilationFile.resource.endsWith(".css")) {
                        let replacement = "";
                        if (targetPath.endsWith("js")) {
                            throw new Error("Syntax of «@injects» can't be used to import «js» files from «css» files. Use another syntax instead.");
                            replacement = targetCompilation.js;
                        } else if (targetPath.endsWith("css")) {
                            compilationFile.compilation.css += "\n" + targetCompilation.css;
                        } else if (targetPath.endsWith("md")) {
                            compilationFile.compilation.md += "\n\n" + targetCompilation.md;
                        } else {
                            throw new Error(`Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`);
                        }
                        compilationFile.compilation.css = this._replaceTextRange(compilationFile.compilation.css, token.location[0], token.location[1], replacement);
                    } else if (compilationFile.resource.endsWith(".md")) {
                        let replacement = "";
                        if (targetPath.endsWith("js")) {
                            throw new Error("Syntax of «@injects» can't be used to import «js» files from «md» files. Use another syntax instead.");
                            replacement = targetCompilation.js;
                        } else if (targetPath.endsWith("css")) {
                            throw new Error("Syntax of «@injects» can't be used to import «css» files from «md» files. Use another syntax instead.");
                            compilationFile.compilation.css += "\n" + targetCompilation.css;
                        } else if (targetPath.endsWith("md")) {
                            compilationFile.compilation.md += "\n\n" + targetCompilation.md;
                        } else {
                            throw new Error(`Syntax of «@injects» on «${targetPath}» is trying to import foraneous file extension.`);
                        }
                        compilationFile.compilation.md = this._replaceTextRange(compilationFile.compilation.md, token.location[0], token.location[1], replacement);
                    } else {
                        throw new Error(`Syntax of «@injects» should only be available on «css,md» files and not on «${compilationFile.extension}»`);
                    }
                }
                Inject_in_report_object: {
                    if (compilationProcess.to !== "data") {
                        break Inject_in_report_object;
                    }
                    this._reportFileToken(compilationFile, targetPath, token);
                    Object.assign(compilationFile.report.tree, targetCompilation.report.tree);
                }
                this._traceOut("_compileAsInjects", arguments);
            }
            _compileAsJavadocComment() {
                this._trace("_compileAsJavadocComment", arguments);
            }
            _initializeLogger(directory) {
                this._trace("_initializeLogger", arguments);
                return this._logger = this.constructor.Logger.Manager.fromDirectory(directory, this);
            }
            _reportFileToken(compilationFile, targetBrute, token) {
                this._traceIn("_reportFileToken", arguments);
                const owner = this.rootdirOf(compilationFile.resource);
                const target = this.rootdirOf(targetBrute);
                if (!(owner in compilationFile.report.tree)) {
                    compilationFile.report.tree[owner] = {};
                }
                const reportedToken = this._cloneStructureAsJson(token);
                delete reportedToken.location;
                compilationFile.report.tree[owner][token.location.join("-")] = reportedToken;
                this._traceOut("_reportFileToken", arguments);
            }
            _getPreferredOutput(compilationFile, compilationProcess) {
                this._trace("_getPreferredOutput", arguments);
                return {
                    file: compilationFile.resource,
                    report: compilationProcess.to === "data" ? compilationFile.report : false,
                    ...compilationFile.compilation
                };
            }
            _hydrateParameters(parametersSource) {
                this._trace("_hydrateParameters", arguments);
                return new Function(`return [${parametersSource}]`).call();
            }
            _cloneForFile(resource, compiler = false) {
                this._traceIn("_cloneForFile", arguments);
                this.assert(typeof resource === "string", "Parameter «resource» must be string on «CompilerV6.prototype._cloneForFile»");
                this.assert(typeof this.basedir === "string", "Property «this.basedir» must be string on «CompilerV6.prototype._cloneForFile»");
                const dirpath = require("path").dirname(this.fullpathOf(resource));
                const clone = new this.constructor(dirpath, compiler || this);
                this._traceOut("_cloneForFile", arguments);
                return clone;
            }
            _cloneStructureAsJson(data) {
                return JSON.parse(JSON.stringify(data));
            }
            _extendToken(token, fields = [], submoduler = false) {
                this._trace("_extendToken", arguments);
                return Object.assign(token, !fields.includes("referenceOf") ? {} : {
                    referenceOf: (() => {
                        const entry = this._hydrateParameters(token.inner)[0];
                        const fullpath = this.fullpathOf(entry);
                        const rootpath = this.rootdirOf(fullpath);
                        return {
                            type: "file",
                            entry: entry,
                            fullpath: fullpath,
                            rootpath: rootpath
                        };
                    })()
                });
            }
            async _getDataForTokenCompilation(input, options = {}) {
                this._traceIn("_getDataForTokenCompilation", arguments);
                this.assert(typeof input === "object", "Parameter «input» must be object on «CompilerV6.prototype._getDataForTokenCompilation»");
                this.assert(typeof input.token === "object", "Parameter «input.token» must be object on «CompilerV6.prototype._getDataForTokenCompilation»");
                this.assert(typeof input.token.inner === "string", "Parameter «input.token.inner» must be string on «CompilerV6.prototype._getDataForTokenCompilation»");
                let output, parameters = undefined;
                if (typeof options.onError === "function") {
                    try {
                        parameters = this._hydrateParameters(input.token.inner);
                        Checks: {
                            this.assert(Array.isArray(parameters), `Parameters of injection must be an array in «${input.token.inner}» extracting parameters from resource «${input.resource}» on «CompilerV6.prototype._getDataForTokenCompilation»`);
                        }
                        output = parameters;
                    } catch (error) {
                        output = options.onError(error, parameters);
                    }
                } else {
                    parameters = this._hydrateParameters(input.token.inner);
                    Checks: {
                        this.assert(Array.isArray(parameters), `Parameters of injection must be an array in «${input.token.inner}» on «CompilerV6.prototype._getDataForTokenCompilation»`);
                    }
                    output = parameters;
                }
                this._traceOut("_getDataForTokenCompilation", arguments);
                return output;
            }
            _getStringForDevelopment(text, tab = 0) {
                this._trace("_getStringForDevelopment", arguments);
                return text.split("\n").map(line => JSON.stringify(line)).join("\n + ");
            }
            _existsFile(file) {
                const fullpathFile = this.normalizationOf(file);
                return require("fs").promises.readFile(fullpathFile).then(out => true).catch(err => false);
            }
            _createDefaultInjectedFile(file, targetId) {
                const filename = require("path").basename(file).replace(/\.js$/g, "");
                let name, targetType, targetIsClass = false, targetRootdir;
                targetType = "any";
                targetRootdir = this.rootdirOf(file);
                name = (() => {
                    const isPrototype = filename.startsWith("prototype.");
                    const isStatic = filename.startsWith("static.");
                    const isClass = filename.endsWith(".class");
                    const isAsync = filename.match(/(^async\.)|(\.async\.)|(\.async$)/g);
                    const isSync = filename.match(/(^sync\.)|(\.sync\.)|(\.sync$)/g);
                    const isConstructor = filename === "constructor";
                    const isOnlyClass = isClass && !isPrototype && !isStatic;
                    const fileId = filename.replace(/^(prototype|static)\./g, "").replace(/^a?sync\./g, "").replace(/\.a?sync$/g, "").replace(/\.class$/g, "");
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
                        targetType = targetType === "class" ? targetType : targetType + " + class";
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
                const headerComment = `/**\n   * @file ${targetRootdir}\n   * @type ${targetType}\n   */`;
                return require("fs").promises.writeFile(file, `${name} {\n  ${headerComment}\n}`, "utf8").catch(error => {
                    console.log(`[!] Could not create injected path «${file}» on «ModulerV6.prototype._compileAsInjectSource»`);
                });
            }
            async _renderSourceAsTemplate(compilationFile, compilationProcess) {
                if (!compilationFile.resource.endsWith(".js")) {
                    return "ok:1:no js file so no template";
                }
                if (compilationProcess.disableTemplates) {
                    return "ok:2:disabled templates";
                }
                compilationFile.compilation.js = compilationFile.source = await this._renderTemplate(compilationFile.source, {
                    compilationFile: compilationFile,
                    compilationProcess: compilationProcess,
                    $compiler: this
                });
            }
            async _renderTemplate(templateSource, argsBrute = {}) {
                const {tokens: tokens} = this._parser.forTemplateComments.parse(templateSource);
                if (!tokens.length) {
                    return templateSource;
                }
                const args = Object.assign({}, argsBrute);
                const code = [ "const __out=[];\nconst print = function(...x) {\n  return __out.push(...x);\n};" ];
                let cursor = 0;
                for (const token of tokens) {
                    if (cursor < token.location[0]) code.push(`__out.push(${JSON.stringify(templateSource.slice(cursor, token.location[0]))});`);
                    if (token.type === "/*%") code.push(token.inner); else if (token.type === "/*%=") code.push(`__out.push(await (${token.inner}));`);
                    cursor = token.location[1] + 0;
                }
                if (cursor < templateSource.length) code.push(`__out.push(${JSON.stringify(templateSource.slice(cursor))});`);
                code.push("return __out.join('');");
                const templateCallback = new async function() {}.constructor(...Object.keys(args), code.join(""));
                const templateResult = await templateCallback.call(this, ...Object.values(args));
                return templateResult;
            }
            normalizationOf(nodepath, origin = false) {
                this._trace("normalizationOf", arguments);
                return this.moduler.normalizationOf(nodepath);
            }
            rootdirOf(fullpath) {
                this._trace("rootdirOf", arguments);
                const normalization = this.normalizationOf(fullpath);
                return normalization.startsWith(this.rootdir + "/") ? normalization.replace(this.rootdir + "/", "@/") : normalization;
            }
            fullpathOf(nodepath) {
                this._trace("fullpathOf", arguments);
                if (nodepath.startsWith("@/")) {
                    return require("path").resolve(this.rootdir, nodepath.substr(2));
                }
                return require("path").resolve(this.basedir, nodepath);
            }
            async compile(resource, options = {}) {
                return this._compileRecursively({
                    resource: this.normalizationOf(resource),
                    isRoot: true
                }, {
                    ...options
                });
            }
            setBasedir(basedir) {
                this.basedir = this.normalizationOf(basedir);
                this.moduler.basedir = this.basedir;
            }
            setRootdir(rootdir) {
                this.rootdir = this.normalizationOf(rootdir);
                this.moduler.rootdir = this.rootdir;
            }
            log(...args) {
                if (!this._logger) {
                    this._logger = new this.constructor.Logger({
                        file: false
                    }, this);
                }
                this._logger.log(...args);
            }
        };
        return CompilerV6;
    }.call());
    return class DevBinaryV6 {
        static create(...args) {
            return new this(...args);
        }
        static fromRootDirectoryOf(dir, file = "package.json") {
            return this.Utils.findFirstParentDirectoryContaining(dir, file).then(upperDir => new this(upperDir));
        }
        static Refrescador=require(`${__dirname}/refrescador/refrescador.api.dist.js`);
        static CompilerV6=CompilerV6;
        static Cronometer=() => {
            let tasks = Object.assign({}, {
                counter: 0
            });
            const getTask = function(name) {
                if (tasks[name]) return tasks[name];
                tasks[name] = {
                    name: name,
                    openedAt: null,
                    lastMarkAt: null,
                    stoppedAt: null,
                    marks: [],
                    open(label) {
                        const now = new Date;
                        this.openedAt = now;
                        this.lastMarkAt = now;
                        this.stoppedAt = null;
                        this.marks = [];
                        this.order = tasks.counter++;
                        if (label) this.mark(label);
                        return this;
                    },
                    mark(label) {
                        const now = new Date;
                        this.marks.push({
                            label: label,
                            fromLast: now - this.lastMarkAt,
                            fromStart: now - this.openedAt
                        });
                        this.lastMarkAt = now;
                        return this;
                    },
                    stop(label) {
                        if (label) this.mark(label);
                        this.stoppedAt = new Date;
                        return this;
                    }
                };
                return tasks[name];
            };
            getTask.export = function() {
                return Object.values(tasks).map(task => ({
                    name: task.name,
                    fromStart: task.stoppedAt - task.openedAt,
                    marks: (task.marks || []).map(it => `·${it.fromStart} | +${it.fromLast} | #${it.label}`)
                }));
            };
            getTask.print = function() {
                const out = getTask.export();
                return console.log(JSON.stringify(out, null, 2)) || out;
            };
            getTask.reset = function() {
                tasks = Object.assign({}, {
                    counter: 0
                });
            };
            return getTask;
        };
        static ModulerV6=CompilerV6.ModulerV6;
        static Utils=class DevBinaryV6Utils {
            static defaultTouchFileOptions(overrider = {}) {
                return {
                    propagateUp: true,
                    ...overrider
                };
            }
            static async findFirstParentDirectoryContaining(dirBrute, file = "package.json", includingSelf = true) {
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
                    } catch (error) {}
                    prevDir2 = dir2;
                    dir2 = path.dirname(dir2);
                }
                if (selectedDir) {
                    return selectedDir;
                }
                throw new Error(`No directory up found with file «${file}» from directory «${dir}» on «DevBinaryV6Utils.findFirstParentDirectoryContaining»`);
            }
            assert(...args) {
                return this.devbin.moduler.assert(...args);
            }
            parseCliArgs(args) {
                this.assert(typeof args === "object", `Parameter «args» must be object on «DevBinaryV6.Utils.prototype.parseCliArgs»`);
                this.assert(Array.isArray(args), `Parameter «args» must be array on «DevBinaryV6.Utils.prototype.parseCliArgs»`);
                this.assert(args.length !== 0, `Parameter «args» must have at least 1 item on «DevBinaryV6.Utils.prototype.parseCliArgs»`);
                let params = {
                    _: []
                };
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
            formatCliArgs(definition = false, argsBrute = process.argv) {
                this.assert(typeof definition === "object", "Parameter «definition» must be object on «DevBinaryV6.Utils.prototype.formatCliArgs»");
                Validate_arguments: {
                    this.assert(typeof argsBrute === "object", "Parameter «args» must be object on «DevBinary.Utils.prototype.formatCliArgs»");
                    this.assert(argsBrute !== null, "Parameter «args» cannot be null on «DevBinary.Utils.prototype.formatCliArgs»");
                }
                let args, result, usedKeys;
                Initialize_args: {
                    args = Array.isArray(argsBrute) ? this.parseCliArgs(argsBrute) : argsBrute;
                }
                result = {};
                Initialize_positionals: {
                    result._ = args ? args._ : [];
                }
                usedKeys = new Set([ "_" ]);
                Iterating_definition_entries: for (const [name, config] of Object.entries(definition)) {
                    const longKey = "--" + name;
                    const aliases = config.alias || [];
                    const sources = [];
                    if (longKey in args) {
                        sources.push({
                            key: longKey,
                            value: args[longKey]
                        });
                    }
                    Iterating_aliases: for (const alias of aliases) {
                        if (alias in args) {
                            sources.push({
                                key: alias,
                                value: args[alias]
                            });
                        }
                    }
                    if (sources.length > 1) {
                        throw new Error(`Option "${name}" was specified multiple times (${sources.map(v => v.key).join(", ")}).`);
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
                        value = config.onFormat.call(this, [ ...value ]);
                    }
                    result[name] = value;
                }
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
            async compileDistribuiblesOf(filepath, event) {
                let compilation, srcDistJs, srcDistCss, srcDistMd, distJs, distCss, distMd, report;
                Initialize_report: {
                    report = {};
                }
                Get_compilation: {
                    compilation = await this.devbin.compiler.compile(filepath, {
                        processedEntries: event.processedEntries,
                        uncacheInjections: event.uncacheInjections,
                        dontCreateOnInjectSource: false
                    });
                }
                Get_dist_filepaths: {
                    const outputNames = this.getDistribuibleFilenamesOf(compilation.file);
                    const inputDir = require("path").dirname(outputNames.file);
                    const inputRootdir = this.devbin.compiler.rootdirOf(inputDir);
                    const outputDir = this.devbin.compiler.fullpathOf(inputRootdir.replace(/^\@\//g, "@/dist/"));
                    distJs = require("path").resolve(outputDir, outputNames.js);
                    distCss = require("path").resolve(outputDir, outputNames.css);
                    distMd = require("path").resolve(outputDir, outputNames.md);
                    srcDistJs = require("path").resolve(inputDir, outputNames.js);
                    srcDistCss = require("path").resolve(inputDir, outputNames.css);
                    srcDistMd = require("path").resolve(inputDir, outputNames.md);
                    report.names = outputNames;
                }
                Make_assertions_for_safety: {
                    this.assert(distJs.endsWith(".dist.js"));
                    this.assert(distCss.endsWith(".dist.css"));
                    this.assert(distMd.endsWith(".md"));
                    this.assert(distJs.includes("/dist/"));
                }
                Overwrite_dist_files: {
                    await this.ensureDirectoryOf(distJs);
                    if (compilation.js) {
                        const output = await require("terser").minify({
                            [distJs]: compilation.js
                        }, {
                            compress: false,
                            mangle: false,
                            toplevel: true,
                            format: {
                                comments: false,
                                beautify: true
                            }
                        });
                        await require("fs").promises.writeFile(distJs, output.code, "utf8");
                        report.js = distJs;
                        Save_in_touch_event_cache: {
                            event.processedEntries[compilation.file] = {
                                distJs: distJs
                            };
                        }
                    }
                    if (compilation.css) {
                        await require("fs").promises.writeFile(distCss, compilation.css, "utf8");
                        await require("fs").promises.writeFile(srcDistCss, compilation.css, "utf8");
                        report.css = distCss;
                    }
                    if (compilation.md) {
                        await require("fs").promises.writeFile(distMd, compilation.md, "utf8");
                        await require("fs").promises.writeFile(srcDistMd, compilation.md, "utf8");
                        report.md = distMd;
                    }
                }
                Feedback_report: {
                    return report;
                }
            }
            getDistribuibleFilenamesOf(fileBrute) {
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
                    throw new Error(`Parameter «file» must end with «.entry.js», «.entry.css» or «.entry.md» but it is «${file}» on «DevBinaryV6.Utils.prototype.getDistribuibleFilenamesOf»`);
                }
                return {
                    file: fileBrute,
                    rootdir: this.devbin.compiler.rootdirOf(fileBrute),
                    rootdirDirectory: require("path").dirname(this.devbin.compiler.rootdirOf(fileBrute)),
                    basename: file,
                    extension: fileExtension,
                    test: filename + ".test.js",
                    js: filename + ".dist.js",
                    css: filename + ".dist.css",
                    md: filename + ".md"
                };
            }
            async fabricateUnitTestFileOf(filepath, event) {
                const path = require("path");
                const fs = require("fs");
                const testunitFile = path.resolve(event.distribution.names.rootdirDirectory.replace(/^\@\/src/g, this.devbin.compiler.fullpathOf("@/test/unit/src")), event.distribution.names.test);
                const devBinaryV6Filepath = this.devbin.compiler.fullpathOf("@/dev/bin.js");
                const devBinaryV6RelativeFilepath = path.relative(path.dirname(testunitFile), devBinaryV6Filepath);
                if (!event.distribution.js) return;
                const relativeTarget = path.relative(path.dirname(testunitFile), event.distribution.js);
                const testunitContent = `const devbin = require(__dirname + ${JSON.stringify("/" + devBinaryV6RelativeFilepath)});\nconst target = require(__dirname + ${JSON.stringify("/" + relativeTarget)});\n\nmodule.exports = (async function () {\n\n  devbin.assert(true, "Test is empty right now");\n\n})();`;
                const testunitDir = path.dirname(testunitFile);
                if (!await this.existsFile(testunitFile)) {
                    await fs.promises.mkdir(testunitDir, {
                        recursive: true
                    });
                    await fs.promises.writeFile(testunitFile, testunitContent, "utf8");
                }
                return {
                    unitDir: testunitDir,
                    unitFile: testunitFile,
                    unitContent: testunitContent,
                    targetFile: event.distribution.names.file
                };
            }
            executeUnitTestFileOf(filepath, event) {
                console.log(`[*] Executing unit test file of: ${event.testFabrication.unitFile}`);
                delete require.cache[event.testFabrication.unitFile];
                return require(event.testFabrication.unitFile);
            }
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
                            processedEntries: event.processedEntries || {}
                        });
                    }
                }
                Propagate_to_upper_directory: {
                    pivotDirectory = upperDirectory;
                    Iterating_entries: while (true) {
                        const entries = await fs.promises.readdir(pivotDirectory, {
                            withFileTypes: true
                        });
                        const matchedEntries = entries.filter(e => e.isFile() && (e.name.endsWith(".entry.js") || e.name.endsWith(".entry.css") || e.name.endsWith(".entry.md"))).map(e => path.resolve(e.path, e.name));
                        if (matchedEntries.length) {
                            nextPropagationFiles = matchedEntries;
                            break Iterating_entries;
                        }
                        const parentDir = path.dirname(pivotDirectory);
                        if (parentDir === pivotDirectory) {
                            return null;
                        }
                        pivotDirectory = parentDir;
                    }
                    firstFile = nextPropagationFiles[0];
                    await Promise.all(nextPropagationFiles.map(file => this.touchFile(file, {
                        propagateUp: false,
                        processedEntries: event.processedEntries || {}
                    })));
                }
                return this.propagateUpTouchEventFrom(firstFile, event);
            }
            ensureDirectoryOf(file) {
                return require("fs").promises.mkdir(require("path").dirname(file), {
                    recursive: true
                }).catch(error => false);
            }
            async touchFile(file, optionsInput = {}) {
                this.assert(typeof file === "string", `Parameter «--file» must be string and not «${typeof file}» on «DevBinaryV6.Utils.prototype.touchFile»`);
                const fs = require("fs");
                const path = require("path");
                const filepath = this.devbin.compiler.fullpathOf(file);
                const event = this.constructor.defaultTouchFileOptions({
                    propagateUp: true,
                    processedEntries: {},
                    ...optionsInput
                });
                this.assert(optionsInput.uncacheInjections === event.uncacheInjections, "Las inyections 2");
                event.isJsEntry = filepath.endsWith(".entry.js");
                event.isCssEntry = filepath.endsWith(".entry.css");
                event.isMdEntry = filepath.endsWith(".entry.md");
                event.isJsTest = filepath.endsWith(".test.js");
                const isEntry = event.isJsEntry || event.isCssEntry || event.isMdEntry;
                Processing_entry: {
                    if (!isEntry) {
                        if (!event.isJsTest) console.log(`[-] Touch event dismissed from: ${filepath}`);
                        break Processing_entry;
                    }
                    console.log(`[*] Touch event triggered from: ${filepath}`);
                    Paso_1_compilar_distribuibles: {
                        Object.assign(event, {
                            distribution: await this.compileDistribuiblesOf(filepath, event)
                        });
                    }
                    Paso_2_fabricar_test_unitario: {
                        Object.assign(event, {
                            testFabrication: await this.fabricateUnitTestFileOf(filepath, event)
                        });
                    }
                    Paso_3_ejecutar_test_unitario: {
                        Object.assign(event, {
                            testExecution: await this.executeUnitTestFileOf(filepath, event)
                        });
                    }
                    Triggering_onDistribute_file: {
                        const onDistributeFile = path.join(path.dirname(filepath), "e.onDistribute.js");
                        await this.triggerCallbackFromFile(onDistributeFile, {
                            file: filepath,
                            event: event
                        });
                    }
                }
                Processing_test: {
                    if (event.isJsTest) {
                        console.log(`[-] Touch event processed as test from: ${filepath}`);
                        await this.executeUnitTestFileOf(filepath, {
                            testFabrication: {
                                unitFile: filepath
                            }
                        });
                        return event;
                    }
                }
                Triggering_onTouch_file: {
                    const onTouchFile = path.join(path.dirname(filepath), "e.onTouch.js");
                    await this.triggerCallbackFromFile(onTouchFile, {
                        file: filepath,
                        event: event
                    });
                }
                Propagating_touch_up: {
                    Paso_4_propagar_evento_arriba: {
                        Object.assign(event, {
                            touchPropagation: event.propagateUp ? await this.propagateUpTouchEventFrom(filepath, event) : false
                        });
                    }
                }
                return event;
            }
            async ensureCoreFrom(basedirInput, parametersInput = {}) {
                const basedir = this.devbin.compiler.normalizationOf(basedirInput);
                const parameters = Object.assign({}, {
                    ignoreErrors: false,
                    allowDirtyDirectory: false,
                    dontOverride: false
                }, parametersInput, {
                    from: basedirInput
                });
                const fs = require("fs");
                const path = require("path");
                const targetDir = path.resolve(parameters.from);
                const innerFiles = await fs.promises.readdir(targetDir);
                if (!parameters.allowDirtyDirectory) {
                    this.assert(innerFiles.length === 0, `Parameter «--from» should point to an empty directory but «${targetDir}» is not empty on «DevBinaryV6.Utils.prototype.ensureCoreFrom»`);
                }
                const currentPackageJson = (() => {
                    try {
                        return require(`${__dirname}/../package.json`);
                    } catch (error) {
                        return {
                            devDependencies: {},
                            dependencies: {}
                        };
                    }
                })();
                const initialPackageJson = {
                    name: "name-of-the-project",
                    bin: {},
                    main: "dist/main.dist.js",
                    scripts: {
                        test: "echo 'no tests now'"
                    },
                    dependencies: currentPackageJson.dependencies,
                    devDependencies: currentPackageJson.devDependencies,
                    author: "allnulled",
                    version: "1.0.0"
                };
                const utils = {};
                Object.assign(utils, {
                    _createDirectory: function(dir) {
                        return fs.promises.mkdir(dir);
                    },
                    _saveFile: async function(file, contents) {
                        if (parameters.dontOverride && await utils._existsFile(file)) {
                            return;
                        }
                        return await fs.promises.writeFile(file, contents, "utf8");
                    },
                    _duplicateFile: async function(src, dst) {
                        if (parameters.dontOverride && await utils._existsFile(dst)) {
                            return;
                        }
                        return await fs.promises.copyFile(src, dst);
                    },
                    _duplicateDirectory: function(src, dst) {
                        return fs.promises.cp(src, dst, {
                            recursive: true
                        });
                    },
                    _readFile: function(src) {
                        return fs.promises.readFile(src, "utf8");
                    },
                    trify: function(callback, errorSignal = false) {
                        return async function(...args) {
                            try {
                                return await callback(...args);
                            } catch (error) {
                                return errorSignal;
                            }
                        };
                    }
                });
                Object.assign(utils, {
                    _existsFile: utils.trify(utils._readFile, false)
                });
                const createDirectory = parameters.ignoreErrors ? utils.trify(utils._createDirectory) : utils._createDirectory;
                const saveFile = parameters.ignoreErrors ? utils.trify(utils._saveFile) : utils._saveFile;
                const duplicateFile = parameters.ignoreErrors ? utils.trify(utils._duplicateFile) : utils._duplicateFile;
                const duplicateDirectory = parameters.ignoreErrors ? utils.trify(utils._duplicateDirectory) : utils._duplicateDirectory;
                await createDirectory(`${targetDir}/dev`);
                await createDirectory(`${targetDir}/dev/bin`);
                await createDirectory(`${targetDir}/dev/bin/help`);
                await createDirectory(`${targetDir}/src`);
                await createDirectory(`${targetDir}/src/lib`);
                await createDirectory(`${targetDir}/dist`);
                await createDirectory(`${targetDir}/dist/src`);
                await createDirectory(`${targetDir}/dist/src/lib`);
                await createDirectory(`${targetDir}/test`);
                await createDirectory(`${targetDir}/test/unit`);
                await createDirectory(`${targetDir}/test/unit/src`);
                await createDirectory(`${targetDir}/docs`);
                await saveFile(`${targetDir}/package.json`, JSON.stringify(initialPackageJson, null, 2), "utf8");
                if (!await utils._existsFile(`${targetDir}/.gitignore`)) await saveFile(`${targetDir}/.gitignore`, "node_modules", "utf8");
                await saveFile(`${targetDir}/dev/bin/help/command.js`, 'module.exports = async function() {\n  throw new Error("Command «help» is not coded yet");\n};', "utf8");
                await saveFile(`${targetDir}/dev/run.js`, "#!/usr/bin/env node\n\nmodule.exports = require(`${__dirname}/bin.js`).selfDispatch();", "utf8");
                await saveFile(`${targetDir}/dev/bin.js`, "#!/usr/bin/env node\n\nrequire(`${__dirname}/../dist/src/lib/dev-binary-v6.dist.js`);\n\nmodule.exports = DevBinaryV6.create(`${__dirname}/..`);", "utf8");
                await duplicateFile(`${__dirname}/moduler-v6.dist.js`, `${targetDir}/src/lib/moduler-v6.entry.js`);
                await duplicateFile(`${__dirname}/moduler-v6.dist.js`, `${targetDir}/dist/src/lib/moduler-v6.dist.js`);
                await duplicateFile(`${__dirname}/compiler-v6.dist.js`, `${targetDir}/src/lib/compiler-v6.entry.js`);
                await duplicateFile(`${__dirname}/compiler-v6.dist.js`, `${targetDir}/dist/src/lib/compiler-v6.dist.js`);
                await duplicateFile(`${__dirname}/dev-binary-v6.dist.js`, `${targetDir}/src/lib/dev-binary-v6.entry.js`);
                await duplicateFile(`${__dirname}/dev-binary-v6.dist.js`, `${targetDir}/dist/src/lib/dev-binary-v6.dist.js`);
                await duplicateFile(`${__dirname}/refrescador.dist.js`, `${targetDir}/src/lib/refrescador.entry.js`);
                await duplicateFile(`${__dirname}/refrescador.dist.js`, `${targetDir}/dist/src/lib/refrescador.dist.js`);
                await duplicateDirectory(`${__dirname}/refrescador`, `${targetDir}/src/lib/refrescador`, {
                    recursive: true
                });
                await duplicateDirectory(`${__dirname}/refrescador`, `${targetDir}/dist/src/lib/refrescador`, {
                    recursive: true
                });
                return {
                    targetDir: targetDir
                };
            }
            existsFile(file) {
                return require("fs").promises.access(file).then(() => true).catch(error => false);
            }
            async triggerCallbackFromFile(file, injection = {}, dontThrow = false) {
                if (!await this.existsFile(file)) {
                    return -1;
                }
                const callback = require(file);
                this.assert(typeof callback === "function", `File «${file}» should export a function on «DevBinaryV6.Utils.prototype.triggerCallbackFromFile»`);
                return await callback.call(this, {
                    devbin: this,
                    ...injection
                });
            }
            constructor(devbin) {
                this.devbin = devbin;
            }
        };
        static ShadowCommands=class DevBinaryV6ShadowCommands {
            constructor(devbin) {
                this.devbin = devbin;
            }
            assert(...args) {
                return this.devbin.assert(...args);
            }
            "new project"(args, devbin) {
                const parameters = devbin.utils.formatCliArgs({
                    from: {
                        onFormat: devbin.constructor.Formatters.asString,
                        default: false,
                        alias: [ "-f" ],
                        description: "Empty directory from which to start the new project"
                    }
                }, args);
                this.assert(typeof parameters.from === "string", `Parameter «--from» is required as string on «DevBinaryV6.ShadowCommands.prototype['new project']»`);
                return devbin.utils.ensureCoreFrom(parameters.from, {
                    ignoreErrors: 0,
                    allowDirtyDirectory: 0
                });
            }
            async "ensure core"(args, devbin) {
                const parameters = devbin.utils.formatCliArgs({
                    from: {
                        onFormat: devbin.constructor.Formatters.asString,
                        default: false,
                        alias: [ "-f" ],
                        description: "Any directory from which to ensure the core os a devbin project"
                    },
                    reset: {
                        onFormat: devbin.constructor.Formatters.asBoolean,
                        default: false,
                        alias: [ "-r" ],
                        description: "Overwrites all core files if used"
                    }
                }, args);
                this.assert(typeof parameters.from === "string", `Parameter «--from» is required as string on «DevBinaryV6.ShadowCommands.prototype['ensure core']»`);
                this.assert(typeof parameters.reset === "boolean", `Parameter «--reset» is required as boolean on «DevBinaryV6.ShadowCommands.prototype['ensure core']»`);
                return devbin.utils.ensureCoreFrom(parameters.from, {
                    ignoreErrors: 1,
                    allowDirtyDirectory: 1,
                    dontOverride: !parameters.reset
                });
            }
            "print root"(args, devbin) {
                console.log(devbin.compiler.rootdir);
            }
            async loop(args) {
                const targetRoot = await this.devbin.utils.constructor.findFirstParentDirectoryContaining(process.cwd(), "package.json");
                const targetDirs = [ require("path").resolve(targetRoot, "src"), require("path").resolve(targetRoot, "test/unit/src") ];
                return this.devbin.constructor.Refrescador.run({
                    watch: targetDirs,
                    bulletproof: false,
                    ignore: [ "**/node_modules/**/*", "**/dist/**/*", "**/*.dist.*", "**/logs/**/*" ],
                    port: 3005,
                    debounce: 0,
                    extensions: [ "js", "css", "html", "md" ],
                    execute: [ "dev/run.js touch --file @{refrescador.file}" ],
                    message: "El tiempo de refrescar ha llegado",
                    messageFile: "TODO.md",
                    payload: 'console.log("📟 Evento de refrescar activado");'
                });
            }
            touch(args) {
                const parameters = this.devbin.utils.formatCliArgs({
                    file: {
                        onFormat: this.devbin.constructor.Formatters.asString,
                        default: false,
                        alias: [ "-f" ],
                        description: "Target file. Must be js, css or md."
                    },
                    trace: {
                        onFormat: this.devbin.constructor.Formatters.asString,
                        default: false,
                        alias: [ "-t" ],
                        description: "Message to use as traceable property."
                    },
                    uncacheInjections: {
                        onFormat: this.devbin.constructor.Formatters.asBoolean,
                        default: false,
                        alias: [ "-ui" ],
                        description: "To not use cache for files type «.entry.js». Defaults to false, so, it is used by default."
                    }
                }, args);
                this.assert(typeof parameters.file === "string", `Parameter «--file» is required as string on «DevBinaryV6.ShadowCommands.prototype.touch»`);
                return this.devbin.utils.touchFile(parameters.file, {
                    uncacheInjections: parameters.uncacheInjections
                });
            }
        };
        static Formatters={
            asString: function(values) {
                return values.at(-1);
            },
            asBoolean: function(values) {
                return true;
            }
        };
        cronometer=this.constructor.Cronometer();
        assert(...args) {
            return this.moduler.assert(...args);
        }
        async command(args = []) {
            let commandParameters, commandSubpath, commandCallback, commandType;
            Format_input: {
                if (Array.isArray(args)) {
                    commandParameters = this.utils.parseCliArgs(args);
                    break Format_input;
                } else if (typeof args === "object") {
                    commandParameters = args;
                    break Format_input;
                }
                throw new Error(`Parameter «args» must be array or object but «${typeof args}» was found instead on «DevBinary.prototype.command»`);
            }
            Define_path_from_command: {
                commandSubpath = this.compiler.normalizationOf(`./dev/bin/${commandParameters._.join("/")}/command.js`);
            }
            Load_command_callback_from_file_or_shadowCommands: {
                let isReadable = undefined;
                First_file: {
                    try {
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
                        const possibleHookId = commandParameters._.join(" ");
                        if (possibleHookId in this.shadowCommands) {
                            commandCallback = this.shadowCommands[possibleHookId];
                            break Load_command_callback_from_file_or_shadowCommands;
                        }
                        const errorMessage = `Error of «devbin command not found» for parameters «${commandParameters._.join("/")}»`;
                        console.error(errorMessage);
                        return new Error(errorMessage);
                    }
                }
            }
            Execute_command_callback: {
                return await commandCallback.call(this.shadowCommands, commandParameters, this, commandType, commandSubpath);
            }
        }
        selfDispatch() {
            return this.command([ ...process.argv ].splice(2));
            throw new Error("Method «selfDispatch» is not coded yet");
        }
        cloneForFile(resource, devbin = false) {
            this.assert(typeof resource === "string", "Parameter «resource» must be string on «DevBinaryV6.prototype.cloneForFile»");
            const dirpath = require("path").dirname(this.compiler.fullpathOf(resource));
            const clone = new this.constructor(dirpath, devbin);
            return clone;
        }
        static globalInstance=new DevBinaryV6;
        constructor(basedir, parent = null) {
            this.compiler = new CompilerV6(basedir || process.cwd(), ...parent ? [ parent.compiler ] : []);
            this.moduler = this.compiler.moduler;
            this.utils = parent ? parent.utils : new this.constructor.Utils(this);
            this.shadowCommands = parent ? parent.shadowCommands : new this.constructor.ShadowCommands(this);
        }
    };
}.call());