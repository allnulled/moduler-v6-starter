module.exports = async function ({ Tester }) {
  const {
    AbstractionUtils,
    AbstractionMerger,
    Asserter: { new: asserter },
  } = Std.all;

  const Types = {
    Animal: [
      {
        expression: `{ especie: string, medio: "tierra" | "agua" | "aire" }`,
      },
    ],
    Plant: [
      {
        expression: `{ especie: string, cosecha: month }`,
      },
    ],
    Rock: [
      {
        expression: `{ especie: string, dureza: [] }`,
      },
    ],
  };
  const Databases = {
    Animal: [
      {
        owner: "Wikipedia",
        table: "beings/taxonomy/animal",
      },
    ],
    Plant: [
      {
        owner: "Wikipedia",
        table: "beings/taxonomy/plant",
      },
    ],
    Rock: [
      {
        owner: "Wikipedia",
        table: "beings/taxonomy/rock",
      },
    ],
  };
  const Views = {
    Animal: [
      {
        component: {
          name: "AnimalView",
        },
      },
    ],
    Plant: [
      {
        component: {
          name: "PlantView",
        },
      },
    ],
    Rock: [
      {
        component: {
          name: "RockView",
        },
      },
    ],
  };
  const Forms = {
    Animal: [{}],
    Plant: [{}],
    Rock: [{}],
  };
  const Commands = {
    Animal: [{}],
    Plant: [{}],
    Rock: [{}],
  };

  const Animal = {
    static: {
      abstraction: {
        type: Types.Animal,
        database: Databases.Animal,
        view: Views.Animal,
        form: Forms.Animal,
        command: Commands.Animal,
      },
    },
    prototype: {},
  };
  const Plant = {
    static: {
      abstraction: {
        type: Types.Animal,
        database: Databases.Animal,
        view: Views.Animal,
        form: Forms.Animal,
        command: Commands.Animal,
      },
    },
    prototype: {},
  };
  const Rock = {
    static: {
      abstraction: {
        type: Types.Animal,
        database: Databases.Animal,
        view: Views.Animal,
        form: Forms.Animal,
        command: Commands.Animal,
      },
    },
    prototype: {},
  };

  const out1 = AbstractionUtils.mergeAbstractions([Animal, Plant, Rock]);

  /*
  console.log(out1);
  console.log(out1);
  console.log(out1);
  console.log(out1);
  console.log(out1);
  //*/
};
