class AnsiProfiles {
  static {
    $moduler.toolkit.makeClass([
      { static: { all: {} } },
      Std.functions.IntrospectableInterfaceFactory(
        "all",
        "get",
        "set",
        "has",
        "delete",
        "initialize",
        "list",
        "onRegister",
        "onUnregister",
        "/",
        "static",
      ),
    ], this);
  }
  static as(id) {
    if(Array.isArray(id)) return this.asList(id);
    $moduler.assert(id in AnsiProfiles.all, `Profile for ansi colors with name «${id}» is not registered on «AnsiProfiles.as»`);
    return Std.objects.Ansi.style(AnsiProfiles.all[id]);
  }
  static asList(list) {
    const out = [];
    for(let index=0; index<list.length; index++) {
      const item = list[index];
      out.push(this.as(item));
    }
    return out;
  }
  static {
    this.set("error", "red");
    this.set("error:1", "red,underline");
    this.set("error:2", "red,underline,bgYellow");
    this.set("success", "green");
    this.set("success:1", "green,underline");
    this.set("success:2", "green,underline,bgWhite");
    this.set("info", "cyan");
    this.set("info:1", "cyan,underline");
    this.set("info:2", "cyan,underline,bgYellow");
    this.set("silent", "blackBright");
    this.set("silent:1", "blackBright,underline");
  }
}