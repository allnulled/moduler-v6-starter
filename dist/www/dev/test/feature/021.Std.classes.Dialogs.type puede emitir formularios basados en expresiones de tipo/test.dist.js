module.exports = async function ({ Tester }) {

  const tests = {
    "1": `{name:string}`,
    "2": `{name:string|null|undefined}&{age?:number}`,
    "3": `{city?:string,gender?:boolean}`,
    "4": `{list:[{city?:string,gender?:boolean}*]}`,
    "5": `{code:number|string|null|undefined}&{conduct:string|undefined}`,
    "6": `class {code:number|string|null|undefined}&{conduct:string|undefined}`,
    "7": `function (@name string) => class {code:number|string|null|undefined}&{conduct:string|undefined}`,
    "8": `{code:number|string|null|undefined}&{conduct:string|undefined}&{hobbies:[string*]}`,
    // "8": `[@message+]`,
  };
  tests.last = tests[Object.keys(tests).at(-1)];

  await Std.classes.Dialogs.type(tests["last"], {}, {
    title: "Probando el Dialogs.type",
    data: {},
    methods: {},
    buttons: "Aceptar@@accept|Cancelar@@close|Enviar a revisar@sendToReview|Retornar el valor=value",
    layout: "scrollable",
    size: "medium",
    statusBar: [{ text: "Aquí renderizamos directamente una expresión de tipo" }],
  });

}