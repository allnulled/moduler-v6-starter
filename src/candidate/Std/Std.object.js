(function () {

  
  const Std = {};
  
  Object.assign(Std, {
    all: {},
    functions: {},
    traits: {},
    interfaces: {},
    classes: {},
    parsers: {
      peggy: peggyjs,
    }
  });
  
  Std.all.ErrorExtension = $compiler.inject.source("./apis/errors/Error/Error.extension.js");

  Elemental_functions_classes_and_interfaces: {
    Std.assert = Std.all.assert = Std.functions.assert = $compiler.inject.source("./assert.function.js");
    Std.all.triggerMethodIfExists = Std.functions.triggerMethodIfExists = $compiler.inject.source("./apis/hooks/triggerMethodIfExists.function.js");
    Std.all.Ansi = Std.classes.Ansi = $compiler.inject.source("./apis/console/Ansi/Ansi.object.js");
    Std.all.CreableInterface = Std.interfaces.CreableInterface = $compiler.inject.source("./apis/patterns/CreableInterface/CreableInterface.interface.js");
    Std.all.ClonableInterface = Std.interfaces.ClonableInterface = $compiler.inject.source("./apis/patterns/ClonableInterface/ClonableInterface.interface.js");
    Std.all.ConfigurableInterface = Std.interfaces.ConfigurableInterface = $compiler.inject.source("./apis/patterns/ConfigurableInterface/ConfigurableInterface.interface.js");
    Std.all.InstantiableInterface = Std.interfaces.InstantiableInterface = $compiler.inject.source("./apis/patterns/InstantiableInterface/InstantiableInterface.interface.js");
  }
  Utility_interfaces: {
    Std.all.IntrospectorInterface = Std.interfaces.IntrospectorInterface = $compiler.inject.source("./apis/reflection/Introspector/IntrospectorInterface.interface.js");
    Std.all.RunnableInterface = Std.interfaces.RunnableInterface = $compiler.inject.source("./apis/patterns/RunnableInterface/RunnableInterface.interface.js");
    Std.all.EnvironmenterInterface = Std.interfaces.EnvironmenterInterface = $compiler.inject.source("./apis/environment/Environmenter/EnvironmenterInterface.interface.js");
    Std.all.TracerInterface = Std.interfaces.TracerInterface = $compiler.inject.source("./apis/testing/Tracer/TracerInterface.interface.js");
    Std.all.CheckerInterface = Std.interfaces.CheckerInterface = $compiler.inject.source("./apis/testing/Checker/CheckerInterface.interface.js");
    Std.all.AsserterInterface = Std.interfaces.AsserterInterface = $compiler.inject.source("./apis/testing/Asserter/AsserterInterface.interface.js");
    Std.all.TesterInterface = Std.interfaces.TesterInterface = $compiler.inject.source("./apis/testing/Tester/TesterInterface.interface.js");
    Std.all.PropertiesMergerInterface = Std.interfaces.PropertiesMergerInterface = $compiler.inject.source("./apis/merge/PropertiesMerger/PropertiesMergerInterface.interface.js");
    Std.all.UrlerInterface = Std.interfaces.UrlerInterface = $compiler.inject.source("./apis/urls/Urler/UrlerInterface.interface.js");
    Std.all.ValidationResultInterface = Std.interfaces.ValidationResultInterface = $compiler.inject.source("./apis/validation/ValidationResult/ValidationResultInterface.interface.js");
    Std.all.TypesValidatorInterface = Std.interfaces.TypesValidatorInterface = $compiler.inject.source("./apis/types/TypesValidator/TypesValidatorInterface.interface.js");
  }
  Utility_classes: {
    Std.all.Introspector = Std.classes.Introspector = $compiler.inject.source("./apis/reflection/Introspector/Introspector.class.js");
    Std.all.Urler = Std.classes.Urler = $compiler.inject.source("./apis/urls/Urler/Urler.class.js");
    Std.all.Environmenter = Std.classes.Environmenter = $compiler.inject.source("./apis/environment/Environmenter/Environmenter.class.js");
    Std.all.Tracer = Std.classes.Tracer = $compiler.inject.source("./apis/testing/Tracer/Tracer.class.js");
    Std.all.Checker = Std.classes.Checker = $compiler.inject.source("./apis/testing/Checker/Checker.class.js");
    Std.all.Asserter = Std.classes.Asserter = $compiler.inject.source("./apis/testing/Asserter/Asserter.class.js");
    Std.all.PropertiesMerger = Std.classes.PropertiesMerger = $compiler.inject.source("./apis/merge/PropertiesMerger/PropertiesMerger.class.js");
    Std.all.Tester = Std.classes.Tester = $compiler.inject.source("./apis/testing/Tester/Tester.class.js");
    Std.all.TypesParser = Std.classes.TypesParser = $compiler.inject.source("./apis/types/TypesParser/TypesParser.object.js");
    Std.all.ValidationResult = Std.classes.ValidationResult = $compiler.inject.source("./apis/validation/ValidationResult/ValidationResult.class.js");
    Std.all.TypesValidator = Std.classes.TypesValidator = $compiler.inject.source("./apis/types/TypesValidator/TypesValidator.class.js");
  }

  return Std;

})()