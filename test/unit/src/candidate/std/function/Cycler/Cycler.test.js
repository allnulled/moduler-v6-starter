const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/function/Cycler/Cycler.dist.js");

module.exports = (async function () {
    
    const Cycler = await target;

    const output = await Cycler.new.async.injection({
        messagee:"okkk"
    }).steps({
        one: (injection) => console.log(injection) || console.log("in one") || 1,
        two: async () => {
            await require("timers/promises").setTimeout(1000 * 3);
            return console.log("in two") || 2;
        },
        three: () => console.log("in three") || 3,
    }).cycle(["one", "two", "three"]).start({message:"ok"});
    
    console.log(output);

    devbin.assert(true, "");

})();