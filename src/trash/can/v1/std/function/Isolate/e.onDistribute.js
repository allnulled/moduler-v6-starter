module.exports = async function(args) {
  const { devbin, file } = args;
  devbin.console.setProfile("blackBright").print("[*] DevBinaryV6 is exporting «ErrorHandler» to «Core»");
  await devbin.utils.touchFile("@/src/candidate/std/core/Core.entry.js");
  devbin.console.setProfile("blackBright").print("[*] DevBinaryV6 exported successfully «ErrorHandler» to «Core»");
};