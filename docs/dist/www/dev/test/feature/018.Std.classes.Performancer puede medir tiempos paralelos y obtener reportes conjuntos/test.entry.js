module.exports = async function ({ Tester }) {

  const { Dialogs, Timeout, Domer } = Std.all;

  // await Timeout.of(100);

  const contextualElement = Domer.first(".DialogsPort");
  const contextualView = contextualElement.getVueComponent();

  if(!contextualView) {
    console.log("[!] Se necesita un DialogsPort en la página mínimo para completar el test de DialogsPort.");
    return;
  }

  console.log(Dialogs);

  Dialogs.$.open({ template: "<div>Hola</div>"});
  Dialogs.$.open({ template: "<div>Hola</div>"});
  Dialogs.$.open({ template: "<div>Hola</div>"});
  Dialogs.$.open({ template: "<div>Hola</div>"});
  Dialogs.$.open({ template: "<div>Hola</div>"});
  Dialogs.$.open({ template: "<div>Hola</div>"});

};