{
  props: {
    params: {
      type: Object,
      required: true,
    }
  },
  created() {
    const params = $moduler.toolkit.normalizeObject(this.params, ...Std.views.TypesFormNode.static.paramsNormalization);
    this.$locals = { params };
  },
  computed: {
    localAst: {
      get() {
        return Std.classes.Introspector.get(this.$locals.params.ast, this.$locals.params.astIndex);
      }
    },
    localData: {
      get() {
        return Std.classes.Introspector.get(this.$locals.params.data, this.$locals.params.dataIndex);
      }
    }
  }
}