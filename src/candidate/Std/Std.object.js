(function () {

  /**@:
   * 
   * # Std global object
   * 
   * - Type: object
   * - Global: yes
   * - Properties:
   *    - all:Object
   *    - objects:Object
   *    - functions:Object
   *    - traits:Object
   *    - interfaces:Object
   *    - classes:Object
   *    - parsers:Object
   *    - types:Object
   * - Loads:
   *    - Wave 0: native extensions
   *    - Wave 1: elemental funcions, clases and interfaces
   *    - Wave 2: utility interfaces
   *    - Wave 3: utility classes
   *    - Wave 4: core of types
   *    - Wave 5: filesystem
   *    - Wave 6: ...
   * - 
   * 
   */
  
  globalThis.Std = {};
  
  Object.assign(Std, {
    all: {},
    objects: {},
    functions: {},
    traits: {},
    interfaces: {},
    classes: {},
    parsers: {
      peggy: peggyjs,
    },
    types: {},
  });
  
  Wave_0_Native_extensions_and_dependencies: {
    Std.all.ErrorStackFrame = Std.classes.ErrorStackFrame = $compiler.inject.source("./apis/errors/ErrorDissector/ErrorStackFrame.external.js");
    Std.all.ErrorStackParser = Std.classes.ErrorStackParser = $compiler.inject.source("./apis/errors/ErrorDissector/ErrorStackParser.external.js");
    Std.all.ErrorDissector = Std.classes.ErrorDissector = $compiler.inject.source("./apis/errors/ErrorDissector/ErrorDissector.class.js");
    Std.all.ErrorProsecutor = Std.classes.ErrorProsecutor = $compiler.inject.source("./apis/errors/ErrorProsecutor/ErrorProsecutor.class.js");
    Std.all.ErrorUtils = Std.classes.ErrorUtils = $compiler.inject.source("./apis/errors/ErrorUtils/ErrorUtils.class.js");
    Std.all.ErrorExtension = $compiler.inject.source("./apis/errors/Error/Error.extension.js");
  }

  Wave_1_Elemental_functions_classes_and_interfaces: {
    Std.assert = Std.all.assert = Std.functions.assert = $compiler.inject.source("./assert.function.js");
    Std.all.NativePrototypes = Std.objects.NativePrototypes = $compiler.inject.source("./apis/reflection/NativePrototypes/NativePrototypes.object.js");
    Std.all.EnvironmenterInterface = Std.interfaces.EnvironmenterInterface = $compiler.inject.source("./apis/environment/Environmenter/EnvironmenterInterface.interface.js");
    Std.all.Environmenter = Std.classes.Environmenter = $compiler.inject.source("./apis/environment/Environmenter/Environmenter.class.js");
    Std.all.Printer = Std.functions.Printer = $compiler.inject.source("./apis/debug/Printer.class.js");
    Std.all.triggerMethodIfExists = Std.functions.triggerMethodIfExists = $compiler.inject.source("./apis/hooks/triggerMethodIfExists.function.js");
    Std.all.Ansi = Std.objects.Ansi = $compiler.inject.source("./apis/console/Ansi/Ansi.object.js");
    Std.all.CreableInterface = Std.interfaces.CreableInterface = $compiler.inject.source("./apis/patterns/CreableInterface/CreableInterface.interface.js");
    Std.all.ClonableInterface = Std.interfaces.ClonableInterface = $compiler.inject.source("./apis/patterns/ClonableInterface/ClonableInterface.interface.js");
    Std.all.ConfigurableInterface = Std.interfaces.ConfigurableInterface = $compiler.inject.source("./apis/patterns/ConfigurableInterface/ConfigurableInterface.interface.js");
    Std.all.InstantiableInterface = Std.interfaces.InstantiableInterface = $compiler.inject.source("./apis/patterns/InstantiableInterface/InstantiableInterface.interface.js");
    Std.all.BooleanUtil = Std.classes.BooleanUtil = $compiler.inject.source("./apis/testing/BooleanUtil/BooleanUtil.class.js");
    Std.all.ObjectReflector = Std.classes.ObjectReflector = $compiler.inject.source("./apis/reflection/ObjectReflector/ObjectReflector.class.js");
    Std.all.FunctionReflector = Std.classes.FunctionReflector = $compiler.inject.source("./apis/reflection/FunctionReflector/FunctionReflector.class.js");
    Std.all.ClassReflector = Std.classes.ClassReflector = $compiler.inject.source("./apis/reflection/ClassReflector/ClassReflector.class.js");
  }
  Wave_2_Utility_interfaces: {
    Std.all.IntrospectorInterface = Std.interfaces.IntrospectorInterface = $compiler.inject.source("./apis/reflection/Introspector/IntrospectorInterface.interface.js");
    Std.all.IntrospectableInterfaceFactory = Std.interfaces.IntrospectableInterfaceFactory = $compiler.inject.source("./apis/reflection/Introspector/IntrospectableInterfaceFactory.interface.js");
    Std.all.RunnableInterface = Std.interfaces.RunnableInterface = $compiler.inject.source("./apis/patterns/RunnableInterface/RunnableInterface.interface.js");
    Std.all.TracerInterface = Std.interfaces.TracerInterface = $compiler.inject.source("./apis/testing/Tracer/TracerInterface.interface.js");
    Std.all.CheckerInterface = Std.interfaces.CheckerInterface = $compiler.inject.source("./apis/testing/Checker/CheckerInterface.interface.js");
    Std.all.AsserterInterface = Std.interfaces.AsserterInterface = $compiler.inject.source("./apis/testing/Asserter/AsserterInterface.interface.js");
    Std.all.TesterInterface = Std.interfaces.TesterInterface = $compiler.inject.source("./apis/testing/Tester/TesterInterface.interface.js");
    Std.all.PropertiesMergerInterface = Std.interfaces.PropertiesMergerInterface = $compiler.inject.source("./apis/merge/PropertiesMerger/PropertiesMergerInterface.interface.js");
    Std.all.UrlerInterface = Std.interfaces.UrlerInterface = $compiler.inject.source("./apis/urls/Urler/UrlerInterface.interface.js");
    Std.all.ValidationStepInterface = Std.interfaces.ValidationStepInterface = $compiler.inject.source("./apis/validation/ValidationStep/ValidationStepInterface.interface.js");
    Std.all.ValidationStateInterface = Std.interfaces.ValidationStateInterface = $compiler.inject.source("./apis/validation/ValidationState/ValidationStateInterface.interface.js");
    Std.all.ValidationResultInterface = Std.interfaces.ValidationResultInterface = $compiler.inject.source("./apis/validation/ValidationResult/ValidationResultInterface.interface.js");
    Std.all.TypesValidatorInterface = Std.interfaces.TypesValidatorInterface = $compiler.inject.source("./apis/types/TypesValidator/TypesValidatorInterface.interface.js");
    Std.all.TypesCatalogInterface = Std.interfaces.TypesCatalogInterface = $compiler.inject.source("./apis/types/TypesCatalog/TypesCatalogInterface.interface.js");
    Std.all.ProgresserInterface = Std.interfaces.ProgresserInterface = $compiler.inject.source("./apis/debug/Progresser/ProgresserInterface.interface.js");
  }
  Wave_3_Utility_classes: {
    Std.all.Introspector = Std.classes.Introspector = $compiler.inject.source("./apis/reflection/Introspector/Introspector.class.js");
    Std.all.Urler = Std.classes.Urler = $compiler.inject.source("./apis/urls/Urler/Urler.class.js");
    Std.all.Tracer = Std.classes.Tracer = $compiler.inject.source("./apis/testing/Tracer/Tracer.class.js");
    Std.all.Checker = Std.classes.Checker = $compiler.inject.source("./apis/testing/Checker/Checker.class.js");
    Std.all.Asserter = Std.classes.Asserter = $compiler.inject.source("./apis/testing/Asserter/Asserter.class.js");
    Std.all.PropertiesMerger = Std.classes.PropertiesMerger = $compiler.inject.source("./apis/merge/PropertiesMerger/PropertiesMerger.class.js");
    Std.all.Tester = Std.classes.Tester = $compiler.inject.source("./apis/testing/Tester/Tester.class.js");
    Std.all.Progresser = Std.classes.Progresser = $compiler.inject.source("./apis/debug/Progresser/Progresser.class.js");
  }
  Wave_4_Types_system: {
    Std.all.BasicTypes = Std.objects.BasicTypes = $compiler.inject.source("./apis/types/BasicTypes/BasicTypes.object.js");
    Std.all.TypesParser = Std.classes.TypesParser = $compiler.inject.source("./apis/types/TypesParser/TypesParser.object.js");
    Std.all.ValidationStep = Std.classes.ValidationStep = $compiler.inject.source("./apis/validation/ValidationStep/ValidationStep.class.js");
    Std.all.ValidationState = Std.classes.ValidationState = $compiler.inject.source("./apis/validation/ValidationState/ValidationState.class.js");
    Std.all.ValidationResult = Std.classes.ValidationResult = $compiler.inject.source("./apis/validation/ValidationResult/ValidationResult.class.js");
    Std.all.TypesValidator = Std.classes.TypesValidator = $compiler.inject.source("./apis/types/TypesValidator/TypesValidator.class.js");
    Std.all.TypesCatalog = Std.classes.TypesCatalog = $compiler.inject.source("./apis/types/TypesCatalog/TypesCatalog.class.js");
    Std.all.Domer = Std.classes.Domer = $compiler.inject.source("./apis/dom/Domer/Domer.class.js");
  }
  Wave_5_Filesystem: {

  }




  return Std;

})()