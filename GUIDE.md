
- Cuando sí corresponde al directorio entero:
   - *.entry.js: el que importa
   - *.class.js: cuando el directorio corresponde a una clase
      - este conecta con el `splittable.<Clase>.class.js`
   - *.object.js: cuando el directorio corresponde a un objeto
   - *.function.js: cuando el directorio corresponde a una función
   - *.trait.js: cuando el directorio corresponde a un trait
      - un trait es un objeto normal, con propiedades, getters y setters
   - *.interface.js: cuando el directorio corresponde a un interfaz
      - una interface es un objeto con «static» y/o «prototype» solamente
   - *.fact.js: cuando el directorio corresponde a un fact
      - un fact es una immediatelly called function
   - *.part.js: cuando el directorio corresponde a un part
      - un part es un script parcial, de una función
- Cuando no corresponde al directorio entero:
   - prototype.*.js: cuando es un miembro prototipo
   - static.*.js: cuando es un miembro estático
   - class.*.js: cuando es una clase
   - function.*.js: cuando es una función
   - object.*.js: cuando es una función
   - trait.*.js: cuando es una función
   - interface.*.js: cuando es una función
   - fact.*.js: cuando es una función
   - part.*.js: cuando es una función
   - member.*.js: cuando es otro tipo de miembro
   - getter.*.js: cuando es un getter
   - setter.*.js: cuando es un setter

# Diálogos

Tienes:

```js
const output = await Std.classes.Dialogs.$.open({
   name: "NombreDelComponenteReusable",
   template: "Puede ir texto directo también: <input v-model='message' />",
   data: { message: "acepta objeto en lugar de factory" },
   uniqueActionId: "Singletoner para diálogos",
   // Botones vía 1: por array de objetos
   buttons: [{
      text: "ok",
      click: (e, dialog) => dialog.accept(dialog.getContent().message),
   }, {
      text: "cancel",
      click: (e, dialog) => dialog.close(),
   }],
   // Botones vía 2: por objeto
   buttons: {
      ok: (e, dialog) => dialog.accept(dialog.getContent().message),
      cancel: (e, dialog) => dialog.close(),
   },
   // Botones vía 3: por constantes
   buttons: Std.classes.DialogView.static.ACCEPT, // YES
   buttons: Std.classes.DialogView.static.CONFIRM, // YES|NO
   buttons: Std.classes.DialogView.static.CONFIRMABLE, // YES|NO|CANCEL
   // Botones vía 4: por texto
   buttons: "Sí|No|Cancelar",
   buttons: "Aceptar=message|Resetear@reset|Cancelar@@close",
   methods: {
      reset() {
         
         }
   }
});

const { dialog, thread, promise, accept, close } = output;
```