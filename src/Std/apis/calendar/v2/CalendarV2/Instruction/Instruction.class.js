class Instruction {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
    ], this);
  }
  onCreate(parameters) {
    $moduler.assert(typeof parameters === "object");
    $moduler.assert(typeof parameters.timePattern !== "undefined", `Required property «timePattern» to be function on «CalendarV2.Instruction.prototype.onCreate»`);
    $moduler.assert(typeof parameters.activityPattern !== "undefined", `Required property «activityPattern» to be function on «CalendarV2.Instruction.prototype.onCreate»`);
    Object.assign(this, parameters);
  }
}