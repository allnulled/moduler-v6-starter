Std.classes.ViewsRegistry.set("ApplicationBackgroundWidget", {
  name: "ApplicationBackgroundWidget",
  template: $compiler.inject.string("@/src/Std/apis/views/background/ApplicationBackgroundWidget/ApplicationBackgroundWidget.view.html"),
  created() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.ApplicationBackgroundWidget.created"});
    Std.objects.GlobalBackground = this;
  },
  mounted() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.views.ApplicationBackgroundWidget.mounted"});
  },
  data: function() {
    return {};
  },
  methods: {
    setBackgroundImage(url = "none") {
      if(url === "none") this.$el.children[0].style.backgroundImage = "none";
      else this.$el.children[0].style.backgroundImage = `url(${url})`;
    }
  },
})