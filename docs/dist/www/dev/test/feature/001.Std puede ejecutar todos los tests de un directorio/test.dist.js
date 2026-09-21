module.exports = function () {
  console.log("Test 001");
  throw Error.normalize("Error en test 001").adding({
    name: "Suberror",
    message: "Collateral effects of this error",
  });
};
