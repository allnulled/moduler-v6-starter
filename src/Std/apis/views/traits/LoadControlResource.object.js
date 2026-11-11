{
  methods: {
    async loadControlResource() {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.objects.ViewTraits.ValidateControlParameters.methods.loadControlResource"});
      await Std.classes.Timeout.of(1000);
    }
  }
}