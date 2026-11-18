module.exports = async function() {
  const [ info, success, error, silent ] = Std.classes.AnsiProfiles.as(["info", "success", "error", "silent:1"]);
  info.print("[?] Informacion");
  success.print("[*] Exito");
  error.print("[!] Fracaso");
  silent.print("[!] Silencioso");
  const CompilerV7 = await Std.classes.ModuleLoader.load("CompilerV7");
  const DevBinaryV7 = await Std.classes.ModuleLoader.load("DevBinaryV7");
  console.log(CompilerV7);
  console.log(DevBinaryV7);
  const originDir = `@/test/feature/0002.Tests de CompilerV7 y DevBinaryV7/test001`;
  Test_del_loop: {
    break Test_del_loop;
    DevBinaryV7.loop({
      target: $moduler.normalizationOf(originDir),
      port: 6770,
      reactors: [{
        from: "**/*",
        do: async function(file) {
          const compilation = await CompilerV7.compile(file);
          console.log(compilation);
          info.print("[!] Acabas de tocar un fichero importante: " + file);
        }
      }, {
        from: "**/*",
        do: function(file) {
          info.print("[!] Acabas de tocar un fichero importante: " + file);
        }
      }, {
        from: "**/*",
        do: function(file) {
          info.print("[!] Acabas de tocar un fichero importante: " + file);
        }
      }]
    });
    await Std.classes.Timeout.of(100);
    await Std.objects.Nodefs.writeFile(`${originDir}/file1.txt`, "1");
  }
  Test_del_toDirectory: {
    // break Test_del_toDirectory;
    const compilation = await CompilerV7.compile("@/test/feature/0002.Tests de CompilerV7 y DevBinaryV7/test002/main.js");
    const { files: outputFiles } = await compilation.out.toDirectory("@/test/feature/0002.Tests de CompilerV7 y DevBinaryV7/test002/dist", "test002-main.dist");
    Std.classes.Printer.json(outputFiles);
  }
  Test_del_template: {
    // break Test_del_template;
    const compilation = await CompilerV7.compile("@/test/feature/0002.Tests de CompilerV7 y DevBinaryV7/test003-templates/main.js");
    await compilation.out.toDirectory("@/test/feature/0002.Tests de CompilerV7 y DevBinaryV7/test003-templates/dist", "test003-templates.dist");
    const modulez1 = await $moduler.import("@/test/feature/0002.Tests de CompilerV7 y DevBinaryV7/test003-templates/dist/test003-templates.dist.js")
    $moduler.assert(Array.isArray(modulez1), "Failing test of templates (1)");
    $moduler.assert(modulez1.length === 10, "Failing test of templates (2)");
    $moduler.assert(modulez1[0] === 0, "Failing test of templates (3)");
  }

};