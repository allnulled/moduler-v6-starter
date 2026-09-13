module.exports = async function Std_test_004({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;
  const { Isolation } = Std.all;
  Test_1: {
    const iso = Isolation.new.config({
      title: "InitialDemo",
      status: 0,
      steps: [],
      onRunStart: function() {
        this.steps.push("onRunStart");
      },
      onRunEnd: function() {
        this.steps.push("onRunEnd");
      },
      onRunSuccess: function() {
        this.steps.push("onRunSuccess");
      },
      onRunCatch: Isolation.catcher("Isolation ${title} has failed in the test"),
      main: function () {
        return this.status = 200;
      },
      startedAt: Date.now(),
    });

    const result1 = iso.runSync("main");

    assert(iso.steps.length === 3, "Std.all.Isolation.{new,config,run} respeta ciclo de runSync (1)");
    assert(iso.steps[0] === "onRunStart", "Std.all.Isolation.{new,config,run} respeta ciclo de runSync (1)");
    assert(iso.steps[1] === "onRunSuccess", "Std.all.Isolation.{new,config,run} respeta ciclo de runSync (2)");
    assert(iso.steps[2] === "onRunEnd", "Std.all.Isolation.{new,config,run} respeta ciclo de runSync (3)");
    assert(result1 === 200, "Std.all.Isolation.{new,config,run} respeta el return del runSync (4)");

    const iso2 = iso.clone();

    Basic_usage: {
      assert(iso2.status === 200, "Std.all.Isolation.{new,config,clone,run} tienen conducta básica (5)");
    }
    Error_handling: {
      await assertThrows(function Isolation_test_callback_01() {
        const son1 = iso.config({
          title: "SynchronousDemo",
          faulty: function () {
            throw new Error("Original error");
          }
        });
        return son1.runSync("faulty");
      }, "Std.all.Isolation.{new,config,clone,run} tienen gestión de errores en funciones síncronas (6)", error => {
        return error.std?.history[0]?.message === "Isolation SynchronousDemo has failed in the test";
      });
      await assertThrows(function Isolation_test_callback_02() {
        return iso.config({
          title: "AsynchronousDemo",
          faultyAsync: async function () {
            throw new Error("Original error 2");
          },
        }).runAsync("faultyAsync");
      }, "Std.all.Isolation.{new,config,clone,run} tienen gestión de errores en funciones asíncronas (7)", error => {
        return error.std?.history[0]?.message === "Isolation AsynchronousDemo has failed in the test";
      });
    }
  }

};