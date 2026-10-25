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
  composeValidationErrorMessage: function (memory, header = false, footer = false) {
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
  composeValidationErrorMetadata: function(memory, header, footer) {
    return {
      grammar:(memory.localAst.grammar === "type id" ? `${memory.localAst.grammar} (${memory.localAst.id})` : memory.localAst.grammar),
      astPointer: memory.astPointer,
      dataPointer: memory.dataPointer,
      foundType: typeof memory.localData,
    };
  },
  createValidationError: function ({ name, memory, header, footer }) {
    return Error.normalize({
      name: name,
      message: this.composeValidationErrorMessage(memory, header, footer),
      metadata: this.composeValidationErrorMetadata(memory, header, footer),
    });
  },
  addValidationError: function(errorObject) {
    const validationError = this.createValidationError(errorObject);
    errorObject.memory.errors.addError(validationError);
    return validationError;
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
    "integer": {
      abstraction: {
        onValidate(memory) {
          return Number.isInteger(memory.localData);
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
    "date": {
      abstraction: {
        onValidate(memory) {
          return memory.localData instanceof Date;
        }
      }
    }
  },
  Registry: Std.all.TypesRegistry = Std.functions.TypesRegistry = (it = {}) => {
    return Object.create(Std.objects.PrimitiveTypes, it);
  },
  Memory: Std.all.ValidationMemory = Std.classes.ValidationMemory = class ValidationMemory {
    static {
      $moduler.toolkit.makeClass([
        Std.interfaces.InstantiableInterface,
        // @interface:ValidationMemoryInterface
        Std.functions.IntrospectableInterfaceFactory(
          "data",
          "getDataProperty",
          "setDataProperty",
          "hasDataProperty",
          "deleteDataProperty",
          "initializeDataProperty",
          "listDataProperties",
          "onRegisterDataProperty",
          "onUnregisterDataProperty"
        ),
        Std.functions.IntrospectableInterfaceFactory(
          "ast",
          "getAstProperty",
          "setAstProperty",
          "hasAstProperty",
          "deleteAstProperty",
          "initializeAstProperty",
          "listAstProperties",
          "onRegisterAstProperty",
          "onUnregisterAstProperty"
        ),
        {
          prototype: {
            onCreate: function () {
              this.labels = {};
              this.registry = Std.functions.TypesRegistry();
              this.result = new Std.classes.ValidationResult(this);
              this.errors = new Std.classes.ValidationErrors(this);
            },
            clonedProperties: ["labels", "registry", "result", "errors"],
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
    constructor(memory) {
      super();
      this.memory = memory;
    }
    addCheckpoint(memory, method) {
      $moduler.assert(memory instanceof Std.classes.ValidationMemory, `Parameter «memory» must be instance of «ValidationMemory» on «ValidatorResult.prototype.add»`);
      this.push({
        grammar: method,
        order: this.length,
        astPointer: memory.astPointer,
        dataPointer: memory.dataPointer,
      });
    }
  },
  Errors: Std.all.ValidationErrors = Std.classes.ValidationErrors = class ValidationErrors extends Array {
    constructor(memory) {
      super();
      this.memory = memory;
    }
    addError(error) {
      this.push(error);
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
        memory.result.addCheckpoint(submemory, `and operation (1)`);
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
          memory.result.addCheckpoint(submemory, `and operation (${index+2})`);
        }
      }
    }
    memory.result.addCheckpoint(memory, "and operation");
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
      if (output instanceof Error) {
        // @OK, maybe next.
      } else {
        memory.result.addCheckpoint(submemory, `or operation (1)`);
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
        if (output instanceof Error) {
          // @OK, maybe next.
        } else {
          memory.result.addCheckpoint(submemory, `or operation (${index+2})`);
          return true;
        }
        lastError = output;
      }
    }
    return this.addValidationError({
      name: "LogicalOrNotSatisfied",
      memory: memory,
      header: `Logical «OR» was not satisfied`,
      footer: "on method «TypesValidator._validateTypeLabel»",
    });
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
        return this.addValidationError({
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
        return this.addValidationError({
          name: "FactoryTypeValidationNotAccomplished",
          memory: memory,
          header: "Factory type validation was not accomplished",
          footer: "on method «TypesValidator._validateFactoryType»",
        });
      }
    }
    memory.result.addCheckpoint(memory);
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
        return this.addValidationError({
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
      const result = this._validateDataRecursively(submemory);
      if(result instanceof Error) {
        return this.addValidationError({
          name: "PropertyTypeNotAccomplished",
          memory: submemory,
          header: `Property type validation of ${mode} at «${prop}» was not accomplished`,
          footer: `on method «TypesValidator._validateProperties» while validating class type`,
        });
      }
      output[prop] = result;
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
      return this.addValidationError({
        name: "ObjectTypeNotAccomplished",
        memory: memory,
        header: "Object type validation was not accomplished",
        footer: "on method «TypesValidator._validateObjectType» while validating object type",
      });
    }
    return this._validateProperties(memory, "object");
  },
  _validateArrayType: function _validateArrayType(memory, arrayContext = null) {
    this.trace("TypesValidator._validateArrayType", memory);
    Return_unless_checking: {
      if (memory.skipValidations || !memory.isLastInstruction) {
        return true;
      }
    }
    if (!Array.isArray(memory.localData)) {
      return this.addValidationError({
        name: "ArrayTypeNotAccomplished",
        memory: memory,
        header: `Array type validation was not accomplished`,
        footer: "on method «TypesValidator._validateArrayType» while validating array type",
      });
    }
    const hasArrayContextOwner = typeof arrayContext === "object" && arrayContext !== null;
    arrayContext ||= { dataIndex: 0 };
    Validating_items:
    for(let index=0; index<memory.localAst.items.length; index++) {
      const submemory = memory.clone({
        data: memory.data,
        dataPointer: memory.dataPointer.concat([arrayContext.dataIndex]),
        ast: memory.ast,
        astPointer: memory.astPointer.concat(["items", index]),
      });
      const output = this._validateSpreadableType(submemory, arrayContext);
      if(output instanceof Error) {
        return output;
      }
    }
    if ((!hasArrayContextOwner) && (arrayContext.dataIndex !== memory.localData.length)) {
      return this.addValidationError({
        name: "ArrayValidationNotFullyAccomplished",
        memory: memory,
        header: `Array schema validation with ${arrayContext.dataIndex} items did not completely match the data structure with ${memory.localData.length} items`,
        footer: `on method «TypesValidator._validateArrayType» while validating array type`,
      });
    }
    return true;
  },
  _validateSpreadedList: function _validateSpreadedList(memory, arrayContext) {
    this.trace("TypesValidator._validateSpreadedList", memory);
    const { list } = memory.localAst;
    const config = {
      data: memory.data,
      dataPointer: memory.dataPointer.slice(0, -1),
    };
    if(typeof list === "string") {
      config.ast = memory.labels[list];
      config.astPointer = [];
    } else {
      config.ast = memory.ast;
      config.astPointer = memory.astPointer.concat(["list"]);
    }
    return this._validateArrayType(memory.clone(config), arrayContext);
  },
  _validateSpreadableType: function _validateSpreadableType(memory, arrayContext) {
    this.trace("TypesValidator._validateSpreadableType", memory);
    let output;
    let hasMultiplier, isSpreadedList, multiplierMin, multiplierMax;
    Initialize_spreadable_context: {
      hasMultiplier = typeof memory.localAst.multiplier !== "undefined";
      isSpreadedList = memory.localAst.grammar === "spreaded list";
      if(hasMultiplier) {
        if(memory.localAst.multiplier === "?") {
          multiplierMin = 0;
          multiplierMax = 1;
        } else if(memory.localAst.multiplier === "+") {
          multiplierMin = 1;
          multiplierMax = Infinity;
        } else if(memory.localAst.multiplier === "*") {
          multiplierMin = 0;
          multiplierMax = Infinity;
        } else {
          multiplierMin = 1;
          multiplierMax = 1;
        }
      } else {
        multiplierMin = 1;
        multiplierMax = 1;
      }
    }
    let multiplierCounter = 0;
    Iterating_as_much_as_possible:
    while(multiplierCounter < multiplierMax) {
      const submemory = memory.clone({
        data: memory.data,
        dataPointer: memory.dataPointer.slice(0,-1).concat([arrayContext.dataIndex]),
        ast: memory.ast,
        astPointer: memory.astPointer,
      });
      if(isSpreadedList) {
        output = this._validateSpreadedList(submemory, arrayContext);
      } else {
        output = this._validateDataRecursively(submemory);
      }
      Si_error_o_no_error:
      if(output instanceof Error) {
        if(multiplierMin > multiplierCounter) {
          Y_menos_del_minimo: {
            return output;
          }
        } else if(multiplierMax < multiplierCounter) {
          Y_mas_del_maximo: {
            return output;
          }
        } else {
          En_rango_aceptable: {
            return true;
          }
        }
      } else {
        if(!isSpreadedList) {
          memory.result.addCheckpoint(memory, `list item (${arrayContext.dataIndex+1}/${memory.localData.length})`);
          arrayContext.dataIndex++;
        }
      }
      multiplierCounter++;
    }
    return true;
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
          validation = this.addValidationError({
            name: "IdentifiedTypeNotAccomplished",
            memory: memory,
            header: `Type «${localAst.id}» validation was not accomplished`,
            footer: `on method «TypesValidator._validateIdType»`,
          });
        }
        if (!(validation instanceof Error)) {
          memory.result.addCheckpoint(memory, `type id (${localAst.id})`);
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
        memory.result.addCheckpoint(submemory, `type id (${localAst.id}) + label`);
        return validation;
      }
    }
    return this.addValidationError({
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
        memory.hasPassed = true;
      }
    }
    memory.result.addCheckpoint(memory, "script");
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
      } else if (grammar === "spreaded list") {
        output = this._validateSpreadedList(memory);
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
          output = this.addValidationError({
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
  _readUrl: ModulerV6.globalInstance._readUrl,