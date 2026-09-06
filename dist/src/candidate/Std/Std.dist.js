$moduler.section.set("Std", {});

module.exports = $moduler.import([], async function () {
  const Std = $moduler.section.get("Std");
  const { Core } = await $moduler
    .lockFiles(["@/src/candidate/Std/Core/Core.entry.js"])
    .until(
      Promise.fromCollection({
        Core: function ({ module, exports }) {
          return $moduler.releaseFile(
            "@/src/candidate/Std/Core/Core.entry.js",
            arguments[0],
            function () {
              module.exports = $moduler.import([], function () {
                return class StdCore {
                  static version = "1.0";
                };
              });
            }.call(this),
          );
        }.call(
          this,
          $moduler.reserveFile("@/src/candidate/Std/Core/Core.entry.js"),
        ),
      }),
    );
  return Object.assign(Std, {
    Core: Core,
  });
});
