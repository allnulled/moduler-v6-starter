class Printer {

  static debug(...args) {
    /**@:
     * 
     * # Std.all.Printer.debug
     * 
     * - Acepta cualquier parámetro
     * - Imprime normal el índice, el tipo y el valor
     * 
     */
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      console.log(index + ": " + typeof arg, arg);
    }
  }
  static json(...args) {
    /**@:
     * 
     * # Std.all.Printer.json
     * 
     * - Acepta cualquier parámetro
     * - Imprime por json si puede, si no como Printer.debug
     * 
     */
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      try {
        console.log(index + ": " + typeof arg, JSON.stringify(arg, null, 2));
      } catch (error) {
        console.log(index + ": " + typeof arg, arg);
      }
    }
  }

  static {
    Object.assign(this, {
      // Esto es una guarrada pero no sé si se puede hacer de otra manera mejor
      exiting: false,
      currentQuestion: null,
      questionsCloser() {
        this.exiting = true;
        if (this.currentQuestion) {
          this.currentQuestion.close();
          this.currentQuestion = null;
        }
      },
      async ask(question, options = {}, ...others) {
        /**@:
         * 
         * # Std.classes.Printer.ask(question=string,options={},...others=[])
         * 
         * - Async function
         * - Pregunta al usuario por consola, parando la ejecución con await hasta que responda o se interrumpa el proceso
         * - Tiene una historieta para que si se interrumpe el proceso, que pasa con refrescador todo el rato, salga de las llamadas que se van a acumular de golpe al soltar.
         *    - Quiero decir, que hay una casuística que justifica
         * 
         */
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
    });
    if(Std.classes.Environmenter.isNodejs) {
      process.once("SIGINT", this.questionsCloser);
      process.once("SIGTERM", this.questionsCloser);
    }
  }

}