Std.classes.ViewsStaticMerger.mergeViews({
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
}, {
  // BasicControlViewTrait.object.js
  created() {
    Inicia_locals: {
      if(!this.$locals) this.$locals = {};
    }
    Valor_local: {
      this.$locals.value = "";
      this.$locals.seniuelo = "88888";
    }
    Propiedades_computadas: {
      this.$locals.computed = new Std.classes.ComputedProperties({
        statement: {
          get: () => {
            return this.seniuelo;
          }
        },
        placeholder: {
          get: () => {
            return "yeeeeeeeeep" || this.seniuelo;
          }
        }
      });
    }
  },
  methods: {
    getValueFromDom() {
      return this.getValueFromDom ? this.onGetValueFromDom : this.$refs.domValueOrigin.value;
    },
    updateValueFromDom() {
      const value = this.getValueFromDom();
      this.$locals.value = value;
    }
  }
})