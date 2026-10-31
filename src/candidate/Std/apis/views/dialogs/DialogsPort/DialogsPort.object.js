Std.classes.ViewsRegistry.$.set("DialogsPort", {
  name: "DialogsPort",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogsPort/DialogsPort.view.html"),
  props: {

  },
  data: function () {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.data" });
    return {};
  },
  created: function () {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.created" });
    Std.classes.Dialogs.globalInstance.initializePort(this);
    this.$locals = {
      self: this,
      thread: Std.objects.GlobalThread,
      opened: [],
      order: [],
      nextZIndex: 500,
    };
  },
  methods: {
    open(config) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.open" });
      Validate_dialog_properties: {
        if (config.title) $moduler.assert(typeof config.title === "string", `Required parameter «config.title» to be string on «DialogsPort.methods.open»`);
        if (config.top) $moduler.assert(Array.isArray(config.top), `Required parameter «config.top» to be array on «DialogsPort.methods.open»`);
        if (config.letf) $moduler.assert(Array.isArray(config.letf), `Required parameter «config.left» to be array on «DialogsPort.methods.open»`);
        if (config.right) $moduler.assert(Array.isArray(config.right), `Required parameter «config.right» to be array on «DialogsPort.methods.open»`);
        if (config.bottom) $moduler.assert(Array.isArray(config.bottom), `Required parameter «config.bottom» to be array on «DialogsPort.methods.open»`);
        if (config.footer) $moduler.assert(typeof config.footer === "string", `Required parameter «config.footer» to be string on «DialogsPort.methods.open»`);
        if (config.layout) $moduler.assert(typeof config.layout === "string", `Required parameter «config.layout» to be string on «DialogsPort.methods.open»`);
        if (config.size) $moduler.assert(typeof config.size === "number", `Required parameter «config.size» to be number on «DialogsPort.methods.open»`);
      }
      Validate_thread_properties: {
        $moduler.assert(typeof config.parent === "undefined", `Required parameter «config.parent» to be undefined on «DialogsPort.methods.open»`);
        $moduler.assert(typeof config.children === "undefined", `Required parameter «config.children» to be undefined on «DialogsPort.methods.open»`);
        $moduler.assert(typeof config.isClosed === "undefined", `Required parameter «config.isClosed» to be undefined on «DialogsPort.methods.open»`);
        $moduler.assert(typeof config.threadId === "undefined", `Required parameter «config.threadId» to be undefined on «DialogsPort.methods.open»`);
      }
      const newSubthread = this.$locals.thread.newSubthread.config(config);
      this.refreshView();
      return newSubthread;
    },
    synchronizeThreads(thread = this.$locals.thread, collectedBrute = null) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.synchronizeThreads" });
      const collected = collectedBrute || [];
      Collect_threads: {
        for (let index = 0; index < thread.children.length; index++) {
          const subthread = thread.children[index];
          collected.push(subthread);
          this.synchronizeThreads(subthread, collected);
        }
      }
      Synchronize_opened_threads: {
        if (collectedBrute === null) {
          this.$locals.opened = collected;
        }
      }
      this.$forceUpdate(true);
      return collected;
    },
    refreshView() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.refreshView" });
      this.synchronizeThreads();
    },
    setFocusToDialog(dialog) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.setFocusToDialog" });
      dialog.$el.style.zIndex = ++this.$locals.nextZIndex;
    }
  },
  static: {
    globalInstance: null,
  }
})