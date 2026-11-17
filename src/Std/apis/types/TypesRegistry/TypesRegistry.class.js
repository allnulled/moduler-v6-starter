class TypesRegistry {
  static {
    Compose_class: {
      $moduler.toolkit.makeClass([
        {
          static: {
            all: Std.types
          }
        },
        Std.functions.IntrospectableInterfaceFactory(
          "all",
          "get",
          "set",
          "has",
          "delete",
          "initialize",
          "list",
          "onRegister",
          "onUnregister",
          "/",
          "static",
        ),
        {
          static: {
            registerViewsOfType(TypeDefinition, id) {
              $moduler.assert(typeof TypeDefinition === "object", `Definition of type «${id}» should be object but «${typeof TypeDefinition}» was found instead on «Std.classes.TypesRegistry.registerViewsOfType»`);
              $moduler.assert(typeof TypeDefinition.abstraction === "object", `Property «abstraction» of type «${id}» should be object but «${typeof TypeDefinition.abstraction}» was found instead on «Std.classes.TypesRegistry.registerViewsOfType»`);
              $moduler.assert(typeof TypeDefinition.abstraction.views === "object", `Property «abstraction.views» of type «${id}» should be object but «${typeof TypeDefinition.abstraction.views}» was found instead on «Std.classes.TypesRegistry.registerViewsOfType»`);
              const allViews = TypeDefinition.abstraction.views;
              for(const name in allViews) {
                const view = allViews[name];
                $moduler.assert(typeof view === "object", `View «${name}» of type «${id}» should be object but «${typeof view}» was found instead on «Std.classes.TypesRegistry.registerViewsOfType»`);
                $moduler.assert(typeof view.name === "string", `Property «name» of view «${name}» of type «${id}» should be string but «${typeof view.name}» was found instead on «Std.classes.TypesRegistry.registerViewsOfType»`);
                Std.classes.ViewsRegistry.initialize(view.name, view);
              }
              return TypeDefinition;
            },
            // @ATENCIÓN: usar siempre con await si quieres evitar ambigüedades de contexto.
            find(...args) {
              const [ name ] = args;
              if(this.has(name)) {
                const TypeDefinition = this.get(name);
                this.registerViewsOfType(TypeDefinition, name);
                return TypeDefinition;
              }
              return this.fetch(...args);
            },
            async fetch(id) {
              const TypeDefinition = await $moduler.import(`@/dist/www/types/${id}/${id}.dist.js`);
              this.registerViewsOfType(TypeDefinition, id);
              return this.set(id, TypeDefinition);
            }
          }
        }
      ], this);
    }
    Add_basic_primitives: {
      Object.assign(this.all, {
        "undefined": $moduler.patchFile("@/dist/www/types/undefined/undefined.dist.js", $compiler.inject.source("@/src/www/types/undefined/undefined.type.js")),
        "null": $moduler.patchFile("@/dist/www/types/null/null.dist.js", $compiler.inject.source("@/src/www/types/null/null.type.js")),
        "string": $moduler.patchFile("@/dist/www/types/string/string.dist.js", $compiler.inject.source("@/src/www/types/string/string.type.js")),
        "boolean": $moduler.patchFile("@/dist/www/types/boolean/boolean.dist.js", $compiler.inject.source("@/src/www/types/boolean/boolean.type.js")),
        "number": $moduler.patchFile("@/dist/www/types/number/number.dist.js", $compiler.inject.source("@/src/www/types/number/number.type.js")),
        "function": $moduler.patchFile("@/dist/www/types/function/function.dist.js", $compiler.inject.source("@/src/www/types/function/function.type.js")),
        "integer": $moduler.patchFile("@/dist/www/types/integer/integer.dist.js", $compiler.inject.source("@/src/www/types/integer/integer.type.js")),
        "object": $moduler.patchFile("@/dist/www/types/object/object.dist.js", $compiler.inject.source("@/src/www/types/object/object.type.js")),
        "array": $moduler.patchFile("@/dist/www/types/array/array.dist.js", $compiler.inject.source("@/src/www/types/array/array.type.js")),
        "date": $moduler.patchFile("@/dist/www/types/date/date.dist.js", $compiler.inject.source("@/src/www/types/date/date.type.js")),
      });
    }
  }
}