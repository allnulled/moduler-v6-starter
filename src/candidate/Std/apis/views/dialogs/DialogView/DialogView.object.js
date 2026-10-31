Std.classes.ViewsRegistry.$.set("DialogView", {
  name: "DialogView",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogView/DialogView.view.html"),
  props: {
    port: {
      type: Object,
      required: true,
    },
    thread: {
      type: Object,
      required: true,
    }
  },
  created() {
    this.$locals = {
      isMaximized: false,
      isMinimized: false,
      isDragging: false,
      drag: null,
      isResizing: false,
      resize: null,
    };
  },
  methods: {
    focusMe() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.focusMe" });
      this.port.setFocusToDialog(this);
    },
    startDrag(event) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.startDrag" });
      if (event.button !== 0) return;
      this.focusMe();
      const element = this.$el;
      const rect = element.getBoundingClientRect();
      this.$locals.drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: rect.left,
        top: rect.top
      };
      this.$locals.isDragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    moveDrag(event) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.moveDrag" });
      if (!this.$locals.isDragging) return;
      if (event.pointerId !== this.$locals.drag.pointerId) return;
      const drag = this.$locals.drag;
      const element = this.$el;
      element.style.left = `${drag.left + event.clientX - drag.startX}px`;
      element.style.top = `${drag.top + event.clientY - drag.startY}px`;
    },
    stopDrag(event) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.stopDrag" });
      if (!this.$locals.isDragging) return;
      if (event.pointerId !== this.$locals.drag.pointerId) return;
      this.$locals.isDragging = false;
      this.$locals.drag = null;
    },
    startResize(event, position) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.startResize" });

      console.log("INICIANDO START");
      const element = this.$el;
      const rect = element.getBoundingClientRect();
      this.$locals.resize = {
        position,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
      this.$locals.isResizing = true;
      console.log("activated resiz")
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    moveResize(event, position) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.moveResize" });
      console.log("INICIANDO MOVE");
      if (!this.$locals.isResizing) return console.log("Not resiginz");
      const resize = this.$locals.resize;
      if (event.pointerId !== resize.pointerId) return console.log("Not pointercaptureds");;
      const element = this.$el;
      const deltaX = event.clientX - resize.startX;
      const deltaY = event.clientY - resize.startY;
      console.log(deltaX, deltaY);
      if (position.includes("right")) {
        element.style.width = `${resize.width + deltaX}px`;
      }
      if (position.includes("left")) {
        element.style.width = `${resize.width - deltaX}px`;
        element.style.left = `${resize.left + deltaX}px`;
      }
      if (position.includes("bottom")) {
        element.style.height = `${resize.height + deltaY}px`;
      }
      if (position.includes("top")) {
        element.style.height = `${resize.height - deltaY}px`;
        element.style.top = `${resize.top + deltaY}px`;
      }
    },
    stopResize(event, position) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.stopResize" });
      console.log("INICIANDO STOP");
      if (!this.$locals.isResizing) return;
      const resize = this.$locals.resize;
      if (event.pointerId !== resize.pointerId) return;
      this.$locals.isResizing = false;
      this.$locals.resize = null;
    },
    minimize() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.minimize" });
      this.$locals.isMinimized = true;
      console.log("INICIANDO MINIMIZ");
      this.refreshPort();
    },
    toggleMaximize() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.toggleMaximize" });
      this.$locals.isMaximized = !this.$locals.isMaximized;
      this.refreshPort();
    },
    close() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.close" });
      this.thread.close();
      this.refreshPort();
    },
    refreshPort() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.refreshPort" });
      this.port.refreshView();
    }
  },
  static: {
    findDialogFrom(element) {

    }
  }
})