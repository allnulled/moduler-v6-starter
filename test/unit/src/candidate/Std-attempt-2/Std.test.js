const devbin = require(__dirname + "/../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../dist/src/candidate/Std/Std.dist.js");

module.exports = (async function () {

    devbin.assert(true, "Test is empty right now");

    const Std = await target;

    const filerange = (start, end) => {
        const output = [];
        for(let index=start; index<=end; index++) {
          output.push(`^${(""+(index)).padStart(3, "0")}.`);
        }
        return output;
    };

    await Std.classes.Tester.evaluateDirectory({
        directory: `${__dirname}/v1`,
        title: "Std Official Tests",
        filename: "test.js",
        ignored: [
            //...filerange(1,14)
        ],
        injection: { devbin, Std, },
    });

})();