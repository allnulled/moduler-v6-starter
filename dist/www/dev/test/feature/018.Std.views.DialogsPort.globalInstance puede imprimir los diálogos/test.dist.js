module.exports = async function ({ Tester }) {

  const { Dialogs, Timeout, Domer } = Std.all;

  // await Timeout.of(100);

  const contextualElement = Domer.first(".DialogsPort");
  const contextualView = contextualElement.getVueComponent();

  if (!contextualView) {
    console.log("[!] Se necesita un DialogsPort en la página mínimo para completar el test de DialogsPort.");
    return;
  }

  Titulo_se_muestra: {}
  Status_bar_puede_mutarse_en_runtime: {}
  Buttons_permite_cerrar_dialogo: {}
  Data_objetual_funciona_bien: {}
  Metodo_answer_para_abreviar_al_open: {
    
  }

  Latest_test: {
    const {
      dialog, // El DialogView que es un Vue
      accept, // Función para cerrar el diálogo (con valor personalizable)
      close, // Función para cerrar el diálogo (devuelve null)
      config, // Parámetros iniciales
      promise, // Promesa que devuelve el valor del diálogo
      thread, // Hilo correspondiente al diálogo
    } = await Std.classes.Dialogs.$.open({
      title: "Título del diálogo",
      template: "Tu nombre: <input v-model='identifier' /> Estás diciendo {{ identifier }}",
      data: { identifier: "algo" },
      buttons: [{
        text: "Aceptar",
        class: "success_button",
        click: (event, dialog) => {
          console.log(dialog.getBody());
          dialog.accept(dialog.getContent().identifier);
        },
      }, {
        text: "Cancelar",
        class: "danger_button",
        click: (event, dialog) => {
          dialog.close();
        },
      }],
      statusBar: [{
        name: "s1",
        text: "Todo OK.",
        flex: 1,
      }, {
        name: "s2",
        html: "Barra NO HA cambiado.",
        flex: 100,
      }],
    });
    dialog.getStatusBar("s2").setHtml("La barra se puede cambiar.")
    Std.classes.Dialogs.$.port.openTreeView();
    const value = await promise;
    console.log(value);
    console.log(value);
    console.log(value);
    console.log(value);
    console.log(value);
    console.log(value);
  }

};