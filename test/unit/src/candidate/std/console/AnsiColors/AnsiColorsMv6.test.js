const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/console/AnsiColors/AnsiColorsMv6.dist.js");

module.exports = (async function () {
      
    devbin.assert(true, "Test is empty right now");

    console.log(target);

    target.style("blackBright").print("ooookay...");
    
})();