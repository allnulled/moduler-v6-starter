module.exports = $moduler.import([
  "@/dist/www/modules/Refrescador/Refrescador.dist.js",
  "@/dist/www/modules/CompilerV7/CompilerV7.dist.js",
], function() {
  return Std.all.DevBinaryV7 = Std.classes.DevBinaryV7 = class DevBinaryV7 {
  static utils = {
    findRootDirectoryFrom: async (file, target = "package.json") => {
  const fsp = require("fs").promises;
  const path = require("path");
  let dir = file;
  let dirBefore = null;
  let isSatisfied = false;
  do {
    dirBefore = dir;
    dir = path.dirname(dir);
    const fileTarget = `${dir}/${target}`;
    isSatisfied = await fsp.access(fileTarget).then(() => true).catch(() => false);
    if(isSatisfied) return dir;
  } while(dir !== dirBefore);
  return null;
},
  };
  static loop (optionsBrute = {}) {
  let options;
  const [info, silent] = Std.classes.AnsiProfiles.as(["info","silent"]);
  Define_options: {
    options = Object.assign({}, {
      target: null,
      reactors: [{
        from: "**/*",
        do: function(file) {
          console.log("[!] You should be setting manually the reactors for the DevBinaryV7.loop");
        }
      }],
      // Server options:
      port: 4004,
      staticDirectory: "dist/www",
      staticUrlPrefix: "/",
      socketEvent: "filetouch",
      socketPayload: false,
    }, optionsBrute);
  }
  Validate_options: {
    $moduler.assert(typeof options.target === "string", `Required «options.target» to be string on «DevBinaryV7.loop»`);
    $moduler.assert(typeof options.target === "string", `Required «options.target» to be string on «DevBinaryV7.loop»`);
  }
  Start_watcher: {
    info.print("[*] DevBinaryV7 looping on: " + options.target);
    const watcher = require("chokidar").watch(options.target);
    watcher.on("change", async (file) => {
      silent.print("[*] Changes on: " + $moduler.rootdirOf(file));
      this.touch(file, options);
    });
    return { watcher };
    /*
    Std.externals.Refrescador.run({
      watch: [options.target],
      port: 4004,
      // Todas estas de selectores|reactores se eliminan:
      extensions: ["html", "css", "js"].concat(options.extensions),
      ignore: ["**node_modules**"],
      ignoreCallback: __dirname + "/ignorer.js",
      howeverListen: [],
      message: "El tiempo de refrescar ha llegado",
      messageFile: "TODO.md",
      execute: ["echo 'hello from the trigger'", "node program.js @{refrescador.file}"],
      executeCallback: ["file/from/cwd/target.js", ],
      basedir: __dirname,
      ////////////////////////////////////////////////////////
      // Y las de server se mantienen:
      payload: 'console.log("📟 Evento de refrescar activado");',
      payloadFile: 'browser-payload.js',
      serve: 'some/static/www',
      urlPrefix: 'subpath/on/server',
      staticPath: 'static/content',
      bulletproof: false,
      controllers: [__dirname + "/controller1.js"],
      debounce: 50,
      ...options,
    })
      //*/
  }
}
  static touch (file, options) {
  let out = [];
  const picomatch = require("picomatch");
  const reactors = options.reactors;
  Iterating_reactors:
  for(let index=0; index<reactors.length; index++) {
    const reactor = reactors[index];
    if(!picomatch.isMatch(file, reactor.from)) {
      continue Iterating_reactors;
    }
    const result = reactor.do(file, options);
    out = out.concat([ result ]);
  }
  return out;
}
};
});