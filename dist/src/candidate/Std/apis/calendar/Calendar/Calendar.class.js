class Calendar {

  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.CalendarInterface,
    ], this);
  }

  static globalInstance = new this();

}