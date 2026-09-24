$compiler.inject.source("./external/moduler-v6.entry.js");

window.addEventListener("load", async function() {
  console.log("[*] Page loaded");
  const Std = await $moduler.import("@/src/www/external/std/std-v1.entry.js");
  await $moduler.settings.load();
  if(["dev","test"].includes($moduler.settings.data.env)) {
    await Std.all.Tester.evaluateBrowserDirectory({ title: "Integridad", directory: "@/dist/www/dev/test/integrity" });
    await Std.all.Tester.evaluateBrowserDirectory({ title: "Unitarios", directory: "@/dist/www/dev/test/unit" });
    await Std.all.Tester.evaluateBrowserDirectory({ title: "Prestaciones", directory: "@/dist/www/dev/test/feature" });
    await Std.all.Tester.evaluateBrowserDirectory({ title: "Caso concreto", directory: "@/dist/www/dev/test/case" });
    await Std.all.Tester.evaluateBrowserDirectory({ title: "Espontáneos", directory: "@/dist/www/dev/test/spontaneous" });
  }
});