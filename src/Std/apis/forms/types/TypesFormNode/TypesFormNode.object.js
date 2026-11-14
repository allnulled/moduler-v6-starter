Std.classes.ViewsRegistry.set("TypesFormNode", {
  name: "TypesFormNode",
  functional: true,
  props: {
    params: {
      type: Object,
      required: true,
    }
  },
  render(h, context) {
    const params = $moduler.toolkit.normalizeObject(context.props.params, ...Std.views.TypesFormNode.static.paramsNormalization);
    const { astIndex } = params;
    const ast = params.expression ? Std.objects.TypesParser.parse(params.expression) : params.ast;
    $moduler.assert((typeof ast === "object") && (ast !== null), `Required parameter «params.ast» to be object or «params.expression» to be string at ast index «${astIndex.join("/")}» but «${ast}» was found instead on «TypesFormNode.render»`);
    const node = astIndex.reduce((value, index) => value[index], ast);
    $moduler.assert((typeof ast === "object") && (ast !== null), `Required product «node» to result object at ast index «${astIndex.join("/")}» but «${ast}» was found instead on «TypesFormNode.render»`);
    const definitions = Std.views.TypesFormNode.static.definitions;
    $moduler.assert(node.grammar in definitions, `Grammar not identified «${node.grammar}» at ast tree index «${astIndex.join("/")}» while rendering ast form`);
    const definition = definitions[node.grammar];
    return h(definition, {
      class: "types-form-node",
      props: { params },
    });
  },
  static: {
    definitions: {
      "script": "TypesFormScript",
      "object type": "TypesFormObjectType",
      "class type": "TypesFormClassType",
      "array type": "TypesFormArrayType",
      "factory type": "TypesFormFactoryType",
      "or operation": "TypesFormOrOperation",
      "and operation": "TypesFormAndOperation",
      "type id": "TypesFormTypeId",
      "type label": "TypesFormTypeLabel",
      "spreaded list": "TypesFormSpreadedList",
      "import": "TypesFormImport",
    },
    symbols: {
      NO_DATA: {},
    },
    paramsNormalization: [{
      ast: {
        validate(value) {
          $moduler.assert(typeof value === "object", `Required property «ast» to be object but «${typeof value}» was found instead on «TypesFormNode.render»`);
          $moduler.assert(value !== null, `Required property «ast» to be object but «null» was found instead on «TypesFormNode.render»`);
          $moduler.assert(typeof value.grammar === "string", `Required property «ast.grammar» to be string but «${typeof value.grammar}» was found instead on «TypesFormNode.render»`);
          return true;
        },
      },
      astIndex: {
        validate(value) {
          $moduler.assert(Array.isArray(value), `Required property «astIndex» to be array but «${typeof value}» was found instead on «TypesFormNode.render»`);
          return true;
        },
      },
      data: {
        validate() {
          return true;
        },
        default() {
          return Std.views.TypesFormNode.static.symbols.NO_DATA;
        },
      },
      dataIndex: {
        validate(value) {
          $moduler.assert(Array.isArray(value), `Required property «dataIndex» to be array but «${typeof value}» was found instead on «TypesFormNode.render»`);
          return true;
        },
      }
    }, {
      validate(params) {
        if (!params.ast) {
          $moduler.assert(typeof params.expression === "string", `Required on «context.props.params» property «expression» to be string or «ast» to be object but none where truthy values on «Std.views.TypesFormNode.render»`);
          params.ast = Std.objects.TypesParser.parse(params.expression);
        }
        return true;
      }
    }]
  }
});