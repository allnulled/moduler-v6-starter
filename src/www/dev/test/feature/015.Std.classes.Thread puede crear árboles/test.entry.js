
module.exports = async function ({ Tester }) {

  const { Thread } = Std.all;

  const one = Thread.create({ name: "one" });
  const one_a = one.newThread.config({ name: "one.a" });
  const one_b = one.newThread.config({ name: "one.b" });
  const one_c = one.newThread.config({ name: "one.c" });

  $moduler.assert(one_a.parent === one, "Can find parent thread (1)");
  $moduler.assert(one_b.parent === one, "Can find parent thread (2)");
  $moduler.assert(one_c.parent === one, "Can find parent thread (3)");

  $moduler.assert(one.children[0] === one_a, "Can find child thread (4)");
  $moduler.assert(one.children[1] === one_b, "Can find child thread (5)");
  $moduler.assert(one.children[2] === one_c, "Can find child thread (6)");
  
  $moduler.assert(Std.objects.GlobalThread.children.includes(one), "Can find orphan threads from Std.objects.GlobalThread (10)");
  $moduler.assert(!Std.objects.GlobalThread.children.includes(one_a), "Can not find non-orphan threads from Std.objects.GlobalThread (20)");
  $moduler.assert(!Std.objects.GlobalThread.children.includes(one_b), "Can not find non-orphan threads from Std.objects.GlobalThread (21)");
  $moduler.assert(!Std.objects.GlobalThread.children.includes(one_c), "Can not find non-orphan threads from Std.objects.GlobalThread (22)");
  $moduler.assert(one.children.includes(one_a), "Can find non-orphan threads from their parent (30)");
  $moduler.assert(one.children.includes(one_b), "Can find non-orphan threads from their parent (31)");
  $moduler.assert(one.children.includes(one_c), "Can find non-orphan threads from their parent (32)");

};