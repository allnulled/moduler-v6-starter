# 20/10/2026

## Resultado

- [x] Std.interfaces.IntrospectorInterface
   - [x] permite delete
- [x] Std.functions.IntrospectableInterfaceFactory
   - [x] acepta onRegisterName y onUnregisterName
   - [x] acepta deleteName
   - [x] usa Std.functions.triggerMethodIfExists para registrar (set y initialiaze) y desregistrar (delete)
- [x] Std.classes.ViewsRegistry.globalInstance
   - [x] que hookea los onRegister/onUnregister para meter y sacar de Vue2

## Proceso

- [ ] ChangeableView
   - [ ] Permitiría <ChangeableView :from="{template:'...'}" />
   - [ ] Permitiría this.changeTo({ template: "ok" })
   - [ ] Permitiría this.closeView()
   - [ ] El name es opcionalmente sobreescribible
      - [ ] Pero si no polifilea con randomizer y al terminar, desregistra
      - [ ] Si se le pasa un name específico no desregistra
      - [ ] Así que no es Anonymous View, solo lo es cuando polyfilea el name con randomizer
         - [ ] Pero sí es ChangeableView porque soporta la feature de cambiar según el estado que se le pase a otra vista



- [x] ViewsRegistry
   - [x] Requiere de una expansión de Registry Interface
      - [x] Debe hacer un triggerCallbackIfExists para:
         - [x] .onRegisterView
         - [x] .onUnregisterView
      - [x] De esta forma:
         - [x] un register en ViewsRegistry implica Vue.component
         - [x] un unregister en ViewsRegistry implica delete Vue.options.component
- [ ] Threads
   - [ ] En lugar de procesos
   - [ ] Debe de poder hacer:
      - [ ] Thread.prototype.children = Array
      - [ ] Thread.prototype.isClosed = Boolean
      - [ ] Thread.prototype.close = Function
   - [ ] Todo partiría de un Std.classes.Thread.globalInstance

@CHATGPT: Estamos aquí.

- [ ] Dialogs
   - [ ] Es un espejo de Thread para la interfaz, un ThreadsView
   - [ ] Debe poder hacer:
      - [ ] Dialog.prototype.thread
      - [ ] Dialog.prototype.close
      - [ ] Dialog.prototype.view === VueComponent
      - [ ] Dialog.abstraction.view === VueComponent
      - [ ] Dialog.abstraction.view.prototype.$dialog === Dialog

Dialogs.open({
  class: "success_background",
  head: `Questionario de nosequé`,
  body: `Hola! Este contenido sí es scrolleable`,
  // El foot es diferente, permite string, pero también permite esto:
  foot: [
    {type:"space", flex: 100},
    {type:"button", flex: 1, text: "Accept", click: function() {}, class: "danger_background" },
    {type:"button", flex: 1, text: "Cancel", click: function() {}, class: "default_background" },
  ],
  methods: {},
  watch: {},
  created: function() {},
  mounted: function() {},
  unmounted: function() {},
})

Este método crearía un nuevo componente vía VolatileView + un adaptador del input a componente vue2.

@CHATGPT: Pero partiríamos de aquí.

- [ ] VolatileView
   - [ ] Para crear vistas al vuelo
   - [ ] Lo necesita dialogs para poder inyectar sus propias vistas al vuelo en cada diálogo
   - [ ] Poder hacer:
      - [ ] `<VolatileView :from="{name,template,data,created,mounted,methods,watch,...}" />`
   - [ ] Con esto desbloqueamos DialogsPortView
      - [ ] El loop que itera en Thread.globalInstance.children
      - [ ] Para que pueda recibir toda la especificación de componente vue a través de un método para crear el Dialog

@CHATGPT: Y tendríamos que pasar por aquí:

- [ ] ViewsMerger.mergeViews
   - [ ] Lo necesita Dialogs.open para mezclar:
      - [ ] en la definición de las VolatileView
      - [ ] la base de API de diálogo
         - [ ] cancel: lo usa el diálogo para resolve(undefined)
         - [ ] accept: lo usa el diálogo para resolve(this.value)
      - [ ] la base de API que el usuario aporta del diálogo
         - [ ] métodos que quiera aportar al nuevo VolatileView (además de la API de diálogos anterior)


- [ ] TesterView
   - [ ] Pero ahora no, más adelante