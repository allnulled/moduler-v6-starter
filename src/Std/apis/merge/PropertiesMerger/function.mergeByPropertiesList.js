function mergeByPropertiesList(instructions, input = []) {
  /**@:
   * 
   * # Std.classes.PropertiesMerger.mergeByPropertiesList
   * 
   * - Acepta:
   *    - instructions:object(key=string,merger=function(input:[previousValue,currentValue],output:nextValue=array))
   *    - input:array(object)
   * 
   */
  const output = {};
  // @PASO 1. Procesamos primero las propiedades más generales.
  const ordered = [...instructions].sort((a, b) => {
    return a[0].length - b[0].length;
  });
  // @PASO . Cada instrucción reduce los valores de todos los inputs.
  for (const [key, merger] of ordered) {
    let value = undefined;
    for (const item of input) {
      value = merger(value, Std.classes.Introspector.get(item, key));
    }
    Std.classes.Introspector.set(output, key, value);
  }
  return output;
}