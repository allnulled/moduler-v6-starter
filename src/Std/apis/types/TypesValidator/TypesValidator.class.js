class TypesValidator {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TypesValidatorInterface,
    ], this);
  }
  static {
    this.globalInstance = this.$ = Std.objects.GlobalTypesValidator = this.new;
  }
}