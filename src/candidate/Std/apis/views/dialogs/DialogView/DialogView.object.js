Std.classes.ViewsRegistry.$.set("DialogView", {
  name: "DialogView",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/dialogs/DialogView/DialogView.view.html"),
  props: {
    thread: {
      type: Object,
      required: true,
    },
  },
  created() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.created" });
    this.$locals = {
      self: this,
      isMaximized: undefined,
      isMinimized: undefined,
      unmaximizedBoundaries: false, // { width, height }
      isDragging: false,
      drag: null,
      isResizing: false,
      resize: null,
      port: undefined,
      resolvable: ModulerV6.createResolvable(),
    };
  },
  mounted() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.mounted" });
    this.$locals.port = this.getPort();
  },
  methods: {
    focusMe(event) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.focusMe" });
      if(this.$locals.port.isLastFocusedDialog(this)) return -1;
      if(event?.target.classList.contains("unfocusable")) return -2;
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.focusMe" });
      return this.$locals.port.setFocusToDialog(this);
    },
    getStatusBar(name) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.getStatusBar" });
      const statusBars = this.$refs.statusBarItems.filter(dynamicView => dynamicView.getContent().statusBox.name === name);
      $moduler.assert(statusBars.length !== 0, `Status bar with name «${name}» does not exist`);
      return statusBars[0];
    },
    getPort() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.getPort" });
      return Std.views.DialogsPort.static.findDialogPortFrom(this.$el);
    },
    getBody() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.getBody" });
      return this.$refs.body;
    },
    getContent() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.getBody" });
      return this.$refs.body.getContent();
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
      element.style.left = `${Math.round(drag.left + event.clientX - drag.startX)}px`;
      element.style.top = `${Math.round(drag.top + event.clientY - drag.startY)}px`;
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
      this.port.refreshView();
    },
    adaptThreadButtons(buttons = this.thread.buttons || []) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.methods.adaptThreadButtons" });
      if(Array.isArray(buttons)) {
        // Via 1: array de objetos
        const output = [];
        for(let index=0; index<buttons.length; index++) {
          const buttonInput = buttons[index];
          if(typeof buttonInput === "string") {
            output.push(Std.views.DialogView.static.fromStringToDialogButton(buttonInput));
          } else {
            output.push(buttonInput);
          }
        }
        return output;
      } else if(typeof buttons === "object") {
        // Via 2: objeto único con pares text-function
        return Object.keys(buttons).reduce((output, text) => {
          output.push({ text, click: buttons[text] });
          return output;
        }, []);
      } else if(typeof buttons === "string") {
        // Via 3: texto que leerá los: "|" "@" "@@" y "="
        return Std.views.DialogView.static.fromStringToDialogButtons(buttons);
      }
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
    findDialogFrom(elementOrComponent) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.static.findDialogFrom" });
      let element = undefined;
      if(elementOrComponent instanceof HTMLElement) {
        element = elementOrComponent;
      } else if(elementOrComponent instanceof Std.externals.Vue2) {
        element = elementOrComponent.$el;
      } else {
        $moduler.assert(element, `Parameter «element» must be instance of HTMLElement or Vue2 component but «${typeof element}» was found instead on «DialogView.static.findDialogFrom»`);
      }
      return Std.classes.Domer.findFirstParentWhere(el => el.matches(".DialogView"), element).__vue__;
    },
    fromStringToDialogButton(buttonContent, index) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.static.fromStringToDialogButton" });
      let buttonObject = {};
      const viaDialogEvent = buttonContent.split("@@");
      const viaContentEvent = buttonContent.split("@");
      const viaProperty = buttonContent.split("=");
      if(viaDialogEvent.length > 1) {
        buttonObject = { text: viaDialogEvent[0], click: (e, dialog) => dialog[viaDialogEvent[1]]() };
      } else if(viaContentEvent.length > 1) {
        buttonObject = { text: viaDialogEvent[0], click: (e, dialog) => dialog.accept(dialog.getContent()[viaDialogEvent[1]]()) };
      } else if(viaProperty.length > 1) {
        buttonObject = { text: viaProperty[0], click: (e, dialog) => dialog.accept(dialog.getContent()[viaProperty[1]]) };
      } else {
        if(buttons.length === 3) {
          if(false) {}
          else if(indexButton === 0) buttonObject = { text: buttonContent, click: (e, dialog) => dialog.accept(true) };
          else if(indexButton === 1) buttonObject = { text: buttonContent, click: (e, dialog) => dialog.accept(false) };
          else if(indexButton === 2) buttonObject = { text: buttonContent, click: (e, dialog) => dialog.close() };
        } else if(buttons.length === 2) {
          if(false) {}
          else if(indexButton === 0) buttonObject = { text: buttonContent, click: (e, dialog) => dialog.accept(true) };
          else if(indexButton === 1) buttonObject = { text: buttonContent, click: (e, dialog) => dialog.close() };
        } else if(buttons.length === 1) {
          if(false) {}
          else if(indexButton === 0) buttonObject = { text: buttonContent, click: (e, dialog) => dialog.close() };
        }
      }
      return buttonObject;
    },
    fromStringToDialogButtons(code) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", { name: "Std.views.DialogView.static.fromStringToDialogButtons" });
      const output = [];
      const buttons = code.split("|");
      for (let indexButton = 0; indexButton < buttons.length; indexButton++) {
        const buttonContent = buttons[indexButton];
        const buttonObject = Std.views.DialogView.static.fromStringToDialogButton(buttonContent, indexButton);
        output.push(buttonObject);
      }
      return output;
    }
  }
})