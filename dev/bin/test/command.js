module.exports = async function(parameters, devbin) {
  // devbin.console.setProfile("blackBright").print("[*] DevBinaryV6 reminds here that command «devbin test» is customizable at «@/dev/bin/test/command.js»");
  await $moduler.import("@/dist/www/external/std/std-v1.dist.js");
  await $moduler.importCallback("@/test/feature/0002.Tests de CompilerV7 y DevBinaryV7/paralela.js");
};