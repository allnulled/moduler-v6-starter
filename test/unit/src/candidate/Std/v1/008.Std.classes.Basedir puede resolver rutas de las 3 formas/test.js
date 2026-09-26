module.exports = async function ({ Tester }) {
  const testCallback = await $moduler.import("@/dist/www/dev/test/feature/006.Std.classes.Basedir puede resolver rutas de las 3 formas/test.dist.js");
  return testCallback(...arguments);
};