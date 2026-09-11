module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;

  const { StringUtil } = Std.all;
  
  const o1 = StringUtil.getRandomString(10);
  const o2 = StringUtil.getRandomString(4, ["0"]);

  assert(o1.length === 10, "Std.objects.StringUtil puede hacer getRandomString (1)");
  assert(o2.length === 4, "Std.objects.StringUtil puede hacer getRandomString (2)");
  assert(o2[0] === "0", "Std.objects.StringUtil puede hacer getRandomString (3)");
  assert(o2[1] === "0", "Std.objects.StringUtil puede hacer getRandomString (4)");
  assert(o2[2] === "0", "Std.objects.StringUtil puede hacer getRandomString (5)");
  assert(o2[3] === "0", "Std.objects.StringUtil puede hacer getRandomString (6)");

};