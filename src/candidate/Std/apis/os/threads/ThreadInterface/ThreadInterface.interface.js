// @interface:ThreadInterface
{
  static: {},
  prototype: {
    onCreate: function (parameters) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ThreadInterface.prototype.onCreate"});
      Pre_validation: {
        $moduler.assert(typeof parameters === "object", `Required «parameters» to be object on «ThreadInterface.prototype.onCreate»`);
      }
      Initialization: {
        this.threadId = Std.classes.Randomizer.getRandomLetters(10);
        this.parent = null;
        this.children = [];
        this.isClosed = false;
      }
      Polyfillment: {
        Object.assign(this, parameters);
      }
      Corrections: {
        if(this.parent === null) {
          this.parent = Std.classes.Thread.globalInstance;
        }
        this.onChange = new Std.classes.FunctionsList();
        this.onChange.push(...(parameters.onChange || []));
        this.onClose = new Std.classes.FunctionsList();
        this.onClose.push(...(parameters.onClose || []));
      }
      Post_validation: {
        if(this.parent !== false) {
          $moduler.assert(typeof this.parent === "object", `Required «this.parent» to be object on «ThreadInterface.prototype.onCreate»`);
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
      Emit_related_events: {
        this.onChange.evaluateFunctionsSync({ thread: this });
      }
      Emit_dialogs_update: {
        Std.objects.GlobalDialog?.port?.refreshView();
      }
    },
    get newSubthread() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ThreadInterface.prototype.newSubthread"});
      return this.createSubthread();
    },
    createSubthread(config = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ThreadInterface.prototype.createSubthread"});
      return Std.classes.Thread.create({ ...config, parent: this });
    },
    close: function () {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ThreadInterface.prototype.close"});
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
      Emit_related_events: {
        this.onClose.evaluateFunctionsSync({ thread: this });
      }
      Emit_dialogs_update: {
        Std.objects.GlobalDialog?.port?.refreshView();
      }
    }
  },
}