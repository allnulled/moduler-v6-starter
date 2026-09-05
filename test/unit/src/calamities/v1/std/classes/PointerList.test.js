const devbin = require(__dirname + "/../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../dist/src/candidate/std/classes/PointerList.dist.js");

module.exports = (async function () {

  devbin.assert(true, "Test is empty right now");
  console.log("OKKKK", target);

})();