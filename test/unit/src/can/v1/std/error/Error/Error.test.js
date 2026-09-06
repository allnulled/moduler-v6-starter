const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/error/Error/Error.dist.js");

module.exports = (async function () {
      
    devbin.assert(true, "Test is empty right now");

    const Error = await target;

    console.log(Error);
    
})();