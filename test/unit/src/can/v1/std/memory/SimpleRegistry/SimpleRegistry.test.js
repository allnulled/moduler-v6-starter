const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/memory/SimpleRegistry/SimpleRegistry.dist.js");

module.exports = (async function () {

  devbin.assert(true, "Test is empty right now");
  const SimpleRegistry = await target;
  const reg1 = SimpleRegistry.create();
  reg1.define("one", 1);
  reg1.define("two", 2);
  devbin.assert(typeof reg1.find() === "object", "Can SimpleRegistry.prototype.find ok (1)");
  devbin.assert(typeof reg1.find().one === "number", "Can SimpleRegistry.prototype.find ok (2)");
  devbin.assert(typeof reg1.find().two === "number", "Can SimpleRegistry.prototype.find ok (3)");
  devbin.assert(typeof reg1.find(it => it === 1).one === "number", "Can SimpleRegistry.prototype.find ok (3/a)");
  devbin.assert(typeof reg1.find(it => it === 2).two === "number", "Can SimpleRegistry.prototype.find ok (3/b)");
  devbin.assert(reg1.pick("one") === 1, "Can SimpleRegistry.prototype.pick ok (4)");
  devbin.assert(reg1.pick("two") === 2, "Can SimpleRegistry.prototype.pick ok (5)");
  reg1.modify("two", it => it + 1);
  devbin.assert(reg1.pick("two") === 3, "Can SimpleRegistry.prototype.modify ok (6)");
  reg1.delete("two");
  devbin.assert(reg1.pick("two") === undefined, "Can SimpleRegistry.prototype.delete ok (7)");

})();