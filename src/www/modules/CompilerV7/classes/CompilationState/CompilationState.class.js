class CompilationState {
  
  static {
    $moduler.toolkit.makeClass([
      {
        static: {
          create(...args) {
            return new this(...args);
          },
          replaceTextRange(text, start, end, replacement) {
            return text.slice(0, start) + replacement + text.slice(end);
          },
          evaluateJs(code) {
            const callback = new Function(code);
            return callback();
          }
        }
      },
      {
        prototype: {
          addDetoken(detoken) {
            this.memory.detokenization.push(detoken);
            this.memory.textIndex = detoken.token.outerLocation[1];
          },
          appendToChannel(idBrute = null, text) {
            let id, channel, content;
            Initialize_channel_and_content: {
              id = idBrute || this.memory.currentChannel;
              channel = this.output.channel = this.output.channel || {};
              content = channel[id].content || "";
            }
            Operate_with_content: {
              content += text;
            }
            Change_content: {
              channel[id].content = content;
            }
          },
          get selectedChannel() {
            return this.output.channel[this.memory.currentChannel];
          }
        }
      }
    ], this);
  }

  constructor(initialState, metadata) {
    $moduler.assert(metadata.from === "compileTokens", `CompilationState can only be created «from=compileTokens» but «${metadata.from}» was found instead on «CompilationState.constructor»`);
    Object.assign(this, initialState);
  }

}