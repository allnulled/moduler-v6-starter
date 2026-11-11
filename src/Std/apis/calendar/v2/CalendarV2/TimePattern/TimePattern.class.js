class TimePattern {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
    ], this);
  }
  static validate(timePattern) {
    $moduler.assert(typeof timePattern === "object", `Required parameter «timePattern» to be object but «${typeof timePattern}» was found instead on «TimePattern.validate»`);
    if("year" in timePattern) $moduler.assert(this.isValidDatePart(timePattern.year), `Required parameter «timePattern.year» to be '*', number or false but «${timePattern.year}» was found instead on «TimePattern.validate»`);
    if("month" in timePattern) $moduler.assert(this.isValidDatePart(timePattern.month), `Required parameter «timePattern.month» to be '*', number or false but «${timePattern.month}» was found instead on «TimePattern.validate»`);
    if("day" in timePattern) $moduler.assert(this.isValidDatePart(timePattern.day), `Required parameter «timePattern.day» to be '*', number or false but «${timePattern.day}» was found instead on «TimePattern.validate»`);
    if("weekday" in timePattern) $moduler.assert(this.isValidDatePart(timePattern.weekday), `Required parameter «timePattern.weekday» to be '*', number or false but «${timePattern.weekday}» was found instead on «TimePattern.validate»`);
    if("hour" in timePattern) $moduler.assert(this.isValidDatePart(timePattern.hour), `Required parameter «timePattern.hour» to be '*', number or false but «${timePattern.hour}» was found instead on «TimePattern.validate»`);
    if("minute" in timePattern) $moduler.assert(this.isValidDatePart(timePattern.minute), `Required parameter «timePattern.minute» to be '*', number or false but «${timePattern.minute}» was found instead on «TimePattern.validate»`);
  }
  static isValidDatePart(year) {
    if(typeof year === "number") return true;
    if(year === "*") return true;
    if(year === false) return true;
    return false;
  }
  static validWeekdays = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
  static isValidWeekday(weekday) {
    if(this.validWeekdays.includes(weekday)) return true;
    if(weekday === false) return true;
    return false;
  }
}