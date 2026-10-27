
module.exports = async function ({ Tester }) {

  const { Calendar } = Std.all;
  const { globalInstance: calendar } = Calendar;
  const { classes } = calendar;

  $moduler.assert(typeof Calendar === "function", "Calendar should exist as function");
  $moduler.assert(typeof calendar === "object", "Calendar.globalInstance should exist as object");
  $moduler.assert(typeof classes === "object", "Calendar.globalInstance.classes should exist as object");

  return;

  calendar.evaluate(async function(calendar, classes) {

    await calendar.inRange({
      from: classes.Moment.new.config({ year: "2026" }),
      to: classes.Moment.new.config({ year: "2027" }),
    }, async function () {

      const despertar = await classes.Question.new.config({ type: classes.Moment, parameters: ["HH:mm"] }).ask();

      await classes.Action.new.config({
        moment: despertar,
        composition: classes.OrderedList.new.config({
          items: [
            classes.Action.new.config({
              name: "Ducharse",
              duration: classes.Duration.new.config({ expression: "20min" }).toObject(),
            }),
            classes.Action.new.config({
              name: "Desayunar",
              duration: classes.Duration.new.config({ expression: "20min" }).toObject(),
            }),
            classes.Action.new.config({
              name: "Reflexión estática",
              duration: classes.Duration.new.config({ expression: "20min" }).toObject(),
            }),
          ]
        }),
      }).registerInto(calendar);

    });


  });


};