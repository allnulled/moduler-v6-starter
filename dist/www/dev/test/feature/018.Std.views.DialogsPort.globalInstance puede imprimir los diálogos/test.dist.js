module.exports = async function ({ Tester }) {

  const { Dialogs, Timeout, Domer } = Std.all;

  // await Timeout.of(100);

  setTimeout(() => {
    console.clear();
    console.log("CALCULADORA ===========");
    const _ = {
      "small": {
        width: 0.35,
        minWidth: 320,
        maxWidth: 440,
        height: null,
        maxHeight: 0.75,
        minHeight: 0.2,
      },
      "medium": {
        width: 0.60,
        minWidth: 480,
        maxWidth: 820,
        height: 0.78,
        minHeight: 0.5,
      },
      "big": {
        width: 0.88,
        minWidth: 640,
        maxWidth: 1440,
        height: 0.90,
        minHeight: 0.7,
      },
      "medium-small": {
        width: 0.475,
        minWidth: 400,
        maxWidth: 630,
        height: 0.39,
        minHeight: 0.35,
      },
      "medium-big": {
        width: 0.74,
        minWidth: 560,
        maxWidth: 1130,
        height: 0.84,
        minHeight: 0.6
      },
    };
    let out = "";
    out += `{\n  "medium-small": {\n    width: ${(_.medium.width + _.small.width) / 2},\n`;
    out += `    minWidth: ${(_.medium.minWidth + _.small.minWidth) / 2},\n`;
    out += `    maxWidth: ${(_.medium.maxWidth + _.small.maxWidth) / 2},\n`;
    out += `    height: ${(_.medium.height + _.small.height) / 2},\n`;
    out += `    maxHeight: ${(_.medium.maxHeight + _.small.maxHeight) / 2},\n`;
    out += `    minHeight: ${(_.medium.minHeight + _.small.minHeight) / 2},\n`;
    out += `  },\n  "medium-big": {\n    width: ${(_.medium.width + _.big.width) / 2},\n`;
    out += `    minWidth: ${(_.medium.minWidth + _.big.minWidth) / 2},\n`;
    out += `    maxWidth: ${(_.medium.maxWidth + _.big.maxWidth) / 2},\n`;
    out += `    height: ${(_.medium.height + _.big.height) / 2},\n`;
    out += `    maxHeight: ${(_.medium.maxHeight + _.big.maxHeight) / 2},\n`;
    out += `    minHeight: ${(_.medium.minHeight + _.big.minHeight) / 2}\n`;
    out += `  }\n`;
    out += `}`;
    console.log(out);
  }, 1000);

  const contextualElement = Domer.first(".DialogsPort");
  const contextualView = contextualElement.getVueComponent();

  if (!contextualView) {
    console.log("[!] Se necesita un DialogsPort en la página mínimo para completar el test de DialogsPort.");
    return;
  }

  Titulo_se_muestra: { }
  Status_bar_puede_mutarse_en_runtime: { }
  Buttons_permite_cerrar_dialogo: { }
  Data_objetual_funciona_bien: { }
  Metodo_answer_para_abreviar_al_open: { }

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
    const testerDialog = await Std.classes.Dialogs.$.port.open({
      title: "Testeo de diálogos",
      template: "<DialogsTester/>",
    });
    const value = await promise;
    console.log(value);
    console.log(value);
    console.log(value);
    console.log(value);
    console.log(value);
    console.log(value);
  }

};