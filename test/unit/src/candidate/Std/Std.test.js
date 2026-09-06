const devbin = require(__dirname + "/../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../dist/src/candidate/Std/Std.dist.js");

module.exports = (async function () {
    
    const { assert } = devbin;

    assert(true, "Test is empty right now");
    
    const Std = await target;

    assert(Std?.Core?.version === "1.0", "Can find Core version");

    console.log($moduler.section.get("Std"));
    
})();