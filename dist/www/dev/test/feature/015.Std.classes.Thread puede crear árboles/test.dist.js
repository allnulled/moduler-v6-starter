
module.exports = async function ({ Tester }) {

  const { Thread } = Std.all;

  const one = Thread.create({ name: "one" });
  const one_a = one.newSubthread.config({ name: "one.a" });
  const one_b = one.newSubthread.config({ name: "one.b" });
  const one_c = one.newSubthread.config({ name: "one.c" });

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

  Can_close_too: {
    one.close();
    $moduler.assert(one.isClosed === true, "Should have closed self thread (1)");
    $moduler.assert(one_a.isClosed === true, "Should have closed children 1 thread (2)");
    $moduler.assert(one_b.isClosed === true, "Should have closed children 2 thread (3)");
    $moduler.assert(one_c.isClosed === true, "Should have closed children 3 thread (4)");
    $moduler.assert(!Std.objects.GlobalThread.children.includes(one), "Should have removed thread from global (5)");
  }

};