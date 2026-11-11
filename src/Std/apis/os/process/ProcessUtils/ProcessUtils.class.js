class ProcessUtils {

  static exit(...args) {
    console.log(...args);
    if(typeof process !== "undefined") {
      process.exit(0);
    }
  }

}