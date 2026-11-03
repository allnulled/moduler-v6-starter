# API de Diálogos de Std

## La global principal

```js
assert(Std.classes.Dialogs.$ === Std.classes.Dialogs.globalInstance);
```

## El funcionamiento típico

```js
const {
    dialog, // El DialogView que es un Vue
    accept, // Función para cerrar el diálogo (con valor personalizable)
    close, // Función para cerrar el diálogo (devuelve null)
    config, // Parámetros iniciales
    promise, // Promesa que devuelve el valor del diálogo
    thread, // Hilo correspondiente al diálogo
} = await Std.classes.Dialogs.$.open({
    title: "Título del diálogo",
    template: "Tu nombre: <input v-model='value' />",
    data: { value: "" },
    buttons: [{
        text: "Aceptar",
        click: (event, dialog) => {
            return dialog.accept(dialog.getContent().value);
        },
    }],
    buttons: {
        Aceptar: (event, dialog) => {
            return dialog.accept(dialog.getContent().value);
        },
        Cancelar: (event, dialog) => {
            return dialog.close();
        },
    },
    buttons: Std.views.DialogView.static.buttons.ACCEPT_OR_CANCEL,
    statusBar: [{
        text: "Todo OK.",
        flex: 1,
    }, {
        html: "De momento todo ok, parece.",
        flex: 100,
    }],
});
```