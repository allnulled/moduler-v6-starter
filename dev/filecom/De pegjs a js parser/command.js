module.exports = async function ({ devbin, parameters }) {
  
  const normalized = {
    command: parameters.command.join("/"),
    in: devbin.moduler.normalizationOf(parameters.in),
    out: devbin.moduler.normalizationOf(parameters.out),
  };
  
  Validacion: {
    Resuelve_fichero_del_in: {
      if (!await devbin.files.hasFile(normalized.in)) {
        if (!await devbin.files.hasFile(`@/dev/filecom/${normalized.command}/in/${parameters.in}`)) {
          throw new Error(`Required parameter «--in» to match to an existing fullpath, rootedpath or local «@/dev/filecom/{command}/in/{input}» filename but none of them was matched by «${parameters.in}» on «devbin filecom -c "${normalized.command}"»`);
        }
        normalized.in = devbin.moduler.normalizationOf(`@/dev/filecom/${normalized.command}/in/${parameters.in}`);
      }
    }
    Resuelve_fichero_del_out: {
      if (!await devbin.files.hasFile(normalized.out)) {
        normalized.out = devbin.moduler.normalizationOf(`@/dev/filecom/${normalized.command}/out/${parameters.out}`);
      }
    }
  }

  //////////////////////////////

  Comando: {
    let source;
    let fs, peggy, grammar;
    Importacion: {
      fs = require("fs");
      peggy = require("peggy");
      grammar = await fs.promises.readFile(normalized.in, "utf8");
    }
    Generacion: {
      console.log(`[*] DevBinaryV6 is generating js parser source from peggy syntax at:`);
      devbin.console.setProfile("green").print(`   - ${devbin.moduler.rootdirOf(normalized.in)}`);
      source = peggy.generate(grammar, { output: "source", format: "commonjs" });
    }
    Exportacion: {
      console.log(`[*] DevBinaryV6 is saving js parser source from peggy syntax at:`);
      devbin.console.setProfile("green").print(`   - ${devbin.moduler.rootdirOf(normalized.out)}`);
      await fs.promises.writeFile(normalized.out, source, "utf8");
    }
  }

}