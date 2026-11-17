class CompilerV7 {

  static {
    $moduler.toolkit.makeClass([
      {
        static: {
          get globalInstance() {
            return this._globalInstance = this._globalInstance || new this({
              moduler: $moduler
            });
          },
          compile: function(...args) {
            return this.globalInstance.compile(...args)
          }
        },
        prototype: {
          cloneForFile: function(targetFile) {
            return this.cloneForDirectory(require("path").dirname(targetFile));
          },
          cloneForDirectory: function(targetFile) {
            return new this.constructor({
              moduler: ModulerV6.create(this.moduler.normalizationOf(targetFile)),
            });
          },
          _parser: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/CompilerV7Parser.object.js"),
          _classes: {
            CompilationState: $compiler.inject.source("@/src/www/modules/CompilerV7/classes/CompilationState/CompilationState.class.js"),
          },
          _degrammerFor: {
            "$compiler.inject": {
              code: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/code.js"),
              string: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/string.js"),
              plain: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/plain.js"),
              template: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/template.js"),
              action: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/action.js"),
            },
          },
          _compileTokens: async function(tokens, { options, source, file }, rootState = null) {
            let fileExtension, state;
            Initialize_state: {
              fileExtension = require("path").extname(file);
              state = this._classes.CompilationState.create({
                input: {
                  file: {
                    path: file,
                    rootpath: this.moduler.rootdirOf(file),
                  },
                  source: source,
                  tokens: tokens,
                  options: options,
                },
                memory: {
                  textIndex: 0,
                  tokenization: [],
                  fileExtension: fileExtension,
                  fileChannel: `~${fileExtension}`,
                  detokenization: [],
                },
                output: {
                  channel: {},
                },
              }, {
                from: "compileTokens"
              });
              state.memory.currentChannel = state.memory.fileChannel;
              state.output.channel[state.memory.currentChannel] = { content: "" };
            }
            Degramme_tokens: {
              Inject_pretoken: {
                if(tokens.length === 0) {
                  const pretoken = {
                    grammar: "plain text",
                    outerLocation: [
                      0,
                      source.length,
                    ],
                  };
                  state.addDetoken({ token: pretoken, replacedBy: source.slice(...pretoken.outerLocation) });
                }
              }
              for (let index = 0; index < tokens.length; index++) {
                const token = tokens[index];
                const degrammer = this._degrammerFor[token.grammar][token.operation];
                const tokenStartPos = token.outerLocation[0];
                Inject_intertext: {
                  if(tokenStartPos === state.memory.textIndex) {
                    break Inject_intertext;
                  }
                  const intertoken = {
                    grammar: "plain text",
                    outerLocation: [
                      state.memory.textIndex,
                      tokenStartPos,
                    ],
                  };
                  state.addDetoken({ token: intertoken, replacedBy: source.slice(...intertoken.outerLocation) });
                }
                const detoken = await degrammer.detokenize({ token, state, index, compiler: this, });
                state.addDetoken({ ...detoken, token });
              }
              Inject_postoken: {
                if(state.memory.textIndex !== source.length) {
                  const postoken = {
                    grammar: "plain text",
                    outerLocation: [
                      state.memory.textIndex,
                      source.length,
                    ],
                  };
                  state.addDetoken({ token: postoken, replacedBy: source.slice(...postoken.outerLocation) });
                }
              }
            }
            Formalize_output: {
              for(let index=0; index<state.memory.detokenization.length; index++) {
                const detoken = state.memory.detokenization[index];
                if(detoken.replacedBy) {
                  state.appendToChannel(null, detoken.replacedBy || source.slice(...detoken.token.outerLocation));
                }
              }
            }
            return { in: state.input, out: state.output, memory: state.memory, };
          },
          compile: function(...args) {
            return this._compile(...args);
          },
          _compile: async function(fileBrute, options = {}, rootState = null) {
            const file = this.moduler.normalizationOf(fileBrute);
            const source = await require("fs").promises.readFile(file, "utf8");
            const tokens = this._parser.parse(source);
            const result = await this._compileTokens(tokens, { options, source, file }, rootState);
            return result;
          }
        },
      }
    ], this);
  }

  constructor(defaultOptions = {}) {
    Object.assign(this, {}, this.constructor.defaultInstance, defaultOptions);
  }

}