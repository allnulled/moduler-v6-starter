Std.classes.ViewsRegistry.set("FixedArea", {
  name: "FixedArea",
  template: $compiler.inject.string("@/src/Std/apis/application/FixedArea/FixedArea.view.html"),
  props: {
    position: {
      type: String,
      required: true,
    },
  },
  created() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedArea.created"});
    this.$locals = {
      buttons: []
    };
  },
  mounted() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedArea.mounted"});
  },
  data: function() {
    return {};
  },
  methods: {
    validateButton(button) {
      $moduler.assert(typeof button === "object", "Required parameter «button» to be object on «FixedArea.methods.validateButton»");
      $moduler.assert(typeof button.click === "function", "Required parameter «button.click» to be function on «FixedArea.methods.validateButton»");
      $moduler.assert((typeof button.text === "string") || (typeof button.icon === "string"), "Required parameter «button.text» or «button.icon» to be string on «FixedArea.methods.validateButton»");
    },
    addButton(button) {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedArea.methods.addButton"});
      this.validateButton(button);
      this.$locals.buttons.push(button);
      this.$forceUpdate(true);
    },
    prependButton(button) {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedArea.methods.prependButton"});
      this.validateButton(button);
      this.$locals.buttons.unshift(button);
      this.$forceUpdate(true);
    },
    findPositionOfFirstButtonWhere(filter) {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedArea.methods.findPositionOfFirstButtonWhere"});
      $moduler.assert(typeof filter === "function", "Required parameter «filter» to be function on «FixedArea.methods.addButton»");
      return this.$locals.buttons.filterIndex(f);
    },
    removeButton(input) {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.FixedArea.methods.removeButton"});
      const pos = typeof input === "function" ? this.findPositionOfFirstButtonWhere(input) : input;
      this.$locals.buttons.splice(pos, 1);
      this.$forceUpdate(true);
    },
    generateStyles() {
      let out = "";
      out += `align-items: ${this.position};\n`;
      out += `justify-content: ${this.position};\n`;
      out += `display: flex;\n`;
      out += `flex-direction: ${this.$parent.direction === "horizontal" ? "row" : "column"};\n`;
      return out;
    }
  },
})