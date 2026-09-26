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
   * - ...
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
      picomatch: picomatch
    },
    types: {},
    externals: {
      peggy: peggyjs,
      picomatch: picomatch,
    }
  });

  
  Wave_1_Lowest_interfaces_only: {
    Std.all.CreableInterface = Std.interfaces.CreableInterface = $compiler.inject.source("./apis/patterns/CreableInterface/CreableInterface.interface.js");
    Std.all.ClonableInterface = Std.interfaces.ClonableInterface = $compiler.inject.source("./apis/patterns/ClonableInterface/ClonableInterface.interface.js");
    Std.all.ConfigurableInterface = Std.interfaces.ConfigurableInterface = $compiler.inject.source("./apis/patterns/ConfigurableInterface/ConfigurableInterface.interface.js");
    Std.all.InstantiableInterface = Std.interfaces.InstantiableInterface = $compiler.inject.source("./apis/patterns/InstantiableInterface/InstantiableInterface.interface.js");
  }
  
  Wave_2_Native_extensions_and_dependencies: {
    $compiler.inject.source("./apis/errors/Error.extension/Error.extension.entry.js");
  }
  
  Wave_3_Elemental_functions_classes_and_interfaces: {
    Std.assert = Std.all.assert = Std.functions.assert = $compiler.inject.source("./assert.function.js");
    Std.all.trifyAsync = Std.functions.trifyAsync = $compiler.inject.source("./apis/errors/trifyAsync/trifyAsync.function.js");
    Std.all.TrySyncProxy = Std.classes.TrySyncProxy = $compiler.inject.source("./apis/errors/TrySyncProxy/TrySyncProxy.class.js");
    Std.all.TryAsyncProxy = Std.classes.TryAsyncProxy = $compiler.inject.source("./apis/errors/TryAsyncProxy/TryAsyncProxy.class.js");
    Std.all.TryableInterface = Std.interfaces.TryableInterface = $compiler.inject.source("./apis/patterns/TryableInterface/TryableInterface.interface.js");
    Std.all.JsonStringifier = Std.classes.JsonStringifier = $compiler.inject.source("./apis/json/JsonStringifier/JsonStringifier.class.js");
    Std.all.NativePrototypes = Std.objects.NativePrototypes = $compiler.inject.source("./apis/reflection/NativePrototypes/NativePrototypes.object.js");
    Std.all.EnvironmenterInterface = Std.interfaces.EnvironmenterInterface = $compiler.inject.source("./apis/environment/Environmenter/EnvironmenterInterface.interface.js");
    Std.all.Environmenter = Std.classes.Environmenter = $compiler.inject.source("./apis/environment/Environmenter/Environmenter.class.js");
    Std.all.Printer = Std.functions.Printer = $compiler.inject.source("./apis/debug/Printer.class.js");
    Std.all.triggerMethodIfExists = Std.functions.triggerMethodIfExists = $compiler.inject.source("./apis/hooks/triggerMethodIfExists.function.js");
    Std.all.Ansi = Std.objects.Ansi = $compiler.inject.source("./apis/console/Ansi/Ansi.object.js");
    Std.all.BooleanUtil = Std.classes.BooleanUtil = $compiler.inject.source("./apis/testing/BooleanUtil/BooleanUtil.class.js");
    Std.all.ObjectReflector = Std.classes.ObjectReflector = $compiler.inject.source("./apis/reflection/ObjectReflector/ObjectReflector.class.js");
    Std.all.FunctionReflector = Std.classes.FunctionReflector = $compiler.inject.source("./apis/reflection/FunctionReflector/FunctionReflector.class.js");
    Std.all.ClassReflector = Std.classes.ClassReflector = $compiler.inject.source("./apis/reflection/ClassReflector/ClassReflector.class.js");
  }
  Wave_4_Utility_interfaces: {
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
    Std.all.BasedirInterface = Std.interfaces.BasedirInterface = $compiler.inject.source("./apis/files/Basedir/BasedirInterface.interface.js");
  }
  Wave_5_Utility_classes: {
    Std.all.Basedir = Std.classes.Basedir = $compiler.inject.source("./apis/files/Basedir/Basedir.class.js");
    Std.all.Introspector = Std.classes.Introspector = $compiler.inject.source("./apis/reflection/Introspector/Introspector.class.js");
    Std.all.Urler = Std.classes.Urler = $compiler.inject.source("./apis/urls/Urler/Urler.class.js");
    Std.all.Tracer = Std.classes.Tracer = $compiler.inject.source("./apis/testing/Tracer/Tracer.class.js");
    Std.all.Checker = Std.classes.Checker = $compiler.inject.source("./apis/testing/Checker/Checker.class.js");
    Std.all.Asserter = Std.classes.Asserter = $compiler.inject.source("./apis/testing/Asserter/Asserter.class.js");
    Std.all.PropertiesMerger = Std.classes.PropertiesMerger = $compiler.inject.source("./apis/merge/PropertiesMerger/PropertiesMerger.class.js");
    Std.all.Tester = Std.classes.Tester = $compiler.inject.source("./apis/testing/Tester/Tester.class.js");
    Std.all.Progresser = Std.classes.Progresser = $compiler.inject.source("./apis/debug/Progresser/Progresser.class.js");
  }
  Wave_6_Types_system: {
    Std.all.BasicTypes = Std.objects.BasicTypes = $compiler.inject.source("./apis/types/BasicTypes/BasicTypes.object.js");
    Std.all.TypesParser = Std.classes.TypesParser = $compiler.inject.source("./apis/types/TypesParser/TypesParser.object.js");
    Std.all.ValidationStep = Std.classes.ValidationStep = $compiler.inject.source("./apis/validation/ValidationStep/ValidationStep.class.js");
    Std.all.ValidationState = Std.classes.ValidationState = $compiler.inject.source("./apis/validation/ValidationState/ValidationState.class.js");
    Std.all.ValidationResult = Std.classes.ValidationResult = $compiler.inject.source("./apis/validation/ValidationResult/ValidationResult.class.js");
    Std.all.TypesValidator = Std.classes.TypesValidator = $compiler.inject.source("./apis/types/TypesValidator/TypesValidator.class.js");
    Std.all.TypesCatalog = Std.classes.TypesCatalog = $compiler.inject.source("./apis/types/TypesCatalog/TypesCatalog.class.js");
    Std.all.Domer = Std.classes.Domer = $compiler.inject.source("./apis/dom/Domer/Domer.class.js");
  }
  Wave_7_Filesystem: {
    Std.all.NodejsFilesystem = Std.classes.NodejsFilesystem = $compiler.inject.source("./apis/files/NodejsFilesystem/NodejsFilesystem.class.js");
    Std.all.IdbCrud = Std.classes.IdbCrud = $compiler.inject.source("./apis/indexeddb/IdbCrud/IdbCrud.class.js");
    Std.all.IdbFilesystem = Std.classes.IdbFilesystem = $compiler.inject.source("./apis/files/IdbFilesystem/IdbFilesystem.class.js");
    Std.all.makeFunctionByProperties = Std.functions.makeFunctionByProperties = $compiler.inject.source("@/src/candidate/Std/apis/reflection/makeFunctionByProperties/makeFunctionByProperties.function.js");
  }




  return Std;

})()