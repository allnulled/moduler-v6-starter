$moduler.section.set("#Std", {});

module.exports = $moduler.import(["#Std"], async function ([Std]) {
  const { Core } = await $moduler
    .lockFiles(["@/dist/src/candidate/Std/Core/Core.dist.js"])
    .until(
      Promise.fromCollection({
        Core: function ({ module, exports, $moduler }) {
          return $moduler.releaseFile(
            "@/dist/src/candidate/Std/Core/Core.dist.js",
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
          $moduler.reserveFile("@/dist/src/candidate/Std/Core/Core.dist.js"),
        ),
      }),
    );
  return Object.assign(Std, {
    Core: Core,
  });
});
