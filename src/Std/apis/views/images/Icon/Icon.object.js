Std.classes.ViewsRegistry.set("Icon", {
  name: "Icon",
  template: $compiler.inject.string("./Icon.view.html"),
  props: {
    of: {
      type: String,
      required: true,
    },
    vendor: {
      type: String,
      default: "lucide",
    },
    extension: {
      type: String,
      default: "svg",
    },
    color: {
      type: String,
      default: "inherit",
    },
    size: {
      type: String,
      default: "24px"
    }
  },
  created() {
    this.$locals = { selected: this.of };
    this.$locals.target = $moduler.normalizationOf(`@/dist/www/assets/icons/${this.vendor}/${this.$locals.selected}.${this.extension}`)
  },
  methods: {
    setIcon(icon) {
      this.$locals.target = $moduler.normalizationOf(`@/dist/www/assets/icons/${this.vendor}/${icon}.${this.extension}`);
      this.$forceUpdate(true);
    }
  }
})