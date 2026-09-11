module.exports = $moduler.export("#Std", function () {
  $compiler.inject.source("./extensions.Error.js");
  const Std = $compiler.inject.source("./Std.function.js");
  Object.assign(Std, {
    // 1. Resources:
    all: {},
    splitter: $compiler.inject.source("./property.splitter.js"),
    of: $compiler.inject.source("./function.of.js"),
  });
  Object.assign(Std, $compiler.inject.source("./object.LowLevelCategories.js"));
  Object.assign(Std.all, {
    mixProperties: Std.functions.mixProperties = $compiler.inject.source("./functions/mixProperties/mixProperties.function.js"),
    simplestAssert: Std.functions.simplestAssert = $compiler.inject.source("./functions/simplestAssert/simplestAssert.function.js"),
    triggerMethodIfExists: Std.functions.triggerMethodIfExists = $compiler.inject.source("./functions/triggerMethodIfExists/triggerMethodIfExists.function.js"),
    createIsolationCatcher: Std.functions.createIsolationCatcher = $compiler.inject.source("./functions/createIsolationCatcher/createIsolationCatcher.function.js"),
    renderSimpleTemplate: Std.functions.renderSimpleTemplate = $compiler.inject.source("./functions/renderSimpleTemplate/renderSimpleTemplate.function.js"),
  });
  Object.assign(Std.all, {
    StringUtil: Std.objects.StringUtil = $compiler.inject.source("./objects/StringUtil/StringUtil.object.js"),
  });
  Object.assign(Std.all, {
    Newable: Std.descriptors.Newable = $compiler.inject.source("./descriptors/Newable/Newable.descriptor.js"),
    Pidable: Std.descriptors.Pidable = $compiler.inject.source("./descriptors/Pidable/Pidable.descriptor.js"),
    NewSubprocessable: Std.descriptors.NewSubprocessable = $compiler.inject.source("./descriptors/NewSubprocessable/NewSubprocessable.descriptor.js"),
    Configurable: Std.traits.Configurable = $compiler.inject.source("./traits/Configurable/Configurable.object.js"),
    Creable: Std.traits.Creable = $compiler.inject.source("./traits/Creable/Creable.object.js"),
    Clonable: Std.traits.Clonable = $compiler.inject.source("./traits/Clonable/Clonable.object.js"),
  });
  Object.assign(Std.all, {
    ClassSkiller: Std.classes.ClassSkiller = $compiler.inject.source("./classes/ClassSkiller/ClassSkiller.class.js"),
  });
  Object.assign(Std.all, {
    EmptyConstructor: Std.interfaces.EmptyConstructor = $compiler.inject.source("./interfaces/EmptyConstructor/EmptyConstructor.interface.js")
  })
  Object.assign(Std.all, {
    Runnable: Std.traits.Runnable = $compiler.inject.source("./traits/Runnable/Runnable.object.js"), // Compuestas por: Creable, Configurable, Clonable, etc...
    Environmenter: Std.classes.Creable = $compiler.inject.source("./classes/Environmenter/Environmenter.class.js"),
    Ansi: Std.classes.Ansi = $compiler.inject.source("./classes/Ansi/Ansi.class.js"),
    Checker: Std.classes.Checker = $compiler.inject.source("./classes/Checker/Checker.class.js"),
    Asserter: Std.classes.Asserter = $compiler.inject.source("./classes/Asserter/Asserter.class.js"),
    Validator: Std.classes.Validator = $compiler.inject.source("./classes/Validator/Validator.class.js"),
    PathResolver: Std.classes.PathResolver = $compiler.inject.source("./classes/PathResolver/PathResolver.class.js"),
  });
  Object.assign(Std.all, {
    Isolation: Std.classes.Isolation = $compiler.inject.source("./classes/Isolation/Isolation.class.js"), // Compuesta por Runnable
    Tracer: Std.classes.Tracer = $compiler.inject.source("./classes/Tracer/Tracer.class.js"),
  });
  Object.assign(Std.all, {
    Process: Std.classes.Process = $compiler.inject.source("./classes/Process/Process.class.js"), // Compuesta de Isolation
  });
  Object.assign(Std.all, {
    Tester: Std.classes.Tester = $compiler.inject.source("./classes/Tester/Tester.class.js"), // Compuesta de Process
  });
  return Std;
});