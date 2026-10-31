class Book {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
    ], this);
  }
  onCreate() {
    this.instructions = [];
  }
  addInstruction(instructionBrute) {
    const instruction = Std.all.CalendarV2.Instruction.create(instructionBrute);
    this.instructions.push(instruction);
  }
}