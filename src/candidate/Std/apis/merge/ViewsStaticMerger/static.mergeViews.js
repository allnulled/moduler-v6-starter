static mergeViews(...views) {
  const mergedView = {};
  const strategies = {
    props: this.mergeUniqueProperties,
    methods: this.mergeUniqueProperties,
    computed: this.mergeUniqueProperties,
    components: this.mergeUniqueProperties,
    directives: this.mergeUniqueProperties,
    filters: this.mergeUniqueProperties,
    watch: (property, value) => this.mergeWatch(value, mergedView),
    mixins: (property, value) => this.mergeMixins(value, mergedView),
    beforeCreate: this.mergeLifecycle,
    created: this.mergeLifecycle,
    beforeMount: this.mergeLifecycle,
    mounted: this.mergeLifecycle,
    beforeUpdate: this.mergeLifecycle,
    updated: this.mergeLifecycle,
    activated: this.mergeLifecycle,
    deactivated: this.mergeLifecycle,
    beforeDestroy: this.mergeLifecycle,
    destroyed: this.mergeLifecycle,
    errorCaptured: this.mergeLifecycle,
    serverPrefetch: this.mergeLifecycle,
  };
  const excluded = new Set(["name","data","parent","extends","provide","inject","template","render","renderError","staticRenderFns","functional","model","inheritAttrs"]);
  for (let indexView = 0; indexView < views.length; indexView++) {
    const input = views[indexView];
    let view, options = {};
    if (Array.isArray(input)) {
      $moduler.assert(input.length === 2, `Required parameter «views[${indexView}]» to be array but with 2 elements and it has «${input.length}» elements on «DialogsPort.methods.open»`);
      [view, options] = input;
      $moduler.assert(typeof input === "object", `Required parameter «views[${indexView}][0]» to be object «${input.length}» elements on «DialogsPort.methods.open»`);
      $moduler.assert(typeof options === "object", `Required parameter «views[${indexView}][1]» to be object «${options.length}» elements on «DialogsPort.methods.open»`);
    }
    $moduler.assert(typeof view === "object", `Required parameter «views[${indexView}]» to be object on «DialogsPort.methods.open»`);
    for (const key of Object.keys(view)) {
      const value = view[key];
      if (excluded.has(key)) continue;
      const strategy = strategies[key];
      if (strategy) strategy(key, value, mergedView);
      else if (!Object.prototype.hasOwnProperty.call(mergedView, key)) mergedView[key] = value;
    }
  }
  return mergedView;
}