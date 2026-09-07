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
    const expressions = (await devbin.files.readFile(normalized.in)).split("\n").filter(it => it.trim() !== "");
    devbin.assert(expressions.length, `Required file of parameter «--in=${devbin.moduler.rootdirOf(normalized.in)}» to provide 1 or more entries to glob patterns on «devbin print directory»`);
    const params = ["print", "directory", "--patterns", ...expressions, "--output", normalized.out];
    devbin.command(params);
  }

}