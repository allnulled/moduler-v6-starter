const devbin = require(__dirname + "/../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../dist/src/candidate/Std/Std.dist.js");

module.exports = (async function () {
  devbin.assert(true, "Test is empty right now");
  const Std = await target;
  try {
    await Std.classes.Tester.evaluateDirectory({
      directory: `${__dirname}/v1`,
      files: (await require("fs").promises.readdir(`${__dirname}/v1`).then(files => files.map(file => `${__dirname}/v1/${file}/test.js`))),
      injection: { devbin },
    });
  } catch (error) {
    console.log(await Error.normalize(error).toProsecution());
  }
})();