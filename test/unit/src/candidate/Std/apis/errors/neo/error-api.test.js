const devbin = require(__dirname + "/../../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../../dist/src/candidate/Std/apis/errors/neo/error-api.dist.js");

module.exports = (async function () {
      
    devbin.assert(true, "Test is empty right now");
    Error.throw({ name: "SomeError", message: "whatever" });
    
})();