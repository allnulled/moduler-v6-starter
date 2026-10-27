module.exports = async function ({ Tester }) {

  const { DynamicView, Timeout, Domer } = Std.all;

  await Timeout.of(10);

  const dynamicElement = Domer.first(".DynamicView");
  const dynamicView = dynamicElement.getVueComponent();
  
  return;

  if(!dynamicView) {
    console.log("[!] Se necesita un DynamicView en la página mínimo para completar el test de DynamicView.");
    return;
  }

  dynamicView.setView({ template: "<div>{{msg}}</div>", props: { msg:{ type: String } } }, { msg: "OKKKK, o no?" });

  for(let index=0; index<4; index++) {
    const randomSentence = Std.all.Randomizer.getRandomSentence();
    await dynamicView.setHtml(`<div>${randomSentence}</div>`);
    $moduler.assert(dynamicView.$el.textContent.trim() === randomSentence, `DynamicView content should mutate to specifications (${index})`);
    await Timeout.of(1 * 10);
  }

};