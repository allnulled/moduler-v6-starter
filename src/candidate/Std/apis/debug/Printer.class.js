class Printer {
  static debug(...args) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      console.log(index + ": " + typeof arg, arg);
    }
  }
  static json(...args) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      try {
        console.log(index + ": " + typeof arg, JSON.stringify(arg, null, 2));
      } catch (error) {
        console.log(index + ": " + typeof arg, arg);
      }
    }
  }

  static exiting = false;
  static currentQuestion = null;
  static questionsCloser() {
    this.exiting = true;
    if (this.currentQuestion) {
      this.currentQuestion.close();
      this.currentQuestion = null;
    }
  }
  static {
    process.once("SIGINT", this.questionsCloser);
    process.once("SIGTERM", this.questionsCloser);
  }
  static async ask(question, options = {}, ...others) {
    if (this.exiting) {
      throw new Error("Process exiting");
    }
    this.debug(...others);
    const rl = require("readline").promises.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.currentQuestion = rl;
    try {
      if (this.exiting) {
        throw new Error("Process exiting");
      }
      return await rl.question(question);
    } catch (error) {
      if (error.code === "ABORT_ERR") {
        this.exiting = true;
        return;
      }
      throw error;
    } finally {
      if (this.currentQuestion === rl) {
        this.currentQuestion = null;
      }
      rl.close();
    }
  }
}