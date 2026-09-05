const devbin = require(__dirname + "/../../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../../dist/src/candidate/std/error/Error/Prosecutor/Prosecutor.dist.js");
const target2 = require(__dirname + "/../../../../../../../../dist/src/candidate/std/error/Error/Handler/Handler.dist.js");

module.exports = (async function () {
      
    const ErrorProsecutor = await target;
    const ErrorHandler = await target2;

    try {
        try {
            try {
                throw new Error("OK, failed process 1.1.1");
            } catch (error) {
                ErrorHandler.pick(error).add("OK, failed process 1.1").rethrow();
            }
        } catch (error) {
            ErrorHandler.pick(error).add("OK, failed process 1").rethrow();
        }
    } catch (error) {
        console.log(error);
        console.log(error.std);
        console.log(error.history);
        ErrorProsecutor.prosecute(error);
    }
    
})();