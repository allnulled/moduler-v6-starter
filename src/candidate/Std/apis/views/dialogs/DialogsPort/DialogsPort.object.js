Std.classes.ViewsRegistry.$.set("DialogsPort", {
  name: "DialogsPort",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogsPort/DialogsPort.view.html"),
  props: {
    
  },
  data: function() {
    return {};
  },
  created: function() {
    this.$locals = {
      thread: Std.objects.DialogsThread,
    };
  },
  methods: {
    open(config) {
      Validate_dialog_config_to_be_self_compliant: {
        if(config.top) $moduler.assert(Array.isArray(config.top), `Required parameter «config.top» to be array on «DialogsPort.methods.open»`);
        if(config.letf) $moduler.assert(Array.isArray(config.letf), `Required parameter «config.left» to be array on «DialogsPort.methods.open»`);
        if(config.right) $moduler.assert(Array.isArray(config.right), `Required parameter «config.right» to be array on «DialogsPort.methods.open»`);
        if(config.bottom) $moduler.assert(Array.isArray(config.bottom), `Required parameter «config.bottom» to be array on «DialogsPort.methods.open»`);
        if(config.layout) $moduler.assert(typeof config.layout === "string", `Required parameter «config.layout» to be string on «DialogsPort.methods.open»`);
        if(config.title) $moduler.assert(typeof config.title === "string", `Required parameter «config.title» to be string on «DialogsPort.methods.open»`);
        if(config.thread) $moduler.assert(typeof config.thread === "object", `Required parameter «config.thread» to be object on «DialogsPort.methods.open»`);
        if(config.size) $moduler.assert(typeof config.size === "number", `Required parameter «config.size» to be number on «DialogsPort.methods.open»`);
        if(config.footer) $moduler.assert(typeof config.footer === "string", `Required parameter «config.footer» to be string on «DialogsPort.methods.open»`);
      }
    }
  }
})