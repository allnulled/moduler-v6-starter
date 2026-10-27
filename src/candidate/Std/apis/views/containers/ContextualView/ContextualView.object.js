Std.classes.ViewsRegistry.$.set("ContextualView", {
  name: "ContextualView",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/containers/ContextualView/ContextualView.view.html"),
  props: {
    view: {
      type: Object,
      default: () => false,
    },
    args: {
      type: Object,
      default: () => ({}),
    },
  },
  created: function() {
    this.$locals = {
      isFirst: true,
      isContextualView: true,
      selectedContext: 0,
      contexts: this.view ? [{ view: this.view, args: this.args, }] : [],
      hasChanged: false,
    };
  },
  updated() {
    this.$locals.hasChanged = false;
    this.$locals.isFirst = false;
  },
  mounted() {
    
  },
  methods: {
    refreshView(hasChanged = false) {
      this.$locals.hasChanged = hasChanged;
      this.$nextTick(() => {
        this.$locals.hasChanged = false;
      });
      this.$forceUpdate(true);
    },
    resetContext(view, args = {}) {
      this.$locals.contexts = [{ view, args }];
      this.refreshView(true);
    },
    goBackInContext() {
      if(this.$locals.selectedContext === 0) return -1;
      this.$locals.selectedContext--;
      this.refreshView(false);
    },
    goForwardInContext() {
      if(this.$locals.selectedContext === (this.$locals.contexts.length - 1)) return -1;
      this.$locals.selectedContext++;
      this.refreshView(false);
    },
    goToContext(index) {
      this.$locals.selectedContext = index;
      this.refreshView(false);
    },
    addContext(view, args = {}) {
      if(this.$locals.selectedContext === (this.$locals.contexts.length - 1)) {
        this.$locals.contexts.push({ view, args });
      } else {
        this.$locals.contexts = this.$locals.contexts.splice(0, this.$locals.selectedContext+1).concat([{ view, args }]);
      }
      this.$locals.selectedContext = this.$locals.contexts.length - 1;
      this.refreshView(this.$locals.selectedContext);
    },
    appendCleanContext() {
      return this.addContext(this.view, this.args);
    },
    getClassesForContext(ctx, ctxIndex) {
      if(ctxIndex === this.$locals.selectedContext) {
        return "active_context";
      }
      return "inactive_context";
    }
  },
  static: {
    findContextualViewOf(base) {
      const contextualElement = Std.all.Domer.findFirstParentWhere(e => e.__vue__?.$locals?.isContextualView === true, base);
      if(!contextualElement) return contextualElement;
      return contextualElement.__vue__;
    },
  }
})