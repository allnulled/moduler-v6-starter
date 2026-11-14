class DialogsFactory {

  static utils = {
    defaultOptions1: {
      title: "Sin título",
      size: "small",
      layout: "centered",
      yes: "Aceptar",
      no: "Cancelar",
      default: "",
    },
    cleanDefaultOptions1: function(it) {
      const output = {
        yes: it.yes,
        no: it.no,
        default: it.default,
      };
      delete it.yes;
      delete it.no;
      delete it.default;
      return output;
    }
  };
  
  static register(id, callback) {
    $moduler.assert(!(id in this), `Cannot register dialog factory «${id}» because it is already registered on «Std.classes.DialogsFactory.register»`);
    $moduler.assert(typeof callback === "function", `Required parameter «callback» to be function but «${typeof callback}» was found instead on «Std.classes.DialogsFactory.register»`);
    this[id] = callback;
  }

  static unregister(id) {
    $moduler.assert(id in this, `Cannot unregister dialog factory «${id}» because it is not registered on «Std.classes.DialogsFactory.unregister»`);
    delete this[id];
  }

  static confirm(text, optionsBrute = {}) {
    const options = Object.assign({}, this.utils.defaultOptions1, {
      size: "small",
      layout: "centered",
    }, optionsBrute);
    const dialogConfig = {};
    Set_dialog_config_for_confirm: {
      const { yes: _yes, no: _no, default: _default } = this.utils.cleanDefaultOptions1(options);
      dialogConfig.template = `<div class="pad_4">
        <div>${text}</div>
      </div>`;
      dialogConfig.buttons = `${_yes}@@accept|${_no}@@close`;
      Object.assign(dialogConfig, options);
    }
    return Std.classes.Dialogs.answer(dialogConfig);
    
  }

  static input(text, optionsBrute = {}) {
    const options = Object.assign({}, this.utils.defaultOptions1, {
      layout: "centered",
      size: "small",
    }, optionsBrute);
    const dialogConfig = {};
    Set_dialog_config_for_input: {
      const { yes: _yes, no: _no, default: _default } = this.utils.cleanDefaultOptions1(options);
      dialogConfig.template = `<div class="pad_4">
        <div>${text}</div>
        <div>
          <input type="text" v-model="value" />
        </div>
      </div>`;
      dialogConfig.data = {value:options.default};
      dialogConfig.buttons = `${_yes}=value|${_no}@@close`;
      Object.assign(dialogConfig, options);
    }
    return Std.classes.Dialogs.answer(dialogConfig);

  }

  static textarea(text, optionsBrute = {}) {
    const options = Object.assign({}, this.utils.defaultOptions1, {
      layout: "scrollable",
      size: "medium-small",
    }, optionsBrute);
    const dialogConfig = {};
    Set_dialog_config_for_textarea: {
      const { yes: _yes, no: _no, default: _default } = this.utils.cleanDefaultOptions1(options);
      dialogConfig.template = `<div class="pad_4">
        <div>${text}</div>
        <div>
          <textarea v-model="value"></textarea>
        </div>
      </div>`;
      dialogConfig.data = {value:options.default};
      dialogConfig.buttons = `${_yes}=value|${_no}@@close`;
      Object.assign(dialogConfig, options);
    }
    console.log(dialogConfig);
    return Std.classes.Dialogs.answer(dialogConfig);

  }

  static message(text, optionsBrute = {}) {
    const options = Object.assign({}, this.utils.defaultOptions1, {
      size: "small",
      layout: "centered",
    }, optionsBrute);
    const dialogConfig = {};
    Set_dialog_config_for_message: {
      const { yes: _yes, no: _no, default: _default } = this.utils.cleanDefaultOptions1(options);
      dialogConfig.template = `<div class="pad_4">
        <div>${text}</div>
      </div>`;
      dialogConfig.buttons = `${_yes}@@accept`;
      Object.assign(dialogConfig, options);
    }
    return Std.classes.Dialogs.answer(dialogConfig);
  }

  static type(expression, data = undefined, dialogOptions = {}) {
    const options = Object.assign({}, this.utils.defaultOptions1, {
      size: "medium",
      layout: "scrollable",
      formTypeParameters: {
        ast: Std.objects.TypesParser.parse(expression),
        astIndex: [],
        data,
        dataIndex: [],
      },
    }, dialogOptions);
    const dialogConfig = {};
    Set_dialog_config_for_type: {
      const { yes: _yes, no: _no, default: _default } = this.utils.cleanDefaultOptions1(options);
      dialogConfig.template = `<TypesFormNode :params="$options.formTypeParameters" />`;
      dialogConfig.buttons = `${_yes}@@accept`;
      Object.assign(dialogConfig, options);
    }
    return Std.classes.Dialogs.answer(dialogConfig);
  }

  

}