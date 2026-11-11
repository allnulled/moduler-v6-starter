module.exports = async function({ devbin }) {
  await devbin.utils.touchFile("@/dev/settings.js");
  await devbin.utils.touchFile("@/test/unit/src/Std/Std.test.js");
  return;
}