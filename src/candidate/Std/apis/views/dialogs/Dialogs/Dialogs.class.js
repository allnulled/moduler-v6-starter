class Dialogs {
  constructor() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Dialogs.constructor"});
    this.port = null;
    this.thread = Std.classes.Thread.globalInstance;
  }
  initializePort(port) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Dialogs.prototype.initializePort"});
    $moduler.assert(port instanceof Std.externals.Vue2, `Required parameter «port» to be Vue2 component but «${typeof port}» was found instead on «Dialogs.prototype.initializePort»`);
    if(!this.port) {
      this.port = port;
    }
    return this;
  }
  open(...args) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Dialogs.prototype.open"});
    $moduler.assert(this.port instanceof Std.externals.Vue2, "Required property «port» to be instance of Vue2 on «Dialogs.prototype.open»");
    return this.port.open(...args);
  }
  static globalInstance = this.$ = Std.objects.GlobalDialog = new this();
}