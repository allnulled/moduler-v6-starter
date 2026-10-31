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
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.created"});
    this.$locals = {
      isFirst: true,
      isContextualView: true,
      selectedContext: 0,
      contexts: this.view ? [{ view: this.view, args: this.args, }] : [],
      hasChanged: false,
    };
  },
  updated() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.updated"});
    this.$locals.hasChanged = false;
    this.$locals.isFirst = false;
  },
  mounted() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.mounted"});
  },
  methods: {
    refreshView(hasChanged = false) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.methods.refreshView"});
      this.$locals.hasChanged = hasChanged;
      this.$nextTick(() => {
        this.$locals.hasChanged = false;
      });
      this.$forceUpdate(true);
    },
    resetContext(view, args = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.methods.resetContext"});
      this.$locals.contexts = [{ view, args }];
      this.refreshView(true);
    },
    goBackInContext() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.methods.goBackInContext"});
      if(this.$locals.selectedContext === 0) return -1;
      this.$locals.selectedContext--;
      this.refreshView(false);
    },
    goForwardInContext() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.methods.goForwardInContext"});
      if(this.$locals.selectedContext === (this.$locals.contexts.length - 1)) return -1;
      this.$locals.selectedContext++;
      this.refreshView(false);
    },
    goToContext(index) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.methods.goToContext"});
      this.$locals.selectedContext = index;
      this.refreshView(false);
    },
    addContext(view, args = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.methods.addContext"});
      if(this.$locals.selectedContext === (this.$locals.contexts.length - 1)) {
        this.$locals.contexts.push({ view, args });
      } else {
        this.$locals.contexts = this.$locals.contexts.splice(0, this.$locals.selectedContext+1).concat([{ view, args }]);
      }
      this.$locals.selectedContext = this.$locals.contexts.length - 1;
      this.refreshView(this.$locals.selectedContext);
    },
    appendCleanContext() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.methods.appendCleanContext"});
      return this.addContext(this.view, this.args);
    },
    getClassesForContext(ctx, ctxIndex) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.methods.getClassesForContext"});
      if(ctxIndex === this.$locals.selectedContext) {
        return "active_context";
      }
      return "inactive_context";
    }
  },
  static: {
    findContextualViewOf(base) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.views.ContextualView.static.findContextualViewOf"});
      const contextualElement = Std.all.Domer.findFirstParentWhere(e => e.__vue__?.$locals?.isContextualView === true, base);
      if(!contextualElement) return contextualElement;
      return contextualElement.__vue__;
    },
  }
})