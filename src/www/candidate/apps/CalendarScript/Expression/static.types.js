static types = {
  Abstracta: Expression,
  Fecha: $compiler.inject.module("./types/Fecha/Fecha.entry.js"),
  Hora: $compiler.inject.module("./types/Hora/Hora.entry.js"),
  Duracion: $compiler.inject.module("./types/Duracion/Duracion.entry.js"),
  Tarea: $compiler.inject.module("./types/Tarea/Tarea.entry.js"),
};