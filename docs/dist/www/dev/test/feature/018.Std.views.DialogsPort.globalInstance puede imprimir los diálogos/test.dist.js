module.exports = async function ({ Tester }) {

  const { Dialogs, Timeout, Domer } = Std.all;

  // await Timeout.of(100);

  const contextualElement = Domer.first(".DialogsPort");
  const contextualView = contextualElement.getVueComponent();

  if(!contextualView) {
    console.log("[!] Se necesita un DialogsPort en la página mínimo para completar el test de DialogsPort.");
    return;
  }

  Dialogs.$.open({ template: "<div>Hola 1</div>"});
  Dialogs.$.open({ template: "<div>Hola 2</div>"});
  Dialogs.$.open({ template: "<div>Hola 3</div>"});
  Dialogs.$.open({ template: "<div>Hola 4</div>"});
  Dialogs.$.open({ template: "<div>Hola 5</div>"});
  Dialogs.$.open({ template: "<div>Hola 6</div>"});

};