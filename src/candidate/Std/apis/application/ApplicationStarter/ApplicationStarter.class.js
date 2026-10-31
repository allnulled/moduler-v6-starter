class ApplicationStarter {
  
  static isStarted = false;

  static globalApplication = null;

  static start() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.ApplicationStarter.start"});
    Shortcut_cache_start_promise: {
      if(this.isStarted) {
        console.log("[*] Returning previously created application promise");
        return this.isStarted;
      }
    }
    let promise, resolve, reject;
    Export_transaction_variables: {
      console.log("[*] Creating application promise...");
      ({ promise, resolve, reject } = ModulerV6.createResolvable());
    }
    Collapse_cache: {
      console.log("[*] Setting application promise...");
      this.isStarted = promise;
    }
    Declare_static_globals: {
      Std.externals.Vue2.prototype.$window = window;
      Std.externals.Vue2.prototype.$std = Std;
    }
    Resolve_start: {
      (async () => {
        try {
          console.log("[*] Deploying application...");
          this.globalApplication = new Std.externals.Vue2({
            render: h => {
              console.log("[*] Rendering application");
              return h(Std.externals.Vue2.options.components.MainApplication);
            },
          });
          console.log("[*] Mounting application...");
          this.globalApplication.$mount("#app");
          resolve(this.globalApplication);
          console.log("[!] Application deployed successfully");
        } catch (error) {
          console.log("[!] Application deployment failed:", error);
          reject(error);
        }
      })();
    }
    return this.isStarted;
  }

}