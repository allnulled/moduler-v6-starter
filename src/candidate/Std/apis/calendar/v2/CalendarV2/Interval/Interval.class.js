class Interval {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
    ], this);
  }
  static validate(intervalInput) {
    $moduler.assert(typeof intervalInput === "object", `Required parameter «intervalInput» to be object but «${typeof intervalInput}» was found instead on «Interval.validate»`);
    $moduler.assert(typeof intervalInput.from === "object", `Required parameter «intervalInput.from» to be object but «${typeof intervalInput.from}» was found instead on «Interval.validate»`);
    $moduler.assert(typeof intervalInput.to === "object", `Required parameter «intervalInput.to» to be object but «${typeof intervalInput.to}» was found instead on «Interval.validate»`);
    Std.classes.CalendarV2.TimePattern.validate(intervalInput.from);
    Std.classes.CalendarV2.TimePattern.validate(intervalInput.to);
  }
}