module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;

  const { Tracer } = Std.all;


  Ejemplo_de_hooks: {

    const pasos = [];

    const tracer = Tracer.new.config({
      id: "Test of tracer",
      onStartTrace: () => pasos.push("onStartTrace"),
      onTraceLog: () => pasos.push("onTraceLog"),
      onTraceIn: () => pasos.push("onTraceIn"),
      onTraceOut: () => pasos.push("onTraceOut"),
      onEndTrace: () => pasos.push("onEndTrace"),
    });

    tracer.log("Log simple");
    tracer.in("Log in");
    tracer.out("Log out");

    const subtracer = tracer.createSubtracer();

    subtracer.log("Log simple");

  }

};