class Dialogs {
  constructor() {
    this.port = null;
    this.thread = Std.classes.Thread.globalInstance;
  }
  setPort(port) {
    $moduler.assert(port instanceof Std.externals.Vue2, `Required parameter «port» to be Vue2 component but «${typeof port}» was found instead on «Dialogs.prototype.setPort»`);
    this.port = port;
  }
  static globalInstance = Std.objects.GlobalDialog = new this();
}