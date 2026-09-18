class BooleanUtil {
  static areEqual(...args) {
    let previous = args[0];
    for(let index=1; index<args.length; index++) {
      const arg = args[index];
      if(arg !== previous) return false;
      previous = arg;
    }
    return true;
  }
}