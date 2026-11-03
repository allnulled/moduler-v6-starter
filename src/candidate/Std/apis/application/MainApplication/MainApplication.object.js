Std.classes.ViewsRegistry.$.set("MainApplication", {
  name: "MainApplication",
  template: $compiler.inject.string("@/src/candidate/Std/apis/application/MainApplication/MainApplication.view.html"),
  created() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.MainApplication.created"});
  },
  mounted() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.MainApplication.mounted"});
    Std.classes.ApplicationStarter.events.onStarted.evaluateEventSync({ application: this });
    console.log("[*] Main application was started successfully.");
  },
  data: function() {
    return {};
  },
  methods: {},
})