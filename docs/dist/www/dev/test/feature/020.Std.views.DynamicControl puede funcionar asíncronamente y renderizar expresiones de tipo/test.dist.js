module.exports = async function ({ Tester }) {

  return "Retiramos este test por de momento este componente ser mejor no usado";

  const { dialog, promise } = await Std.classes.Dialogs.open({
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
    size: "medium",
    statusBar: [{ text: "Que eta asiendo tu" }],
  });



}