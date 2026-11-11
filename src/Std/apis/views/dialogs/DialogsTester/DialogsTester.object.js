Std.classes.ViewsRegistry.$.set("DialogsTester", {
  name: "DialogsTester",
  template: $compiler.inject.string("@/src/Std/apis/views/dialogs/DialogsTester/DialogsTester.view.html"),
  data() {
    return {
      code: `{
        template: \`<div>
          <LoremIpsum :paragraphs="20" />
        </div>\`,
        size: 'small',
        layout: 'scrollable',
        buttons: 'Aceptar@@accept|Cancelar@@close',
        statusBar: [{
            text: "Estás contestando una pregunta suelta.",
        }]
      }`,
      childOf: undefined,
    };
  },
  computed: {
    currentDialogs() {
      return Std.objects.GlobalDialog.port.currentDialogs;
    },
  },
  methods: {
    runDialog() {
      return (new Function("return Std.classes.Dialogs.$.open(" + this.code + ");")).call();
    },
    openDialog(size) {
      return (new Function(`return Std.classes.Dialogs.$.open(Object.assign(${ this.code }, { size: "${size}" }))`)).call();
    }
  },
});