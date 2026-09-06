const devbin = require(__dirname + "/../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../dist/src/candidate/std/core/Core.dist.js");

module.exports = (async function () {
      
    devbin.assert(true, "Test is empty right now");

    const Core = await target;

    //console.log(Core);

    const { ErrorFactory, ErrorHandler, Isolate, AnsiColors, Timeout, Tracer } = Core;

    $tracer.log("Helo from traer", [Core,ErrorFactory]);

    await Timeout.of(2000);

    Isolate.sync.catch(ErrorHandler.lazy.add("Some function failed").handler).run(function() {
        //throw new Error("First");
    });


    AnsiColors.style("cyan").print("Hello?");
    AnsiColors.style("magenta").print("Hello?");
    AnsiColors.style("red").print("Hello?");
    AnsiColors.style("blue").print("Hello?");
    AnsiColors.style("yellow").print("Hello?");



    
})();