class Dialogs {
  static factory = Std.classes.DialogsFactory;
  static port = null;
  static thread = Std.classes.Thread.globalInstance;
  static initializePort(port) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.Dialogs.initializePort"});
    $moduler.assert(port instanceof Std.externals.Vue2, `Required parameter «port» to be Vue2 component but «${typeof port}» was found instead on «Dialogs.initializePort»`);
    if(!this.port) {
      this.port = port;
    }
    return this;
  }
  static open(...args) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.Dialogs.open"});
    $moduler.assert(this.port instanceof Std.externals.Vue2, "Required property «port» to be instance of Vue2 on «Dialogs.open»");
    return this.port.open(...args);
  }
  static answer(...args) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.Dialogs.answer"});
    $moduler.assert(this.port instanceof Std.externals.Vue2, "Required property «port» to be instance of Vue2 on «Dialogs.answer»");
    return this.port.answer(...args);
  }
  static find(filter) {
    return this.port.findDialogsWhere(filter);
  }
  static findByTitle(title) {
    return this.port.findDialogsWhere(it => it.thread.title === title);
  }
  static get focused() {
    return this.port.findDialogsWhere(it => it === this.port.$locals.lastFocusedDialog)[0];
  }
  static type(...args) {
    return this.factory.type(...args);
  }
}