class CompilationOutput {

  static {
    $moduler.toolkit.makeClass([
      {
        static: {
          create(...args) {
            return new this(...args);
          },
        },
        prototype: {
          fromChannelToFile(id, fileBrute) {
            return require("fs").promises.writeFile($moduler.normalizationOf(fileBrute), this.channel[id].content, "utf8");
          },
          toDirectory(dir, filenameBrute) {
            const fs = require("fs");
            const filename = filenameBrute.replace(/\,js$/g, "");
            const files = Object.keys(this.channel).filter(id => id.startsWith("~."));
            const promises = files.map(id => {
              const filepathBrute = $moduler._joinPaths([dir, id.replace("~", filename)])
              const filepath = $moduler.normalizationOf(filepathBrute);
              const filecontent = this.channel[id].content;
              return fs.promises.writeFile(filepath, filecontent, "utf8");
            });
            return { files, promises };
          }
        },
      },
    ], this);
  }

  constructor(initialState, metadata) {
    $moduler.assert(metadata.from === "compileTokens", `CompilationState can only be created «from=compileTokens» but «${metadata.from}» was found instead on «CompilationState.constructor»`);
    Object.assign(this, initialState);
  }

}