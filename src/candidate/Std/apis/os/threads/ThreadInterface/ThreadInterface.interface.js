// @interface:ThreadInterface
{
  static: {},
  prototype: {
    onCreate: function (parameters) {
      Validation: {
        $moduler.assert(typeof parameters === "object", `Required «parameters» to be object on «ThreadInterface.prototype.onCreate»`);
        $moduler.assert(typeof parameters.parent === "object", `Required «parameters.parent» to be object on «ThreadInterface.prototype.onCreate»`);
      }
      Initialization: {
        this.parent = null;
        this.children = [];
        this.isClosed = false;
      }
      Polyfillment: {
        Object.assign(this, parameters);
      }
      Self_push_into_parent: {
        if (!this.parent) break Self_push_into_parent;
        this.parent.children.push(this);
      }
    },
    createSubthread: function () {
      return Std.classes.Thread.create({ parent: this });
    },
    close: function () {
      Close_children: {
        for (let index = this.children.length - 1; index >= 0; index--) {
          this.children[index].close();
        }
      }
      Self_close: {
        this.isClosed = true;
      }
      Self_remove_from_parent: {
        if (!this.parent) break Self_remove_from_parent;
        const pos = this.parent.children.indexOf(this);
        if (pos === -1) break Self_remove_from_parent;
        this.parent.children.splice(pos, 1);
      }
    }
  },
}