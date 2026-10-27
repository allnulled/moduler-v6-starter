class Domer {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
    ], this);
  }
  static insertElementById(id) {
    return document.querySelector(`#${id}`) || (function() {
      const elem = document.createElement("div");
      elem.setAttribute("id", id);
      document.body.appendChild(elem);
      return elem;
    })();
  }
  static find(selector = "*", base = document) {
    let output = undefined;
    if(typeof selector === "string") {
      output = [...base.querySelectorAll(selector)];
    } else if(typeof selector === "function") {
      output = [...base.querySelectorAll("*")].filter(el => selector(el));
    }
    return output;
  }
  static first(select, base = document) {
    return this.find(select, base)[0];
  }
  static findFirstParentWhere(filter, base) {
    let pivot = base;
    while(pivot !== null) {
      if(filter(pivot)) {
        return pivot;
      }
      pivot = pivot.parentElement;
    }
    return null;
  }
  static {
    Native_HTMLElement_extensions: {
      if(Std.classes.Environmenter.isBrowser) {
        HTMLElement.prototype.getVueComponent = function() {
          return this.__vue__;
        };
      }
    }
  }
}