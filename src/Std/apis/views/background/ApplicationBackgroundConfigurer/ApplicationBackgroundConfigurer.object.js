Std.classes.ViewsRegistry.set("ApplicationBackgroundConfigurer", {
  name: "ApplicationBackgroundConfigurer",
  template: $compiler.inject.string("@/src/Std/apis/views/background/ApplicationBackgroundConfigurer/ApplicationBackgroundConfigurer.view.html"),
  created() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.ApplicationBackgroundConfigurer.created"});
  },
  mounted() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.ApplicationBackgroundConfigurer.mounted"});
  },
  data: function() {
    return {};
  },
  methods: {},
})