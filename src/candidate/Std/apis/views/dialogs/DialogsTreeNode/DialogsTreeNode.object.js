Std.classes.ViewsRegistry.$.set("DialogsTreeNode", {
  name: "DialogsTreeNode",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogsTreeNode/DialogsTreeNode.view.html"),
  props: {
    thread: {
      type: Object,
      required: true,
    }
  },
  methods: {
    
  },
  static: {
    
  }
})