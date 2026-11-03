Std.classes.ViewsRegistry.$.set("DialogsPort", {
  name: "DialogsPort",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogsPort/DialogsPort.view.html"),
  props: {},
  data: function () {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.data" });
    return {};
  },
  created: function () {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.created" });
    Initialize_in_globals: {
      Std.classes.Dialogs.globalInstance.initializePort(this);
      this.$locals = {
        self: this,
        thread: Std.objects.GlobalThread,
        opened: [],
        order: [],
        nextZIndex: 500,
      };
    }
  },
  methods: {
    open(config) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.open" });
      Shortcut_by_unique_action: {
        if (!config.uniqueActionId) break Shortcut_by_unique_action;
        $moduler.assert(typeof config.uniqueActionId === "string", `Required parameter «config.uniqueActionId» to be string on «DialogsPort.methods.open»`);
        const matched = this.$locals.opened.filter(thread => thread.uniqueActionId === config.uniqueActionId);
        if (!matched.length) break Shortcut_by_unique_action;
        return this.setFocusToThread(matched[0]);
      }
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
      let newSubdialog = undefined;
      const openPromise = new Promise((resolve, reject) => {
        this.$nextTick(() => {
          newSubdialog = this.setFocusToThread(newSubthread);
          return resolve({
            dialog: newSubdialog,
            thread: newSubthread,
            promise: newSubdialog.$locals.resolvable.promise,
            accept: (...args) => newSubdialog.accept(...args),
            close: (...args) => newSubdialog.close(...args),
            config: config,
          });
        });
      });
      this.refreshView();
      return openPromise;
    },
    async answer(config) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.answer" });
      const { promise } = await this.open(config);
      return await promise;
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
      dialog.$el.style.zIndex = this.$locals.nextZIndex++;
      return dialog;
    },
    setFocusToThread(thread) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.setFocusToThread" });
      if (!this.$refs.currentDialogs) return -2;
      const matches = this.$refs.currentDialogs.filter(dialog => dialog.thread === thread);
      if (!matches.length) return -2;
      return this.setFocusToDialog(matches[0]);
    },
    openTreeView() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.openTreeView" });
      return this.open({
        title: "Árbol de diálogos",
        template: "<DialogsTree />",
        uniqueActionId: "Dialogs tree view",
      });
    }
  },
  static: {
    findDialogPortFrom(element) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.static.findDialogPortFrom" });
      return Std.classes.Domer.findFirstParentWhere(it => it.matches(".DialogsPort.View"), element).__vue__;
    },
  }
})