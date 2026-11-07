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
        orderedThreads: this.flatenizeThreads(this.dialogsPort.$locals.thread),
        onChangeThreadTree: this.$options.static.onChangeThreadTree.bind(this),
        onChangeDialogFocus: this.$options.static.onChangeDialogFocus.bind(this),
      };
    }
    Register_refresher: {
      this.dialogsPort.$locals.thread.onChange.addFunction(this.$locals.onChangeThreadTree);
    }
    Register_focus_listener: {
      this.dialogsPort.$locals.events.onChangeDialogFocus.addFunction(this.$locals.onChangeDialogFocus);
    }
  },
  destroyed() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.destroyed" });
    Unregister_refresher: {
      this.dialogsPort.$locals.thread.onChange.removeFunction(this.$locals.onChangeThreadTree);
    }
    Unregister_focus_listener: {
      this.dialogsPort.$locals.events.onChangeDialogFocus.removeFunction(this.$locals.onChangeDialogFocus);
    }
  },
  methods: {
    flatenizeThreads(parentThread, level = 0, output = []) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.methods.flatenizeThreads" });
      for(let index=0; index<parentThread.children.length; index++) {
        const thread = parentThread.children[index];
        output.push({ thread, level });
        this.flatenizeThreads(thread, level + 1, output);
      }
      return output;
    },
    refreshThreads() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.methods.refreshThreads" });
      this.$locals.orderedThreads = this.flatenizeThreads(this.dialogsPort.$locals.thread);
    }
  },
  static: {
    onChangeThreadTree: function () {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.static.onChangeThreadTree" });
      this.refreshThreads();
      this.$forceUpdate(true);
    },
    onChangeDialogFocus: function({ port, newFocus, oldFocus }) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogsTree.static.onChangeDialogFocus" });
      const allNodes = this.$refs.currentNodes;
        for(let index=0; index<allNodes.length; index++) {
          const node = allNodes[index];
          if(node.thread === newFocus.thread) {
            node.$el.classList.add("is_focused");
          } else {
            node.$el.classList.remove("is_focused");
          }
        }
    },
  }
})