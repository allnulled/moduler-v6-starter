module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;

  const { Asserter } = Std.all;

  return;

  Asserter.assert(true);
  Asserter.assert(true, "The error message nº1");
  const assert2 = Asserter.createAssert();
  assert2(true, "The error message nº2");
  const parameters = {
    name: "string",
  }
  assert2.throwing("Parameter «name» must be string").that(parameters).is.object().and.its("name").is.string();
  assert2.safe(() => "This cannot fail");
  assert2.fails(() => { throw "This must fail" });

  /*

  assert(true);
  assert.throwing(mensaje).that(elemento).equals(100);

  //*/

};