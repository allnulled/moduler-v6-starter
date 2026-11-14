Std.classes.ViewsRegistry.set("FixedPanel", {
  name: "FixedPanel",
  template: $compiler.inject.string("@/src/Std/apis/application/FixedPanel/FixedPanel.view.html"),
  props: {
    name: {
      type: String,
      required: true,
    },
    direction: {
      type: String,
      required: true,
    }
  },
  created() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedPanel.created"});
    Object.defineProperty(this, this.direction === "horizontal" ? "left" : "top", {
      configurable: true,
      enumerable: true,
      get() {
        return this.$refs.area1;
      }
    });
    Object.defineProperty(this, "center", {
      configurable: true,
      enumerable: true,
      get() {
        return this.$refs.area2;
      }
    });
    Object.defineProperty(this, this.direction === "horizontal" ? "right" : "bottom", {
      configurable: true,
      enumerable: true,
      get() {
        return this.$refs.area3;
      }
    });
  },
  mounted() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedPanel.mounted"});
  },
  data: function() {
    return {};
  },
  methods: {},
})