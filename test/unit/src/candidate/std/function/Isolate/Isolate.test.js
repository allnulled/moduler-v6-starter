const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/function/Isolate/Isolate.dist.js");

module.exports = (async function () {

    devbin.assert(true, "Test is empty right now");

    const Isolate = await target;

    await Isolate.sync.error("This is not a joke: the function of «X» has been broken").function(() => {
        Isolate.sync.error("Yep, something failed on core!").silence.function(() => {
            throw new Error("X broke");
        }).run();
        return 800;
    }).run();

    console.log(value);

})();