class Launcher {
  static {
    $moduler.toolkit.makeClass([
      { static: { launchables: {} } },
      Std.functions.IntrospectableInterfaceFactory(
        "launchables",
        "get",
        "set",
        "has",
        "delete",
        "initialize",
        "list",
        "onRegister",
        "onUnregister",
        "|",
        "static"
      ),
    ], this);
  }
  static register(id, input) {
    $moduler.assert(!(id in this.launchables), `Launchable «${id}» cannot be registered because it is already registered on «Std.classes.Launcher.register»`);
    if(typeof input === "function") {
      this.set(id, {
        callback: input,
      });
    } else if(typeof input === "object") {
      $moduler.assert(typeof input.callback === "function", `Required property «callback» to be function on «Std.classes.Launcher.register»`);
      this.set(id, input);
    } else throw Error.normalize(`Parameter «input» must be function or object on «Std.classes.Launcher.register»`);
  }
  static unregister(id) {
    $moduler.assert(id in this.launchables, `Launchable «${id}» cannot be unregistered because it is not registered on «Std.classes.Launcher.unregister»`);
    this.delete(id);
  }
  static launch(id, immediateParams = {}) {
    $moduler.assert(id in this.launchables, `Launchable «${id}» cannot be launched because it is not registered on «Std.classes.Launcher.launch»`);
    const launchable = this.launchables[id];
    return launchable.callback(immediateParams, launchable);
  } 
  static {
    Launcher.register("Threads viewer", function(options) {
      return Std.classes.Dialogs.open({
        title: "Visor de hilos",
        template: "<DialogsTree />",
        uniqueActionId: "Threads viewer",
        ...options,
      });
    });
  }
}