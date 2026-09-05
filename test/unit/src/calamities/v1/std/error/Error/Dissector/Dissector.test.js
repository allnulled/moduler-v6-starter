const devbin = require(__dirname + "/../../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../../dist/src/candidate/std/error/Error/Dissector/Dissector.dist.js");

module.exports = (async function () {

    const ErrorDissector = await target;

    Simple_test: {
        let out = undefined;
        try {
            throw new Error("OK erro arised!");
        } catch (error) {
            out = ErrorDissector.dissect(error);
        }
        console.log(out);
        console.log(out);
        console.log(out.std);
        console.log(out.std.dissection);

        devbin.assert(out instanceof Error, "Std.Error.Dissector returns error");
        devbin.assert(typeof out.std.dissection === "object", "Error.Dissector could attach data to error");
        devbin.assert(out.std.dissection.length > 1, "Error.Dissector could attach data to error");
        
    }

})();