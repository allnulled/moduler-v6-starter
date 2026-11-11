class JsonStringifier {

  static stringify(input, beautify = true, callback = false) {
    /**@:
     * 
     * # JsonStringifier.stringify(input:any, beautify:boolean=true)
     * 
     * - `input:any`: valor a stringificar
     * - `beautify:boolean=true`: si lo quieres embellecer
     * - ventajas:
     *    - imprime bien instancias de "Error"
     *    - previene de circularidad
     *    - transforma Function con .toString()
     * 
     */
    const seen = new WeakSet();
    const replacer = function (key, value) {
      if(callback) {
        const out = callback(key, value);
        if(typeof out !== "undefined") return out;
      }
      if (value instanceof Error) {
        return value.toObject();
      }
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      if(typeof value === "function") {
        return value.toString();
      }
      return value;
    };
    return JSON.stringify(input, replacer, beautify ? 2 : 0);
  }

}