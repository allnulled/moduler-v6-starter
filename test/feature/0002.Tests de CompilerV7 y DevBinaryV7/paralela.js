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
  const compilation = await CompilerV7.compile('@/test/feature/0002.Tests de CompilerV7 y DevBinaryV7/test002/main.js');
  Std.classes.Printer.json(compilation.out);
};