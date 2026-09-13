module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;

  const { renderSimpleTemplate } = Std.all;

  assert("Hello, reader!" === renderSimpleTemplate("Hello, ${user}!", { user: "reader" }), "Std.all.renderSimpleTemplate tiene conducta básica (1)");

};