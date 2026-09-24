module.exports = function ({ Tester }) {
  Tester.start(
    "Ejemplo de test con casos de uso",
    async function ({ tester, asserter: { assert } }) {
      await tester.case("Caso 1", function () {
        assert(true, "Ok caso 1");
      });
    },
  );
  // throw Error.normalize("Error en test 001").adding({name: "Suberror", message: "Collateral effects of this error" });
};
