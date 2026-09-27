const devbin = require(__dirname + "/../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../dist/src/candidate/Std/Std.dist.js");

module.exports = (async function Std_test () {
  devbin.assert(true, "Test is empty right now");
  const Std = await target;
  try {
    const allTestDirs = await require("fs").promises.readdir(`${__dirname}/v1`);
    const allTestPaths = allTestDirs.map(dir => `${__dirname}/v1/${dir}/test.js`);
    await Std.classes.Tester.evaluateDirectory({
      directory: `${__dirname}/v1`,
      files: allTestPaths,
      injection: { devbin },
    });
  } catch (error) {
    console.log(await Error.normalize(error).adding({ name:"TestError", message: "Failed Std.test.js" }).toProsecution());
  }
})();