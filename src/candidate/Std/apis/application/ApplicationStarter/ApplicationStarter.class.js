class ApplicationStarter {
  
  static globalApplication = null;

  static globalFactory = Std.views.MainApplication;

  static events = {
    onStarted: new Std.classes.UniqueEvent("Std.views.MainApplication.static.events.onStarted"),
  };

  static start() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.ApplicationStarter.start"});
    $moduler.assert(typeof Std.objects.GlobalApplication === "undefined", "Method «ApplicationStarter.start» can only be called once in a runtime but object «Std.objects.GlobalApplication» is already set");
    let promise, resolve;
    Prepare_started_promise: {
      ({ promise, resolve } = $moduler.constructor.createResolvable());
    }
    Define_vue2_globals: {
      Object.assign(Std.externals.Vue2.prototype, {
        $window: window,
        $std: Std,
        $findDialogFrom: Std.views.DialogView.static.findDialogFrom,
      });
    }
    Define_vue2_application: {
      $moduler.assert(!Std.objects.GlobalApplication, "ApplicationStarter.start can only be called once in a runtime");
      Std.objects.GlobalApplication = this.globalApplication = new Std.externals.Vue2({
        render: h => {
          console.log("[*] Rendering application");
          return h(this.globalFactory);
        },
      });
    }
    Register_application_events_for_onStarted: {
      this.events.onStarted.addTrigger(parameters => {
        resolve(parameters);
      });
      this.events.onStarted.addTrigger(async function () {
        Execute_tests: {
          console.log("[*] Starting tests in browser");
          if(["dev","test"].includes($moduler.settings.data.env)) {
            await Std.all.Tester.evaluateBrowserDirectory({ title: "Integridad", directory: "@/dist/www/dev/test/integrity" });
            await Std.all.Tester.evaluateBrowserDirectory({ title: "Unitarios", directory: "@/dist/www/dev/test/unit" });
            await Std.all.Tester.evaluateBrowserDirectory({ title: "Prestaciones", directory: "@/dist/www/dev/test/feature" });
            await Std.all.Tester.evaluateBrowserDirectory({ title: "Caso concreto", directory: "@/dist/www/dev/test/case" });
            await Std.all.Tester.evaluateBrowserDirectory({ title: "Espontáneos", directory: "@/dist/www/dev/test/spontaneous" });
          }
        }
      });
    }
    Mount_vue2_application: {
      this.globalApplication.$mount("#app");
    }
    Return_promise_for_when_started: {
      return promise;
    }
  }

}