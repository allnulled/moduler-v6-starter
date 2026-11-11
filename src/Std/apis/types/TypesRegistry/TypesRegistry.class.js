class TypesRegistry {
  static {
    Compose_class: {
      $moduler.toolkit.makeClass([
        Std.interfaces.InstantiableInterface,
        { prototype: { all: Std.types } },
        Std.functions.IntrospectableInterfaceFactory(
          "all",
          "get",
          "set",
          "has",
          "delete",
          "initialize",
          "list",
          "onRegister",
          "onUnregister"
        ),
      ], this);
    }
    Add_basic_primitives: {
      Object.assign(this.prototype.all, {
        "undefined": $compiler.inject.source("@/src/Std/types/undefined/undefined.type.js"),
        "null": $compiler.inject.source("@/src/Std/types/null/null.type.js"),
        "string": $compiler.inject.source("@/src/Std/types/string/string.type.js"),
        "boolean": $compiler.inject.source("@/src/Std/types/boolean/boolean.type.js"),
        "number": $compiler.inject.source("@/src/Std/types/number/number.type.js"),
        "function": $compiler.inject.source("@/src/Std/types/function/function.type.js"),
        "integer": $compiler.inject.source("@/src/Std/types/integer/integer.type.js"),
        "object": $compiler.inject.source("@/src/Std/types/object/object.type.js"),
        "array": $compiler.inject.source("@/src/Std/types/array/array.type.js"),
        "date": $compiler.inject.source("@/src/Std/types/date/date.type.js"),
      });
    }
    Set_global_instance: {
      this.globalInstance = this.$ = TypesRegistry.new;
    }
  }
}