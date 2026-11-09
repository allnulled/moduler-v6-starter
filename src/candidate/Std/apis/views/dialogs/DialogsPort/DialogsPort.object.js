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
        events: {
          onChangeDialogBoundaries: new Std.classes.FunctionsList(),
          onChangeDialogFocus: new Std.classes.FunctionsList(),
        },
        self: this,
        thread: Std.objects.GlobalThread,
        opened: [],
        order: [],
        nextZIndex: 500,
        lastFocusedDialog: null,
      };
    }
  },
  computed: {
    currentDialogs: {
      get() {
        return this.$refs.currentDialogs;
      }
    }
  },
  methods: {
    open(config, targetThread = this.$locals.thread) {
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
        if (config.size) $moduler.assert(typeof config.size === "string", `Required parameter «config.size» to be string on «DialogsPort.methods.open»`);
      }
      Validate_thread_properties: {
        $moduler.assert(typeof config.parent === "undefined", `Required parameter «config.parent» to be undefined on «DialogsPort.methods.open»`);
        $moduler.assert(typeof config.children === "undefined", `Required parameter «config.children» to be undefined on «DialogsPort.methods.open»`);
        $moduler.assert(typeof config.isClosed === "undefined", `Required parameter «config.isClosed» to be undefined on «DialogsPort.methods.open»`);
        $moduler.assert(typeof config.threadId === "undefined", `Required parameter «config.threadId» to be undefined on «DialogsPort.methods.open»`);
      }
      const newSubthread = targetThread.newSubthread.config(config);
      let newSubdialog = undefined;
      const openPromise = new Promise((resolve, reject) => {
        this.$nextTick(() => {
          newSubdialog = this.setFocusToThread(newSubthread);
          // if(!newSubdialog) {return resolve(null);}
          const dialogMetadata = {
            dialog: newSubdialog,
            thread: newSubthread,
            promise: newSubdialog.$locals.resolvable.promise,
            accept: (...args) => newSubdialog.accept(...args),
            close: (...args) => newSubdialog.close(...args),
            config: config,
          };
          this.synchronizeDialogBoundaries(dialogMetadata);
          return resolve(dialogMetadata);
        });
      });
      this.refreshView();
      return openPromise;
    },
    clamp(value, min, max) {
      return Math.max(min, Math.min(value, max));
    },
    calculateDialogBoundaries(size) {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      const margin = 24;
      const definitions = {
        "small": {
          width: 0.35,
          minWidth: 320,
          maxWidth: 440,
          height: null,
          maxHeight: 0.75,
          minHeight: 0.2,
        },
        "medium-small": {
          width: 0.475,
          minWidth: 400,
          maxWidth: 630,
          height: 0.39,
          minHeight: 0.35,
        },
        "medium": {
          width: 0.60,
          minWidth: 480,
          maxWidth: 820,
          height: 0.78,
          minHeight: 0.5,
        },
        "medium-big": {
          width: 0.74,
          minWidth: 560,
          maxWidth: 1130,
          height: 0.84,
          minHeight: 0.6
        },
        "big": {
          width: 0.88,
          minWidth: 640,
          maxWidth: 1440,
          height: 0.90,
          minHeight: 0.7,
        },
      };
      definitions.maximized = definitions.medium;
      const definition = definitions[size];
      $moduler.assert(definition, `Parameter «size» must be one out of «small|medium-small|medium|medium-big|big|maximized» but «${size}» was found instead on «calculateDialogBoundaries»`);
      const availableWidth = viewport.width - margin * 2;
      const availableHeight = viewport.height - margin * 2;
      let w = this.clamp(viewport.width * definition.width, Math.min(definition.minWidth, availableWidth), Math.min(definition.maxWidth, availableWidth));
      let h = definition.height !== null ? Math.min(viewport.height * definition.height, availableHeight) : viewport.height * definition.minHeight;
      let x = (viewport.width - w) / 2;
      let y = (viewport.height - (h || (viewport.height / 2))) / 2;
      const output = { x, y, width: w, height: h, };
      return output;
    },
    synchronizeDialogBoundaries(dialogMetadata) {
      // @DOING!!!
      const dialogSize = dialogMetadata.config.size || "medium";
      const dialogVisibility = dialogMetadata.config.visibility || dialogMetadata.config.size === "maximized" ? "maximized" : dialogMetadata.config.size === "minimized" ? "minimized" : "default";
      const dialogComponent = dialogMetadata.dialog;
      const dialogElement = dialogMetadata.dialog.$el;
      const dialogCoordinates = Object.assign({}, dialogMetadata.config.coordinates || {}, this.calculateDialogBoundaries(dialogSize));
      Set_coordinates: {
        if (dialogCoordinates.x) dialogElement.style.left = `${dialogCoordinates.x}px`;
        if (dialogCoordinates.y) dialogElement.style.top = `${dialogCoordinates.y}px`;
        if (dialogCoordinates.width) dialogElement.style.width = `${dialogCoordinates.width}px`;
        if (dialogCoordinates.height) dialogElement.style.height = `${dialogCoordinates.height}px`;
        /*
        if (dialogCoordinates.maxHeight) dialogElement.style.maxHeight = `${dialogCoordinates.maxHeight}px`;
        if (dialogCoordinates.minHeight) dialogElement.style.minHeight = `${dialogCoordinates.minHeight}px`;
        if (dialogCoordinates.maxWidth) dialogElement.style.maxWidth = `${dialogCoordinates.maxWidth}px`;
        if (dialogCoordinates.minWidth) dialogElement.style.minWidth = `${dialogCoordinates.minWidth}px`;
        //*/
      }
      Set_maximization_or_minization: {
        if (dialogVisibility === "maximized") {
          dialogElement.classList.add("is_maximized");
          dialogComponent.toggleMaximize(true);
        } else if (dialogVisibility === "minimized") {
          dialogElement.classList.add("is_minimized");
          dialogComponent.minimize(true);
        } else if (dialogVisibility === "default") {
          // @OK.
        } else throw new Error(`Parameter «config.visibility» must be string with «default|maximized|minimized» but «${config.size}» was found instead on «DialogsPort.prototype.synchronizeDialogBoundaries»`);
      }
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
      return collected;
    },
    refreshView() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.refreshView" });
      this.synchronizeThreads();
      this.$forceUpdate(true);
    },
    setFocusToDialog(dialog) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.setFocusToDialog" });
      dialog.$el.style.zIndex = this.$locals.nextZIndex++;
      if (this.$locals.lastFocusedDialog) {
        this.$locals.lastFocusedDialog.$el.classList.remove("is_focused");
      }
      dialog.$el.classList.add("is_focused");
      Unminimize_too: {
        dialog.unminimize();
      }
      this.$locals.lastFocusedDialog = dialog;
      this.$locals.events.onChangeDialogFocus.evaluateFunctionsSync([{
        port: this,
        newFocus: dialog,
        oldFocus: this.$locals.lastFocusedDialog,
      }]);
      return dialog;
    },
    forEachDialog(callback, parameters = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.forEachDialog" });
      for (let index = 0; index < this.$refs.currentDialogs.length; index++) {
        const dialog = this.$refs.currentDialogs[index];
        callback(dialog, parameters);
      }
      return parameters;
    },
    findDialogsWhere(filter) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.findDialogsWhere" });
      return this.forEachDialog((it, output) => {
        if (filter(it)) {
          output.push(it);
        }
      }, []);
    },
    getDialogFromThread(thread) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.getDialogFromThread" });
      return this.findDialogsWhere(it => it.thread === thread)[0];
    },
    setFocusToThread(thread) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.setFocusToThread" });
      if (!this.$refs.currentDialogs) return -2;
      const matches = this.$refs.currentDialogs.filter(dialog => dialog.thread === thread);
      if (!matches.length) return -2;
      return this.setFocusToDialog(matches[0]);
    },
    isLastFocusedDialog(dialog) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.isLastFocusedDialog" });
      return this.$locals.lastFocusedDialog === dialog;
    },
    isLastFocusedThread(thread) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsPort.methods.isLastFocusedThread" });
      return this.$locals.lastFocusedDialog.thread === thread;
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