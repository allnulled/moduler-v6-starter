module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;

  const { Process, Isolation } = Std.all;
  
  const mainProcess = Process.new.config({
    title: "test 1",
    main: function() {
      this.output = "Main!";
    }
  });

  return;

  const o1 = await mainProcess.runSync("main");

  assert(o1.output === "Main!", "Process puede hacer run como Isolation (1)");
  assert(o1 instanceof Process, "Process tiene la interfaz Process (2)");
  assert(o1 instanceof Isolation, "Process tiene la interfaz Isolation (3)");
  assert(mainProcess.pid === mainProcess.newSubprocess.ppid, "Process puede hacer newSubprocess (4)");

};