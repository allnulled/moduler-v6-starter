Std.classes.ViewsRegistry.$.set("DialogsTreeNode", {
  name: "DialogsTreeNode",
  template: $compiler.inject.string("@/src/Std/apis/views/dialogs/DialogsTreeNode/DialogsTreeNode.view.html"),
  props: {
    thread: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    port: {
      type: Object,
      required: true,
    },
  },
  created() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.created" });
    this.$locals = {
      onChangeBoundaries: this.onChangeBoundariesHandler.bind(this),
    };
    this.port.$locals.events.onChangeDialogBoundaries.addFunction(this.$locals.onChangeBoundaries);
  },
  destroyed() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.destroyed" });
    this.port.$locals.events.onChangeDialogBoundaries.removeFunction(this.$locals.onChangeBoundaries);
  },
  methods: {
    onChangeBoundariesHandler({ dialog, operation }) {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.methods.onChangeBoundariesHandler" });
      if(this.thread !== dialog.thread) return -2;
      this.synchronizeBoundariesTo(operation);
    },
    synchronizeBoundariesTo(state) {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.methods.synchronizeBoundariesTo" });
      if(state === "maximize") {
        this.$refs.boundariesSignal.textContent = "🔷";
      } else if(state === "unmaximize") {
        this.$refs.boundariesSignal.textContent = "🔷";
      } else if(state === "unminimize") {
        this.$refs.boundariesSignal.textContent = "🔷";
      } else if(state === "minimize") {
        this.$refs.boundariesSignal.textContent = "🔹";
      } else throw new Error(`Parameter «state» must be string and «maximize|unmaximize|minimize|unminimize» but «${state}» was found instead on «DialogsTreeNode.methods.synchronizeBoundariesTo»`);
    },
    goToDialog() {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.methods.goToDialog" });
      // @RACECONDITION:
      // · DEBES ESPECIFICAR LA CLASE .unfocusable SI QUIERES QUE UN BOTÓN LLAME A ESTA FUNCIÓN Y NO TE DÉ PROBLEMAS DE RACE-CONDITION.
      // · SE CLASIFICÓ COMO LA SOLUCIÓN MÁS LIMPIA PARA EVITAR ESTE TIPO DE CONFLICTOS CON LA FUNCIÓN focusMe DEL DIÁLOGO.
      return this.port.setFocusToThread(this.thread);
    },
    closeDialog() {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.methods.closeDialog" });
      this.thread.close();
    }
  },
  static: {
    
  }
})