Std.classes.ViewsRegistry.$.set("DynamicView", {
  name: "DynamicView",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/containers/DynamicView/DynamicView.view.html"),
  props: {
    view: {
      type: Object,
      default: () => ({}),
    },
    args: {
      type: Object,
      default: () => ({}),
    }
  },
  created() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.DynamicView.created"});
    this.$locals = {
      currentView: this.view,
      currentArgs: this.args,
    };
  },
  mounted() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.DynamicView.mounted"});
    this.setView(this.$locals.currentView, this.$locals.currentArgs);
  },
  methods: {
    refreshView() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.DynamicView.methods.refreshView"});
      this.$forceUpdate(true);
    },
    setView(view, args = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.DynamicView.methods.setView"});
      const { ViewsRegistry } = Std.all;
      Validate_input: {
        $moduler.assert(typeof view === "object", `Required parameter «view» to be object but «${typeof view}» was found instead on «Std.objects.DynamicView.methods.setView»`);
        $moduler.assert(typeof view.template === "string", `Required property «view.template» to be string but «${typeof view}» was found instead on «Std.objects.DynamicView.methods.setView»`);
        $moduler.assert(typeof args === "object", `Required property «args» to be object but «${typeof args}» was found instead on «Std.objects.DynamicView.methods.setView»`);
      }
      Unregister_previous: {
        if(this.$locals.currentView.name && ViewsRegistry.$.get(this.$locals.currentView.name)?.isVolatile) {
          ViewsRegistry.$.delete(this.$locals.currentView.name);
        }
      }
      Register_new_or_polyfill_with_old: {
        if(!view.name) {
          view.name = `DynamicViewUnit${Std.classes.Randomizer.getRandomNumbers(10)}`;
        }
        if(!(view.name in Std.externals.Vue2.options.components)) {
          ViewsRegistry.$.set(view.name, {
            isVolatile: true,
            ...view,
          });
        } else {
          view = { ...view, ...ViewsRegistry.$.get(view.name) };
        }
      }
      Hydrate_view: {
        this.$locals.currentArgs = args;
        this.$locals.currentView = view;
        this.refreshView();
      }
    },
    setHtml(html) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.DynamicView.methods.setHtml"});
      return this.setView({
        template: html.startsWith("<") ? html : `<div>${html}</div>`,
      });
    },
  }
})