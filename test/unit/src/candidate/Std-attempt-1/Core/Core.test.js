const devbin = require(__dirname + "/../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../dist/src/candidate/Std/Core/Core.dist.js");

module.exports = (async function () {
      
    devbin.assert(true, "Test is empty right now");

    const Core = await target;

    console.log(Core);
    
})();