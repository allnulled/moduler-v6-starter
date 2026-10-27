// @interface:ThreadInterface
{
  static: {},
  prototype: {
    onCreate: function (parameters) {
      Pre_validation: {
        $moduler.assert(typeof parameters === "object", `Required «parameters» to be object on «ThreadInterface.prototype.onCreate»`);
      }
      Initialization: {
        this.parent = null;
        this.children = [];
        this.isClosed = false;
      }
      Polyfillment: {
        Object.assign(this, parameters);
        if(this.parent === null) {
          this.parent = Std.classes.Thread.globalInstance;
        }
      }
      Post_validation: {
        $moduler.assert(typeof this.parent === "object", `Required «this.parent» to be object on «ThreadInterface.prototype.onCreate»`);
        if(this.parent !== false) {
          $moduler.assert(this.parent instanceof Std.classes.Thread, `Required «this.parent» to be instance of «Std.classes.Thread» on «ThreadInterface.prototype.onCreate»`);
          $moduler.assert(Array.isArray(this.parent.children), `Required «this.parent.children» to be array on «ThreadInterface.prototype.onCreate»`);
        }
      }
      Self_push_into_parent: {
        if (this.parent === false) {
          break Self_push_into_parent;
        }
        this.parent.children.push(this);
      }
    },
    get newThread() {
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