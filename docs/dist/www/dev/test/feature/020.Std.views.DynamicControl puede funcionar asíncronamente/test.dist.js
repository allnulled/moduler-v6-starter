module.exports = async function ({ Tester }) {

  await Std.classes.Dialogs.$.open({
    template: `<DynamicControl :parameters='$options.static' />`,
    static: {
      controlOf: "LoremIpsum",
      ast: Std.objects.TypesParser.parse('{name:string}'),
      data: {},
    },
    data: {},
    methods: {},
    buttons: "Aceptar@@accept|Cancelar@@close|Enviar a revisar@sendToReview|Retornar el valor=value",
    layout: "scrollable",
    size: "maximized",
    statusBar: [{ text: "Que eta asiendo tu" }],
  });

}