Std.classes.ViewsRegistry.$.set("DialogsTree", {
  name: "DialogsTree",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogsTree/DialogsTree.view.html"),
  props: {
    dialogsPort: {
      type: Std.externals.Vue2,
      default: () => Std.objects.GlobalDialog.port,
    }
  },
  created() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.created" });
    const component = this;
    Initialize_locals: {
      this.$locals = {
        onChange: function () {
          $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.#.$locals.onChange" });
          component.$forceUpdate(true);
        },
      };
    }
    Register_refresher: {
      this.dialogsPort.$locals.thread.onChange.addFunction(this.$locals.onChange);
    }
  },
  destroyed() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.destroyed" });
    Unregister_refresher: {
      this.dialogsPort.$locals.thread.onChange.removeFunction(this.$locals.onChange);
    }
  },
  methods: {
    
  },
  static: {
    
  }
})