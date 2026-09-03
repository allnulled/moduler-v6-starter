const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/debug/Tracer/Tracer.dist.js");

module.exports = (async function () {
      
    devbin.assert(true, "Test is empty right now");

    const Tracer = await target;

    $tracer.log("Class.prototype.method", [1,2,"ok",{}]);
    $tracer.in("Class.prototype.method", [1,2,"ok",{}]);
    $tracer.out("Class.prototype.method", [1,2,"ok",{}]);
    $tracer.log("Class.prototype.method", [1,2,"ok",{}]);
    
})();