module.exports = async function ({ Tester }) {
  const testCallback = await $moduler.import("@/dist/www/dev/test/feature/008.Std.classes.TypesValidator soporta sintaxis de factory, default y label/test.dist.js");
  return testCallback(...arguments);
};