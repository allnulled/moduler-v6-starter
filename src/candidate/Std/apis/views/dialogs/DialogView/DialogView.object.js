Std.classes.ViewsRegistry.$.set("DialogView", {
  name: "DialogView",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogView/DialogView.view.html"),
  props: {
    thread: {
      type: Object,
      required: true,
    }
  },
  created() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.created" });
    this.$locals = {
      self: this,
      isMaximized: undefined,
      isMinimized: undefined,
      unmaximizedBoundaries: {
        width:200,
        height:200,
      },
      isDragging: false,
      drag: null,
      isResizing: false,
      resize: null,
      resolvable: ModulerV6.createResolvable(),
    };
  },
  methods: {
    getPort() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.getPort" });
      return Std.views.DialogsPort.static.findDialogPortFrom(this.$el);
    },
    focusMe() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.focusMe" });
      this.getPort().setFocusToDialog(this);
    },
    startDrag(event) {
      if (event.button !== 0) return;
      if (this.$locals.isMaximized) return -3;
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.startDrag" });
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
      if (!this.$locals.isDragging) return;
      if (event.pointerId !== this.$locals.drag.pointerId) return;
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.moveDrag" });
      const drag = this.$locals.drag;
      const element = this.$el;
      element.style.left = Std.all.Printer.log(`${Math.round(drag.left + event.clientX - drag.startX)}px`);
      element.style.top = Std.all.Printer.log(`${Math.round(drag.top + event.clientY - drag.startY)}px`);
    },
    stopDrag(event) {
      if (!this.$locals.isDragging) return;
      if (event.pointerId !== this.$locals.drag.pointerId) return;
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.stopDrag" });
      this.$locals.isDragging = false;
      this.$locals.drag = null;
    },
    startResize(event, position) {
      if (this.$locals.isMaximized) return -3;
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.startResize" });
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
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    moveResize(event, position) {
      if (!this.$locals.isResizing) return -1;
      const resize = this.$locals.resize;
      if (event.pointerId !== resize.pointerId) return -2;
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.moveResize" });
      const element = this.$el;
      const deltaX = event.clientX - resize.startX;
      const deltaY = event.clientY - resize.startY;
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
      if (!this.$locals.isResizing) return;
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.stopResize" });
      const resize = this.$locals.resize;
      if (event.pointerId !== resize.pointerId) return;
      this.$locals.isResizing = false;
      this.$locals.resize = null;
    },
    minimize() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.minimize" });
      Update_elements_class: {
        this.$el.classList.add("is_minimized");
      }
      Update_state_flag: {
        this.$locals.isMinimized = true;
      }
    },
    toggleMaximize(forceTo = undefined) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.toggleMaximize" });
      const becomesMaximized = typeof forceTo === "boolean" ? forceTo : !this.$el.classList.contains("is_maximized");
      Update_elements_class: {
        this.$el.classList[becomesMaximized ? "add" : "remove"]("is_maximized");
      }
      Update_topbar_maximize_button_text: {
        this.$refs.maximize_button.textContent = becomesMaximized ? "▪️​" : "◼️";
      }
      Update_state_boundaries: {
        this.$locals.unmaximizedBoundaries = becomesMaximized ? this.$el.getBoundingClientRect() : null;
      }
      Update_blocker_for_resize_and_drag_events_by_state: {
        this.$locals.isMaximized = becomesMaximized;
      }
    },
    accept(...args) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.close" });
      this.thread.close();
      this.$locals.resolvable.resolve(args.length !== 0 ? args[0] : true);
      this.refreshPort();
    },
    close() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.close" });
      this.thread.close();
      this.$locals.resolvable.resolve(null);
      this.refreshPort();
    },
    refreshPort() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.refreshPort" });
      if(!this.$el.parentElement) return;
      this.getPort().refreshView();
    },
    getStatusBar(name) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.getStatusBar" });
      const statusBars = this.$refs.statusBarItems.filter(dynamicView => dynamicView.getContent().statusBox.name === name);
      $moduler.assert(statusBars.length !== 0, `Status bar with name «${name}» does not exist`);
      return statusBars[0];
    },
    getBody() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.getBody" });
      return this.$refs.body;
    },
    getContent() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.getBody" });
      return this.$refs.body.getContent();
    },
  },
  static: {
    sizes: {
      SMALL: 1,
      MEDIUM: 2,
      BIG: 3,
      MAXIMIZED: 4,
      MINIMIZED: 5,
    },
    layouts: {
      SCROLLABLE: 1,
      CENTER: 1,
    },
    buttons: {
      ACCEPT: [{
        text: "Aceptar",
        click: (e, dialog) => {
          return dialog.accept(true);
        }
      }],
      CANCEL: [{
        text: "Cancelar",
        click: (e, dialog) => {
          return dialog.close();
        }
      }],
      ACCEPT_OR_CANCEL: [{
        text: "Aceptar",
        click: (e, dialog) => {
          return dialog.accept(true);
        }
      }, {
        text: "Cancelar",
        click: (e, dialog) => {
          return dialog.close();
        }
      }]
    },
    findDialogFrom(element) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.static.findDialogFrom" });
      $moduler.assert(element instanceof HTMLElement, `Parameter «element» must be instance of HTMLElement but «${typeof element}» was found instead on «DialogView.static.findDialogFrom»`);
      return Std.classes.Domer.findFirstParentWhere(el => el.matches(".DialogView"), element).__vue__;
    }
  }
})