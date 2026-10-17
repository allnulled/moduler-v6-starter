Sí, está bastante más cerca. La idea de pasar dataIndexIncreaser a _validateSpreadableType me parece buena: permite que cada elemento decida cuántas posiciones consume sin acoplar esa lógica al bucle principal.
Pero todavía veo cuatro problemas importantes en la implementación actual.
1. El multiplicador debe distinguirse de su ausencia
En el parser tienes:
Multiplicable=
  e:Evaluable _
  multiplier:Multiplier_symbol?
  { return { ...e, multiplier: multiplier || undefined } }

Aunque no haya multiplicador, el AST contiene la propiedad multiplier, con valor undefined. Por tanto:
hasMultiplier = "multiplier" in memory.localAst;

devuelve true también para los elementos normales.
Cambio mínimo:
hasMultiplier = memory.localAst.multiplier !== undefined;

2. El cursor avanza, pero la validación no lo sigue
Ahora haces:
const output = this._validateDataRecursively(memory);

Y después:
dataIndexIncreaser();

El problema es que memory.dataPointer no cambia. En cada iteración vuelves a validar el mismo elemento, aunque avances el cursor del array.
Necesitas construir una memoria para cada posición que se valide, utilizando el índice actual. Por ejemplo, puedes pasar el índice a una función que cree la memoria correspondiente, o actualizar el diseño de _validateSpreadableType para que reciba el cursor y construya cada submemoria.
3. Hay un error al registrar el checkpoint
Tienes:
memory.result.addCheckpoint(memory, `listable (${localAst.id})`);

localAst no está declarado en ese método. Puedes obtenerlo de memory.localAst, pero también debes considerar que un elemento puede ser una operación, un array o un spread, y no tener id.
De momento, usaría un nombre fijo:
memory.result.addCheckpoint(memory, "listable");

4. Falta comprobar que se haya consumido el array completo
Este es el motivo por el que tu prueba:
["[string,number]", [0, 0, {}]]

debe fallar: la expresión solo define dos elementos, pero los datos contienen tres.
Al terminar _validateArrayType, necesitas comprobar que el número de elementos consumidos coincide con la longitud de los datos:
if (currentDataIndex !== memory.localData.length) {
  // Devolver un error de validación.
}

Esto presupone que cada elemento del AST consume exactamente una posición, algo que no se cumple con los spreads y sus multiplicadores. Por eso, la comprobación debe realizarse una vez que la lógica de consumo de esos elementos esté bien definida.
Mi recomendación
Mantendría tu estructura actual, pero definiría primero el contrato de _validateSpreadableType:
- Entrada: la memoria del elemento del AST y la posición actual del array.
- Salida: error si la validación falla; en caso de éxito, el número de posiciones consumidas.
- Responsabilidad: validar los elementos correspondientes sin perder la posición actual.
Así, _validateArrayType podría encargarse de recorrer memory.localAst.items, sumar las posiciones consumidas y comprobar al final que no queden elementos sin validar.
Hay una decisión de diseño que conviene resolver antes de escribir el código: ¿quieres que ...[a,b]* consuma repeticiones completas de [a,b] —es decir, parejas de elementos— o que cada elemento del patrón pueda repetirse independientemente?
Por la estructura de tu AST y los ejemplos que has escrito, entiendo que quieres lo primero. Si es así, el contador debe avanzar según el número de elementos que consume cada repetición del patrón, no simplemente en una posición por iteración.