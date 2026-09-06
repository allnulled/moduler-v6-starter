const devbin = require(__dirname + "/../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../dist/src/candidate/Std/Std.dist.js");

module.exports = (async function () {
      
    devbin.assert(true, "Test is empty right now");
    throw {};
    
})();