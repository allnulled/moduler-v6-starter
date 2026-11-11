Std.classes.ViewsRegistry.$.set("DynamicControl",
  Std.classes.ViewsStaticMerger.mergeViews(...[
    {
      name: "DynamicControl",
      props: {
        parameters: {
          type: Object,
          required: true
        }
      },
      async created() {
        Install_locals: {
          this.$locals = {
            isLoaded: false,
            controlName: null,
            controlParameters: {}
          };
        }
        try {
          Load_control_dynamically: {
            this.$locals.controlName = this.parameters.controlOf;
            this.$locals.controlParameters = this.parameters;
            this.$locals.isLoaded = true;
          }
          Render_view: {
            this.$forceUpdate(true);
          }
        } catch(error) {
          this.$locals.error = error;
        }
      },
      render(h) {
        if(!this.$locals.isLoaded) return h();
        if(this.$locals.error) return h("ErrorViewer", { props: { error: this.$locals.error } });
        return h(this.$locals.controlName, { props: this.$locals.controlParameters });
      }
    }
  ]),
)