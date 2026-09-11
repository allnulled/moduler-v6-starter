module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;

  const { Validator } = Std.all;
  const { types: T } = Validator;

  return;
  console.log(Validator);

  let innerValidation1;

  const definition = {
    type: "object",
    properties: {
      name: {
        type: T.options(T.string, T.null),
        default: null,
        validate: it => (it === null) || (typeof it === "string"),
      },
      age: {
        type: T.options(T.number, T.null),
        default: null,
        validate: it => (it === null) || (typeof it === "number"),
      },
      city: {
        type: T.options(T.string("Madrid"), T.string("Barcelona"), T.string("Otra"),T.null),
        default: null,
        validate: it => (it === null) || (typeof it === "number"),
      },
      male: {
        type: T.options(T.boolean, T.null),
        default: null,
        validate: it => (it === null) || (typeof it === "boolean"),
      },
      hobbies: {
        type: T.options(T.array, T.null),
        default: null,
        validate: it => (it === null) || Array.isArray(it),
      },
      events: {
        type: T.options(T.object(T.options(T.string, T.object({
          date: T.date,
          name: T.string,
          duration: T.duration,
        }))), T.null),
        default: null,
        validate: it => ((it === null) || (typeof it === "object")) && (innerValidation1 = it => Validator.validate(it, {
          validate: it => typeof it === "object" ? innerValidation1(it) : typeof it === "string" ? true : Error.create({name:"ValidationError",message:"Property events does not follow the definition"})
        }))(it),
      },
      script: {
        type: T.options(T.function, T.null),
        default: null,
        validate: it => (it === null) || (typeof it === "function"),
      }
    }
  };

  const data = {
    name:"Carl",
    age: 35,
    city:"Otra",
    male: true,
    hobbies: ["hobby1","hobby2"],
    events: {
      event1: "something happened",
      event2: "something else happened",
    },
    knowledge: {
      programming: {
        java: {
          level: 10,
        }
      }
    }
  };

  assert(Validator.validate(data, definition), "Validator.validate puede validar datos según definición y devolver dato formateado si pasa (1)");

  data.age = false;

  await assertThrows(() => Validator.validate(data, definition), "Validator.validate puede validar datos según definición y lanzar error si falla (2)");

  return;

  const validation = Validator.validate(100, { type: Number, default: 70, validate: it => typeof it === "number", format: it => it + 1 });

  assert(validation.output === 101, "Validator.validate puede validar un dato único");

};