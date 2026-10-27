class Timeout{
  
  static {
    $moduler.toolkit.makeClass([
      // Std.interfaces.InstantiableInterface,
    ], this);
  }
  
  static of(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

}