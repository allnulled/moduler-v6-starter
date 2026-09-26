module.exports = function () {
  const { Tester } = Std.all;

  Tester.evaluateCallback(function ({ progresser }) {
    progresser.setProgressTotal(10);
    progresser.advanceProgress(1);
    progresser.advanceProgress(1);
    progresser.advanceProgress(1);
    progresser.advanceProgress(1);
    progresser.advanceProgress(1);
    progresser.advanceProgress(1);
    progresser.advanceProgress(1);
    progresser.advanceProgress(1);
    // progresser.advanceProgress(1);
    progresser.advanceProgress(1);
    // console.log(progresser);
  });

  Tester.start(
    "Std.classes.Tester can use combos of «Tester.start» and «Tester.prototype.case»",
    async function ({ tester, asserter: { assert } }) {
      const steps = [];
      await tester.case("step 1", async function ({ tester }) {
        steps.push("1");
      });
      await tester.case("step 2", async function ({ tester }) {
        steps.push("2");
      });
      await tester.case("step 3", async function ({ tester }) {
        steps.push("3");
      });
      assert(steps.length === 3, "Tester can make tests recursively (1)");
    },
  );
};
