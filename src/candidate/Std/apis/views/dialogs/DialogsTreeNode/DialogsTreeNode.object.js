Std.classes.ViewsRegistry.$.set("DialogsTreeNode", {
  name: "DialogsTreeNode",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogsTreeNode/DialogsTreeNode.view.html"),
  props: {
    thread: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    }
  },
  methods: {
    goToDialog() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.goToDialog" });
      // @RACECONDITION:
      // · DEBES ESPECIFICAR LA CLASE .unfocusable SI QUIERES QUE UN BOTÓN LLAME A ESTA FUNCIÓN Y NO TE DÉ PROBLEMAS DE RACE-CONDITION.
      // · SE CLASIFICÓ COMO LA SOLUCIÓN MÁS LIMPIA PARA EVITAR ESTE TIPO DE CONFLICTOS CON LA FUNCIÓN focusMe DEL DIÁLOGO.
      return Std.classes.Dialogs.$.port.setFocusToThread(this.thread);
    },
    closeDialog() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.closeDialog" });
      this.thread.close();
    }
  },
  static: {
    
  }
})