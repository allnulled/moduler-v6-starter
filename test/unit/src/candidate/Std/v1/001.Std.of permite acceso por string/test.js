module.exports = async function ({ devbin, Std }) {

  return;
  await Isolator.create({
    title: "Paso 1.5: Alguna cosa concreta",
    onStart: () => console.log("Started"),
    onSuccess: () => console.log("Completed"),
    onCatch: Error.create("Ha fallado el paso 1.5").handler(console.log),
    onFinally: () => console.log("Finished"),
    main: async function () {
      Error.create("Origin").thrown;
    }
  }).run("main");
};