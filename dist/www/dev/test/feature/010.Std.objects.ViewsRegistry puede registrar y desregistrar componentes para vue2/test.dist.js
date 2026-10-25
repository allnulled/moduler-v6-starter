module.exports = async function ({ Tester }) {

  const {
    ViewsRegistry,
  } = Std.all;

  const allViewNames = Object.keys(ViewsRegistry.globalInstance.list());

  $moduler.assert(allViewNames.length !== 0, "ViewsRegistry.globalInstance should not be empty");

  for(let index=0; index<allViewNames.length; index++) {
    const viewName = allViewNames[index];
    $moduler.assert(viewName in Std.externals.Vue2.options.components, `View named «${viewName}» is not defined as Vue component`);
  }

  console.log(allViewNames);

};