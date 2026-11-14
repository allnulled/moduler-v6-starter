Std.classes.ViewsRegistry.set("FixedPanels", {
  name: "FixedPanels",
  template: $compiler.inject.string("@/src/Std/apis/application/FixedPanels/FixedPanels.view.html"),
  props: {
    application: {
      type: Std.externals.Vue2,
      required: true,
    },
  },
  created() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedPanels.created"});
  },
  mounted() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedPanels.mounted"});
    this.application.setPanels(this);
    this.application.panels.bottom.right.addButton({
      click: () => Std.classes.Launcher.launch("Threads viewer"),
      icon: "menu"
    });
  },
  computed: {
    left: {get() { return this.$refs.left }},
    right: {get() { return this.$refs.right }},
    top: {get() { return this.$refs.top }},
    bottom: {get() { return this.$refs.bottom }},
  },
  data: function() {
    return {};
  },
  methods: {},
})