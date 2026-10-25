Std.classes.ViewsRegistry.$.set("DynamicView", {
  name: "DynamicView",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/DynamicView/DynamicView.view.html"),
  props: {
    from: {
      type: Object,
      default: () => ({}),
    }
  },
  data: function() {
    return {
      currentView: this.from,
    };
  },
  methods: {
    unregisterPrevious() {
      if(!this.currentView.registeredName) {
        return -2;
      }
      Std.classes.ViewsRegistry.globalInstance.delete(this.currentView.registeredName);
    },
    setView(view) {
      $moduler.assert(typeof view === "object", `Required parameter «view» to be object but «${typeof view}» was found instead on «Std.objects.DynamicView.methods.setView»`);
      $moduler.assert(typeof view.template === "string", `Required property «view.template» to be string but «${typeof view}» was found instead on «Std.objects.DynamicView.methods.setView»`);
      this.unregisterPrevious();
      Chatgpt: {
        // @TODO:
      }
    },
    setHtml(html) {
      return this.setView({ template: html });
    },
  }
})