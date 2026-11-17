module.exports = async function({ devbin }) {
  await devbin.utils.touchFile("@/src/Std/Std.entry.js");
};