window.addEventListener("load", async function() {
  Load_libraries: {
    console.log("[*] Loading libraries from browser");
    await $compiler.inject.source("./external/moduler-v6.entry.js");
    await $moduler.import("@/src/www/external/std/std-v1.entry.js");
    await $moduler.settings.load();
  }
  Initialize_ui: {
    console.log("[*] Starting application in browser");
    await Std.classes.ApplicationStarter.start();
    console.log("[*] Browser application was started successfully");
  }
});