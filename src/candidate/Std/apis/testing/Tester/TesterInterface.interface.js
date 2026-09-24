{
  static: {
    evaluateDirectory: $compiler.inject.source("./static.evaluateDirectory.js"),
    evaluateCallback: $compiler.inject.source("./static.evaluateCallback.js"),
    evaluateBrowserDirectory: $compiler.inject.source("./static.evaluateBrowserDirectory.js"),
    start: $compiler.inject.source("./static.start.js"),
  },
  prototype: {
    onCreate: function() {
      this.cases = [];
      this.errors = [];
    },
    getRoot: function() {
      let pivot = this;
      while(pivot.parent) {
        pivot = pivot.parent;
      }
      return pivot;
    },
    getFullTitle: function() {
      let fullTitle = this.title;
      let pivot = this;
      while(pivot.parent) {
        pivot = pivot.parent;
        if(pivot.title) {
          fullTitle = `${pivot.title} »» ${fullTitle}`;
        }
      }
      return fullTitle;
    },
    case: $compiler.inject.source("./prototype.case.js"),
  },
}