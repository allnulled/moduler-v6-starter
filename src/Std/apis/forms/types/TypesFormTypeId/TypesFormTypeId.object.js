Std.classes.ViewsRegistry.set("TypesFormTypeId", {
  name: "TypesFormTypeId",
  mixins: [Std.views.TypesFormPrototype],
  template: $compiler.inject.string("./TypesFormTypeId.view.html"),
  created() {
    this.$locals.type = {
      isLoaded: false,
      error: false,
      id: this.localAst.id,
      url: $moduler.normalizationOf(`@/dist/www/types/${this.localAst.id}/${this.localAst.id}.dist.js`),
      definition: undefined,
      resolvable: $moduler.constructor.createResolvable(),
    };
  },
  methods: {
    validateTypeDefinition(definition) {
      $moduler.assert(typeof definition === "object", "Not accepted type definition due to rule 1");
      $moduler.assert(typeof definition.abstraction === "object", "Not accepted type definition due to rule 2");
      $moduler.assert(typeof definition.abstraction.views === "object", "Not accepted type definition due to rule 3");
      $moduler.assert(typeof definition.abstraction.views.default === "object", "Not accepted type definition due to rule 4");
      $moduler.assert(typeof definition.abstraction.views.default.name === "string", "Not accepted type definition due to rule 5");
    },
    getCorrespondingView(definition) {
      return definition.abstraction.views.default.name;
    }
  },
  async mounted() {
    Load_definition_once: {
      if(this.$locals.type.isLoaded || this.$locals.type.error) {
        break Load_definition_once;
      }
      try {
        const definition = await Std.classes.TypesRegistry.find(this.localAst.id);
        this.validateTypeDefinition(definition);
        this.$locals.type.definition = definition;
        this.$locals.type.isLoaded = true;
        this.$locals.type.resolvable.resolve(definition);
      } catch (error) {
        this.error = error;
        this.$locals.type.resolvable.reject(error);
      } finally {
        this.$forceUpdate(true);
      }
    }
  },
})