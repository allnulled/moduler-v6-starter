  trace: function trace(...args) {
    // Std.all.Printer.json(args);
    return;
  },
  validateData: async function (expression, data, skipValidations = false) {
    const astRaw = typeof expression === "string" ? Std.classes.TypesParser.parse(expression) : expression;
    const astWithoutImports = await this._replaceImportsRecursively(astRaw);
    const validation = await this._validateDataRecursively({
      ast: astWithoutImports,
      data: data,
    }, {
      isRoot: true,
      skipValidations: skipValidations,
    });
    // console.log("validateData:", validation);
    return validation;
  },
  composeErrorMessage: function (submessages = []) {
    let message = "";
    for (let index = 0; index < submessages.length; index++) {
      const part = submessages[index];
      const submessage = Array.isArray(part) ? part.length === 2 ? `${part[0]} «${part[1]}»` : part.join(" ") : part;
      message += `${index === 0 ? '' : ' '}${submessage}`;
    }
    return message;
  },
  composeValidationMessage: function (memory, header = false, footer = false) {
    const message = [
      header || "Validation error arised",
      ...(memory.localAst?.id ? [["because validator type", memory.localAst.id]] : []),
      ["found data type", typeof memory.localData],
      ["at data index", memory.dataPointer.join("/") || "~"],
      // ["and validator index", memory.astPointer.join("/") || "~"],
      // ["on grammar", memory.localAst.grammar],
      footer ? footer : ["on method", "validateData"],
    ];
    return this.composeErrorMessage(message);
  },
  createValidationError: function ({ name, memory, header, footer }) {
    return Error.normalize({
      name: name,
      message: this.composeValidationMessage(memory, header, footer),
    });
  },
  PrimitiveTypes: Std.all.PrimitiveTypes = Std.objects.PrimitiveTypes = {
    "undefined": {
      abstraction: {
        onValidate(memory) {
          return typeof memory.localData === "undefined";
        },
      },
    },
    "null": {
      abstraction: {
        onValidate(memory) {
          return memory.localData === null;
        },
      },
    },
    "string": {
      abstraction: {
        onValidate(memory) {
          return typeof memory.localData === "string";
        },
      },
    },
    "boolean": {
      abstraction: {
        onValidate(memory) {
          return typeof memory.localData === "boolean";
        },
      },
    },
    "object": {
      abstraction: {
        onValidate(memory) {
          return memory.localData !== null && typeof memory.localData === "object" && !Array.isArray(memory.localData);
        },
      },
    },
    "number": {
      abstraction: {
        onValidate(memory) {
          return typeof memory.localData === "number";
        },
      },
    },
    "function": {
      abstraction: {
        onValidate(memory) {
          return typeof memory.localData === "function";
        },
      },
    },
    "array": {
      abstraction: {
        onValidate(memory) {
          return Array.isArray(memory.localData);
        },
      },
    },
  },
  Registry: Std.all.TypesRegistry = Std.functions.TypesRegistry = (it = {}) => {
    return Object.create(Std.objects.PrimitiveTypes, it);
  },
  Memory: Std.all.ValidationMemory = Std.classes.ValidationMemory = class ValidationMemory {
    static {
      $moduler.toolkit.makeClass([
        Std.interfaces.InstantiableInterface,
        // @interface:ValidationMemoryInterface
        Std.functions.IntrospectableInterfaceFactory("data", "getDataProperty", "setDataProperty", "hasDataProperty", "initializeDataProperty", "listDataProperties"),
        Std.functions.IntrospectableInterfaceFactory("ast", "getAstProperty", "setAstProperty", "hasAstProperty", "initializeAstProperty", "listAstProperties"),
        {
          prototype: {
            onCreate: function () {
              this.labels = {};
              this.registry = Std.functions.TypesRegistry();
              this.result = Std.classes.ValidationResult.new;
            },
            clonedProperties: ["labels", "registry", "result"],
            unclonableProperties: ["data", "ast", "dataPointer", "astPointer"],
            get localData() {
              return this.dataPointer?.length ? this.getDataProperty(this.dataPointer.join("/")) : this.data;
            },
            get localAst() {
              return this.astPointer?.length ? this.getAstProperty(this.astPointer.join("/")) : this.ast;
            },
          },
          static: {},
        },
      ], this);
    }
  },
  Result: Std.all.ValidationResult = Std.classes.ValidationResult = class ValidationResult extends Array {
    add(memory) {
      $moduler.assert(memory instanceof Std.classes.ValidationMemory, `Parameter «memory» must be instance of «ValidationMemory» on «ValidatorResult.prototype.add»`);
      this.push([
        memory.astPointer,
        memory.dataPointer,
      ]);
    }
  },
  _validateAndOperation: function _validateAndOperation(memory) {
    this.trace("TypesValidator._validateAndOperation", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    const { localAst } = memory;
    Validate_first: {
      const submemory = memory.clone({
        data: memory.data,
        dataPointer: memory.dataPointer.concat([]),
        ast: memory.ast,
        astPointer: memory.astPointer.concat(["left"]),
      });
      const output = this._validateDataRecursively(submemory);
      if (output instanceof Error) {
        return output;
      } else {
        memory.result.add(submemory);
      }
    }
    Validate_others: {
      for (let index = 0; index < localAst.right.length; index++) {
        const submemory = memory.clone({
          data: memory.data,
          dataPointer: memory.dataPointer.concat([]),
          ast: memory.ast,
          astPointer: memory.astPointer.concat(["right", index]),
        });
        const output = this._validateDataRecursively(submemory);
        if (output instanceof Error) {
          return output;
        } else {
          memory.result.add(submemory);
        }
      }
    }
    memory.result.add(memory);
    return true;
  },
  _validateOrOperation: function _validateOrOperation(memory) {
    this.trace("TypesValidator._validateOrOperation", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    const { localAst } = memory;
    let lastError;
    Validate_first: {
      const submemory = memory.clone({
        data: memory.data,
        dataPointer: memory.dataPointer.concat([]),
        ast: memory.ast,
        astPointer: memory.astPointer.concat(["left"]),
      });
      const output = this._validateDataRecursively(submemory);
      if (!(output instanceof Error)) {
        memory.result.add(submemory);
        return true;
      }
      lastError = output;
    }
    Validate_others: {
      for (let index = 0; index < localAst.right.length; index++) {
        const submemory = memory.clone({
          data: memory.data,
          dataPointer: memory.dataPointer.concat([]),
          ast: memory.ast,
          astPointer: memory.astPointer.concat(["right", index]),
        });
        const output = this._validateDataRecursively(submemory);
        if (!(output instanceof Error)) {
          memory.result.add(submemory);
          return true;
        }
        lastError = output;
      }
    }
    return lastError;
  },
  _validateTypeLabel: function _validateTypeLabel(memory) {
    this.trace("TypesValidator._validateTypeLabel", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    const { localAst } = memory;
    Validating_by_label: {
      if (!(localAst.label in memory.labels)) {
        return this.createValidationError({
          name: "TypeLabelNotIdentified",
          memory: memory,
          header: `Label «${localAst.label}» was not previously set`,
          footer: "on method «TypesValidator._validateTypeLabel»",
        });
      }
    }
    const submemory = memory.clone({
      data: memory.localData,
      dataPointer: [],
      ast: memory.labels[localAst.label],
      astPointer: [],
    });
    return this._validateDataRecursively(submemory);
  },
  _validateFactoryType: function _validateFactoryType(memory) {
    this.trace("TypesValidator._validateFactoryType", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    Validating_by_type: {
      if (typeof memory.localData !== "function") {
        return this.createValidationError({
          name: "FactoryTypeValidationNotAccomplished",
          memory: memory,
          header: "Factory type validation was not accomplished",
          footer: "on method «TypesValidator._validateFactoryType»",
        });
      }
    }
    memory.result.add(memory);
    return true;
  },
  _validateClassType: function _validateClassType(memory) {
    this.trace("TypesValidator._validateClassType", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    Validating_by_type: {
      if (typeof memory.localData !== "function") {
        return this.createValidationError({
          name: "ClassTypeNotAccomplished",
          memory: memory,
          header: "Class type validation was not accomplished",
          footer: "on method «TypesValidator._validateClassType» while validating class type",
        });
      }
    }
    return this._validateProperties(memory, "class");
  },
  _validateProperties: function _validateProperties(memory, mode = "object") {
    const output = {};
    Validating_properties:
    for (let prop in memory.localAst.properties) {
      const hasProperty = (typeof memory.localData[prop] !== "undefined") || (prop in memory.localData);
      const propAst = memory.localAst.properties[prop];
      if((!hasProperty) && propAst.optional) {
        continue Validating_properties;
      }
      const submemory = memory.clone({
        data: memory.data,
        dataPointer: memory.dataPointer.concat([prop]),
        ast: memory.ast,
        astPointer: memory.astPointer.concat(["properties", prop]),
      });
      const item = this._validateDataRecursively(submemory);
      output[prop] = item;
    }
    return output;
  },
  _validateObjectType: function _validateObjectType(memory) {
    this.trace("TypesValidator._validateObjectType", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    if ((typeof memory.localData !== "object") || (memory.localData === null)) {
      return this.createValidationError({
        name: "ObjectTypeNotAccomplished",
        memory: memory,
        header: "Object type validation was not accomplished",
        footer: "on method «TypesValidator._validateObjectType» while validating object type",
      });
    }
    return this._validateProperties(memory, "object");
  },
  _validateArrayType: function _validateArrayType(memory) {
    this.trace("TypesValidator._validateArrayType", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    if (!Array.isArray(memory.localData)) {
      return this.createValidationError({
        name: "ArrayTypeNotAccomplished",
        memory: memory,
        header: `Array type validation was not accomplished`,
        footer: "on method «TypesValidator._validateArrayType» while validating array type",
      });
    }
    // return this._validateDataRecursively(memory);
  },
  _validateIdType: function _validateIdType(memory) {
    this.trace("TypesValidator._validateIdType", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    const { localAst, dataPointer, ast, astPointer } = memory;
    const TypeClass = memory.registry[localAst.id];
    Caso_de_ser_tipo: {
      if (TypeClass?.abstraction?.onValidate) {
        let validation;
        try {
          validation = TypeClass.abstraction.onValidate(memory);
        } catch (error) {
          validation = error;
        }
        if ((typeof validation === "undefined") || (validation === false)) {
          validation = this.createValidationError({
            name: "IdentifiedTypeNotAccomplished",
            memory: memory,
            header: `Type «${localAst.id}» validation was not accomplished`,
            footer: `on method «TypesValidator._validateIdType»`,
          });
        }
        return validation;
      }
    }
    Caso_de_ser_label: {
      if (memory.labels[localAst.id]) {
        const submemory = memory.clone({
          data: memory.data,
          dataPointer: memory.dataPointer.concat([]),
          ast: memory.labels[localAst.id],
          astPointer: memory.astPointer.concat(["labels", localAst.id]),
        });
        const validation = this._validateDataRecursively(submemory);
        if (!(validation instanceof Error) && localAst.label) {
          memory.labels[localAst.label] = {
            ...ast,
            label: undefined,
          };
        }
        memory.result.add(submemory);
        return validation;
      }
    }
    return this.createValidationError({
      name: "UnidentifiedType",
      memory: memory,
      header: `Unidentified type by id «${localAst.id}» was found`,
      footer: `on method «TypesValidator._validateIdType»`,
    });
  },
  _validateScript: function _validateScript(memory) {
    this.trace("TypesValidator._validateScript", memory);
    let validation = undefined;
    Validating_instructions:
    for (let indexLine = 0; indexLine < memory.ast.ast.length; indexLine++) {
      const isLastInstruction = indexLine === memory.ast.ast.length - 1;
      const submemory = memory.clone({
        ast: memory.ast,
        data: memory.data,
        astPointer: memory.astPointer.concat(["ast", indexLine]),
        dataPointer: memory.dataPointer.concat([]),
        isLastInstruction: isLastInstruction,
      });
      validation = this._validateDataRecursively(submemory);
      if (validation instanceof Error) {
        return validation;
      }
      if (isLastInstruction) {
        memory.exportedAst = this._materializeAst(submemory, submemory.localAst);
      }
    }
    memory.result.add(memory);
    // console.log(memory);
    return memory;
  },
  _defaultOptionsForValidateDataRecursively: {
    mode: "object",
    isRoot: false,
    skipValidations: false,
  },
  _validateDataRecursively: function _validateDataRecursively(memory = null, optionsBrute = {}) {
    // this.trace("_validateDataRecursively", memory);
    const options = Object.assign({}, this._defaultOptionsForValidateDataRecursively, optionsBrute || {});
    const { mode, skipValidations } = options;
    Initialize_memory: {
      memory = memory instanceof Std.classes.ValidationMemory ? memory : Std.classes.ValidationMemory.new.config({
        // Las propiedades de memory:
        ...memory,
        // 
        astPointer: [],
        dataPointer: [],
        registry: Std.functions.TypesRegistry(),
        result: new Std.classes.ValidationResult(),
        // 
        mode: mode,
        skipValidations: skipValidations,
      });
    }
    let output = undefined;
    const { localAst } = memory;
    Export_label_if_any: {
      if (localAst.label && localAst.grammar !== "type label") {
        memory.labels[localAst.label] = { ...localAst };
      }
    }
    Validate_grammar: {
      const { grammar } = localAst;
      if (grammar === "and operation") {
        output = this._validateAndOperation(memory);
      } else if (grammar === "or operation") {
        output = this._validateOrOperation(memory);
      } else if (grammar === "type label") {
        output = this._validateTypeLabel(memory);
      } else if (grammar === "factory type") {
        output = this._validateFactoryType(memory);
      } else if (grammar === "object type") {
        output = this._validateObjectType(memory);
      } else if (grammar === "class type") {
        output = this._validateClassType(memory);
      } else if (grammar === "array type") {
        output = this._validateArrayType(memory);
      } else if (grammar === "type id") {
        output = this._validateIdType(memory);
      } else if (grammar === "script") {
        output = this._validateScript(memory);
      } else {
        console.log(memory);
        throw Error.normalize({
          name: "ValidationGrammarNotIdentified",
          message: `Grammar «${grammar}» is not recognized on «TypesValidator._validateDataRecursively»`,
        });
      }
    }
    Validate_negation: {
      if (localAst.negation) {
        if (output instanceof Error) {
          output = true;
        } else {
          output = this.createValidationError({
            name: "NegationNotAccomplished",
            memory: memory,
            header: "Negated expression was not accomplished",
            footer: "on method «TypesValidator._validateDataRecursively»",
          });
        }
      }
    }
    return output;
  },
  _replaceImportsRecursively: async function _replaceImportsRecursively(ast) {
    this.trace("TypesValidator._replaceImportsRecursively", ast);
    // @CHATGPT: este sería el método que hace el:
    //   - iterar recursivamente en busca de imports
    //   - leer los imports internos
    //   - parsear los imports internos
    //   - reducir el ast de cada import interno
    if(typeof ast !== "object") return ast;
    if(ast === null) return ast;
    if(Array.isArray(ast)) {
      const outputAst = [];
      for(let index=0; index<ast.length; index++) {
        const row = ast[index];
        outputAst[index] = await this._replaceImportsRecursively(row);
      }
      return outputAst;
    } else if(ast.grammar === "import") {
      return await this._replaceSpecificImport(ast);
    } else {
      const outputAst = {};
      for(let prop in ast) {
        outputAst[prop] = await this._replaceImportsRecursively(ast[prop]);
      }
      return outputAst;
    }
  },
  typesModuler: ModulerV6.globalInstance.cloneForFile("@/dist/www/types/any.tyla"),
  _replaceSpecificImport: async function (ast) {
    this.trace("TypesValidator._replaceSpecificImport", ast);
    const readMethod = (function(it) {
      if(it === "file") return "_readFile";
      if(it === "url") return "_readUrl";
      if(it === "path") return "_readPath";
      if(it === null) return "_readPath";
      throw new Error(`Resource type «${it}» is not identified`);
    })(ast.resource);
    const text = await this.typesModuler[readMethod](ast.target);
    // @CHATGPT: aquí estoy. Tengo que hacer un validateData sin data.
    Aqui_el_conflicto_ChatGPT: {
      const validation = await this.validateData(text, null, true);
      return validation.exportedAst;
    }
  },
  _materializeAst: function _materializeAst(memory, localAst, resolvingLabels = new Set()) {
    this.trace("TypesValidator._materializeAst");
    Handle_null_non_objects_and_arrays: {
      if (localAst === null || typeof localAst !== "object") {
        return localAst;
      } else if (Array.isArray(localAst)) {
        return localAst.map(value => this._materializeAst(memory, value, resolvingLabels));
      }
    }
    Handle_labels: {
      if (localAst.grammar !== "type label") {
        break Handle_labels;
      }
      const label = localAst.label;
      Resolve_by_label: {
        if (!(label in memory.labels)) {
          return { ...localAst };
        }
      }
      Throw_error_by_label: {
        if (resolvingLabels.has(label)) {
          throw Error.normalize({
            name: "MissingTypeLabelDeclaration",
            message: `Missing label «${label}» used as type on «TypesValidator._materializeAst» was found`,
          });
        }
      }
      Materialize_label: {
        const nextResolvingLabels = new Set(resolvingLabels);
        nextResolvingLabels.add(label);
        return this._materializeAst(
          memory,
          memory.labels[label],
          nextResolvingLabels
        );
      }
    }
    Inner_copy: {
      const output = {};
      for (const key of Object.keys(localAst)) {
        output[key] = this._materializeAst(memory, localAst[key], resolvingLabels);
      }
      return output;
    }
  },
  _readPath: ModulerV6.globalInstance._readPath,
  _readFile: ModulerV6.globalInstance._readFile,
  _readUrl: ModulerV6.globalInstance._readUrl