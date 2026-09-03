const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/error/ErrorHandler/ErrorHandler.dist.js");

module.exports = (async function () {

    devbin.assert(true, "Test is empty right now");

    const ErrorHandler = await target;
    try {
        try {
            try {
                throw new Error("Original");
            } catch (error) {
                ErrorHandler.pick(error).add("This is the action nº1.a.c").rethrow();
            }
        } catch (error) {
            ErrorHandler.pick(error).add("This is the action nº1.a").rethrow();
        }
    } catch (error) {
        console.log(error);
    }


    


})();