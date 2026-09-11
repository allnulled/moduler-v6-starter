const devbin = require(__dirname + "/../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../dist/src/candidate/Std/Std.dist.js");

module.exports = (async function () {

    devbin.assert(true, "Test is empty right now");

    const Std = await target;

    await Std.classes.Tester.evaluateDirectory({
        directory: `${__dirname}/v1`,
        title: "Std Official Tests",
        filename: "test.js",
        injection: { devbin, Std, },
    });

})();