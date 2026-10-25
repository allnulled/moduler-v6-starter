window.addEventListener("load", async function() {
  Load_libraries: {
    console.log("[*] Loading libraries from browser");
    await $compiler.inject.source("./external/moduler-v6.entry.js");
    await $moduler.import("@/src/www/external/std/std-v1.entry.js");
    await $moduler.settings.load();
  }
  La_guarradinhia: {
    break La_guarradinhia;
    await $moduler.toolkit.waitUntil(function() {
      const isLoadingStd =
        (typeof Std === "undefined") ||
        (typeof Std.all === "undefined") ||
        (typeof Std.all.Tester === "undefined");
      const isLoadingMv6 = typeof ModulerV6 === "undefined";
      return isLoadingStd || isLoadingMv6;
    }, 10);
  }
  Update_page_links: {
    console.log("[*] Changing links from browser page");
    await ModulerV6.updateAllHtmlLinks();
  }
  Initialize_ui: {
    console.log("[*] Starting application in browser");
    await Std.classes.ApplicationStarter.start();
    console.log("[*] Browser application was started successfully");
  }
  Execute_tests: {
    console.log("[*] Starting tests in browser");
    if(["dev","test"].includes($moduler.settings.data.env)) {
      await Std.all.Tester.evaluateBrowserDirectory({ title: "Integridad", directory: "@/dist/www/dev/test/integrity" });
      await Std.all.Tester.evaluateBrowserDirectory({ title: "Unitarios", directory: "@/dist/www/dev/test/unit" });
      await Std.all.Tester.evaluateBrowserDirectory({ title: "Prestaciones", directory: "@/dist/www/dev/test/feature" });
      await Std.all.Tester.evaluateBrowserDirectory({ title: "Caso concreto", directory: "@/dist/www/dev/test/case" });
      await Std.all.Tester.evaluateBrowserDirectory({ title: "Espontáneos", directory: "@/dist/www/dev/test/spontaneous" });
    }
  }
});