module.exports = function () {
  const opts = ["↑", "↓", "←", "→"];
  // @TAREA: Tengo que imprimir todas las combinaciones de 2, 3 y 4 posibles.
  function combinations(list, size, start = 0, current = []) {
    if (current.length === size) {
      console.log(current.join(""));
      return;
    }
    for (let index = start; index < list.length; index++) {
      combinations(list, size, index + 1, [...current, list[index]]);
    }
  };
  for (let size = 2; size <= 4; size++) {
    combinations(opts, size);
  }
};

/*

{
  "↑←": "┘",
  "↑→": "└",
  "↑↓": "│",
  "←→": "─",
  "←↓": "┐",
  "→↓": "┌",

  "↑←→": "┴",
  "↑←↓": "┤",
  "↑→↓": "├",
  "←→↓": "┬",

  "↑←→↓": "┼",
}

*/