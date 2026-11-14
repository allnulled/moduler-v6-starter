Std.classes.ViewsRegistry.set("ErrorViewer",
  Std.classes.ViewsStaticMerger.mergeViews(...[
    {
      name: "ErrorViewer",
      props: {
        error: {
          type: Error,
          default: null
        }
      },
      async created() {
        Install_locals: {
          this.$locals = {
            error: this.error,
          };
        }
      },
      template: $compiler.inject.string("./ErrorViewer.view.html"),
    }
  ]),
)