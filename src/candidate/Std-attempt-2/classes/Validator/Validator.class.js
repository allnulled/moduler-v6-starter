class Validator {
  static assert(condition, message) {
    if(!condition) throw new Error(message);
  }
  static TypeRepresentation = class {
    constructor(id, definitionArgument = undefined) {
      this.id = id;
      this.definitionArgument = definitionArgument;
    }
  };
  static typology = {
    boolean: {
      equivalences: [Boolean],
      validate: function(it, definitionArgument = undefined) {
        const isSameJsType = typeof it === "boolean";
        let otherConditions = false;
        if(typeof definitionArgument === "undefined") otherConditions = true;
        else if(typeof definitionArgument === "boolean") otherConditions = it === definitionArgument;
        else throw new Error(`Required parameter «definitionArgument» to be undefined or boolean but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`);
        return isSameJsType && otherConditions;
      }
    },
    number: {
      equivalences: [Number],
      validate: function(it, definitionArgument = undefined) {
        const isSameJsType = typeof it === "number";
        let otherConditions = false;
        if(typeof definitionArgument === "undefined") otherConditions = true;
        else if(typeof definitionArgument === "number") otherConditions = it === definitionArgument;
        else throw new Error(`Required parameter «definitionArgument» to be undefined or number but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`);
        return isSameJsType && otherConditions;
      }
    },
    string: {
      equivalences: [String],
      validate: function(it, definitionArgument = undefined) {
        const isSameJsType = typeof it === "string";
        let otherConditions = false;
        if(typeof definitionArgument === "undefined") otherConditions = true;
        else if(typeof definitionArgument === "string") otherConditions = it === definitionArgument;
        else throw new Error(`Required parameter «definitionArgument» to be undefined or string but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`);
        return isSameJsType && otherConditions;
      }
    },
    array: {
      equivalences: [Array],
      validate: function(it, definitionArgument = undefined) {
        const isSameJsType = Array.isArray(it);
        let otherConditions = false;
        if(typeof definitionArgument === "undefined") otherConditions = true;
        else if(typeof definitionArgument === "boolean") otherConditions = it === definitionArgument;
        else throw new Error(`Required parameter «definitionArgument» to be undefined or array but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`);
        return isSameJsType && otherConditions;
      }
    },
    object: {
      equivalences: [Object],
      validate: function(it, definitionArgument = undefined) {
        const isSameJsType = typeof it === "object";
        let otherConditions = false;
        if(typeof definitionArgument === "undefined") otherConditions = true;
        else if(typeof definitionArgument === "boolean") otherConditions = it === definitionArgument;
        else throw new Error(`Required parameter «definitionArgument» to be undefined or object but «${typeof definitionArgument}» was found instead on «Validator.types.equivalences»`);
        return isSameJsType && otherConditions;
      }
    },
    function: {
      equivalences: [Function],
      validate: function(it, definitionArgument = undefined) {
        const isSameJsType = typeof it === "function";
        let otherConditions = false;
        if(typeof definitionArgument === "undefined") otherConditions = true;
        else throw new Error(`Required parameter «definitionArgument» to be undefined but «${typeof definitionArgument}» was found instead on «Validator.types.function»`);
        return isSameJsType && otherConditions;
      }
    },
    promise: {
      equivalences: [Promise],
      validate: function(it, definitionArgument = undefined) {
        const isSameJsType = it instanceof Promise;
        let otherConditions = false;
        if(typeof definitionArgument === "undefined") otherConditions = true;
        else throw new Error(`Required parameter «definitionArgument» to be undefined but «${typeof definitionArgument}» was found instead on «Validator.types.promise»`);
        return isSameJsType && otherConditions;
      }
    },
    date: {
      equivalences: [Date],
      validate: function(it, definitionArgument = undefined) {
        const isSameJsType = it instanceof Date;
        let otherConditions = false;
        if(typeof definitionArgument === "undefined") otherConditions = true;
        else throw new Error(`Required parameter «definitionArgument» to be undefined but «${typeof definitionArgument}» was found instead on «Validator.types.date»`);
        return isSameJsType && otherConditions;
      }
    },
    options: {
      validate: function(it, definitionArgument = undefined) {
        
      }
    }
  }
  static validate(data, definition = {}) {
    
    return true;
  }
  static {
    Object.assign(this, {
      types: (() => {
        const all = {};
        for(let typeId in this.typology) {
          all[typeId] = (definitionArgument) => new this.TypeRepresentation(typeId, definitionArgument);
        }
        return all;
      })(),
    })
  }
}