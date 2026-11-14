module.exports = async function ({ Tester }) {

  const { ContextualView, Timeout, Domer } = Std.all;

  // await Timeout.of(10);

  const contextualElement = Domer.first(".ContextualView");
  if(!contextualElement) return console.log("[!] Omitted test for ContextualView");
  const contextualView = contextualElement.getVueComponent();

  (globalThis.ctxview = contextualView).resetContext({ template: "<div>{{msg}}</div>", props: { msg:{ type: String } } }, { msg: "OKKKK, o no?" });

  for(let index=0; index<4; index++) {
    const randomSentence = Std.all.Randomizer.getRandomSentence();
    await contextualView.addContext({ template: `<div>${randomSentence}</div>` });
    // $moduler.assert(contextualView.$el.textContent.trim() === randomSentence, `ContextualView content should mutate to specifications (${index})`);
    // await Timeout.of(2 * 1000);
  }

};