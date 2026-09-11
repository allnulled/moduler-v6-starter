module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;

  const { Checker } = Std.all;

  assert(Checker.check({}).is.object(), "Std.all.Checker puede hacer is.object (1)");
  assert(Checker.check(true).is.boolean(), "Std.all.Checker puede hacer is.boolean (2)");
  assert(!Checker.check(true).is.not.boolean(), "Std.all.Checker puede hacer is.not.boolean (3)");
  
  assert(Checker.check(500).is.number(), "Std.all.Checker puede hacer is.number (2)");
  assert(Checker.check("500").is.string(), "Std.all.Checker puede hacer is.string (3)");
  assert(Checker.check([]).is.array(), "Std.all.Checker puede hacer is.array (4)");
  assert(Checker.check({}).is.object(), "Std.all.Checker puede hacer is.object (5)");
  assert(Checker.check(Checker.check).is.function(), "Std.all.Checker puede hacer is.function (6)");
  
  assert(!Checker.check(500).is.not.number(), "Std.all.Checker puede hacer is.not.number (12)");
  assert(!Checker.check("500").is.not.string(), "Std.all.Checker puede hacer is.not.string (13)");
  assert(!Checker.check([]).is.not.array(), "Std.all.Checker puede hacer is.not.array (14)");
  assert(!Checker.check({}).is.not.object(), "Std.all.Checker puede hacer is.not.object (15)");
  assert(!Checker.check(Checker.check).is.not.function(), "Std.all.Checker puede hacer is.not.function (16)");
  
  assert(Checker.check({name:"x"}).its("name").is.string(), "Std.all.Checker puede hacer its(prop).is.string (21)");
  assert(Checker.check({meta:{city:"x"}}).its(["meta","city"]).is.equalTo("x"), "Std.all.Checker puede hacer its(prop).is.equalTo (22)");
  
  assert(Checker.check(100).is.equalTo(100), "Std.all.Checker puede hacer is.object (31)");
  assert(Checker.check(100).is.moreThan(99), "Std.all.Checker puede hacer is.object (32)");
  assert(Checker.check(100).is.lessThan(101), "Std.all.Checker puede hacer is.object (33)");
  assert(Checker.check(100).is.moreOrEqualTo(99), "Std.all.Checker puede hacer is.object (34)");
  assert(Checker.check(100).is.lessOrEqualTo(101), "Std.all.Checker puede hacer is.object (35)");

  assert(typeof Checker.check(40).is.number === "function", "Std.all.Checker puede hacer is.object (36)");
  assert(Checker.check(300).is.lessThan(400).and.it.is.moreThan(200), "Std.all.Checker puede hacer is.lessThan (37)");

  const pasos = [];
  const check = Checker.createCheck({
    onCheckBefore(...args) {pasos.push("onCheckBefore", args)},
    onCheckTrue(...args) {pasos.push("onCheckTrue", args)},
    onCheckFalse(...args) {pasos.push("onCheckFalse", args); return false;},
    onCheckAfter(...args) {pasos.push("onCheckAfter", args)},
  });

  check(200).is.number();
  
  assert(pasos.includes("onCheckBefore"), "Std.all.Checker puede usar this.onCheckBefore");
  assert(pasos.includes("onCheckTrue"), "Std.all.Checker puede usar this.onCheckTrue");
  assert(!pasos.includes("onCheckFalse"), "Std.all.Checker puede usar this.onCheckFalse");
  assert(pasos.includes("onCheckAfter"), "Std.all.Checker puede usar this.onCheckAfter");
  
  check(200).is.not.number();
  
  assert(pasos.includes("onCheckFalse"), "Std.all.Checker puede usar this.onCheckFalse");

  assert(check(function() {throw new Error("This is ok 1")}).does.throw(), "Std.all.Checker puede usar does.throw (50)");
  assert(check(function() {}).does.not.throw(), "Std.all.Checker puede usar does.not.throw (51)");
  assert(check(function() {return true}).does.confirm(), "Std.all.Checker puede usar does.confirm (52)");
  assert(check(function() {return false}).does.not.confirm(), "Std.all.Checker puede usar does.not.confirm (53)");
  assert(check(function() {return 500}).does.return(500), "Std.all.Checker puede usar does.return (54)");
  assert(check(function() {return 501}).does.not.return(500), "Std.all.Checker puede usar does.not.return (55)");

};