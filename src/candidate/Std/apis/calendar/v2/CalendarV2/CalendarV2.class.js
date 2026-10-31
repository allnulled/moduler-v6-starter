(function() {
  const CalendarV2 = class CalendarV2 {
    // $ compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/Utils/Utils.class.js");
    static Utils = class Utils {
      // @CHATGPT aqui para que puedas poner métodos utilitarios
    };
    static Action = $compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/Action/Action.class.js");
    static Activity = $compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/Activity/Activity.class.js");
    static Book = $compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/Book/Book.class.js");
    static Duration = $compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/Duration/Duration.class.js");
    static Interval = $compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/Interval/Interval.class.js");
    static Instruction = $compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/Instruction/Instruction.class.js");
    static TimePattern = $compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/TimePattern/TimePattern.class.js");
    static ActivityFactory = $compiler.inject.source("@/src/candidate/Std/apis/calendar/v2/CalendarV2/ActivityFactory/ActivityFactory.class.js");
    static from = {
      timePattern: {
        to: {
          timeMatrix: (timePattern, timeInterval) => {
            this.TimePattern.validate(timePattern);
            this.Interval.validate(timeInterval);
            const timeMatrix = [];
            Lo_chunguisimo_aqui_iria: {

            }
            return timeMatrix;
          },
        }
      },
      timeMatrix: {
        to: {
          timePoints: (timeMatrix, timeInterval) => {
            const timePoints = [];
            Lo_chunguisimo_aqui_iria: {

            }
            return timePoints;
          },
        }
      },
      timePoints: {
        to: {
          timeTree: (timePoints) => {
            const timeTree = [];
            Lo_chunguisimo_aqui_iria: {

            }
            return timeTree;
          },
        }
      }
    }
  };
  Precontexto_a_borrar: {
    Std.classes.CalendarV2 = CalendarV2;
  }
  Test_de_la_clase: {
    const predefinedInterval = {
      from: {
        year: 2026,
      },
      to: {
        year: 2026,
      }
    };
    const timeMatrix = CalendarV2.from.timePattern.to.timeMatrix({
      year: false,
      month: 1,
      day: 5,
      hour: 10,
      minute: 20,
    }, predefinedInterval);
    const timePoints = CalendarV2.from.timeMatrix.to.timePoints(timeMatrix, predefinedInterval);
    const timeTree = CalendarV2.from.timePoints.to.timeTree(timePoints, predefinedInterval);
    console.log(timeTree);
  }
  return CalendarV2;
})();