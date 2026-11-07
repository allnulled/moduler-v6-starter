
# ~~Permitir la uniqueActionId~~

- ~~Que funcione con el openDialogsTree~~

# ~~Mapear contenido de las barras de abajo~~

- ~~Permitirlo con parámetros de dialogo~~
   - ~~Compartidos con thread, cuidado ahí, en principio no pasa nada porque se eliminan a la par~~
   - ~~el parámetro es: `@statusBar [{name:string,text?:string,html?:string,flex:number}*]`~~
- ~~Permitir etiquetas para cada caja~~
- ~~Permitir recuperar las cajas según etiqueta~~
- ~~Permitir que el contenido de cada caja se pueda cambiar en runtime~~

```js
Std.classes.Dialogs.$.open({
    template: "Are you ok?",
    statusBar: [{
        name: "General status box",
        text: "All good",
        flex: 1,
    }, {
        name: "Specific status 1 box",
        html: "<div>Here can go widgets too</div>",
        flex: 100,
    }]
});
```

# ~~Mapear contenido de los botones de abajo del diálogo:~~

- ~~Permitir que se puedan mapear fácil:~~
   - ~~Sin usar botones~~
   - ~~Con botones mediante array de objetos~~
   - ~~Con botones mediante 1 objeto~~
   - ~~Con botones mediante constantes de DialogView.static.buttons.ACCEPT|CANCEL|ACCEPT_OR_CANCEL~~


# Permitir un size que contemple:

- Std.views.Dialogs.sizes.SMALL
- Std.views.Dialogs.sizes.MEDIUM
- Std.views.Dialogs.sizes.BIG
- Std.views.Dialogs.sizes.FULLSCREEN (maximized)

# Permitir un layout que, paralelamente, contemple:

- Std.views.Dialogs.layouts.CENTERED
- Std.views.Dialogs.layouts.SCROLLABLE

```js
Std.classes.Dialogs.$.open({
    template: "Are you ok?",
    buttons: ["ok"],
    buttons: ["accept", "cancel"]
    buttons: [{
        text: "Yes",
        class: "clue_success",
        click: () => console.log("Yep"),
    }, {
        text: "No",
        class: "clue_danger",
        click: () => console.log("Nup"),
    }]
});
```

# Adaptar las vistas para móvil

- Que se vean siempre maximizados los diálogos
- Que el DialogsPortButton se ponga sobre del teclado en el móvil 