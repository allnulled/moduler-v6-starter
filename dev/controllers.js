module.exports = function({ app }) {
  app.post("/dev/coverage/commit", function(request, response) {
    Persist_coverage_as_json: {
      // @TODO: persistir el reporte de cobertura del instrumentado.
      console.log("Hay que pasarle el objeto de cov del instrumentado por aquí:");
      console.log("(Parte en proceso de desarrollo)");
      console.log(request.body);
    }
    response.status(200).json({
      message: "El estado de la cobertura de código fue actualizado exitosamente",
    });
  });
  app.use("/dev/coverage", require("express").static(`${__dirname}/coverage`));
  return [
    ["build-cov", "/dev/coverage/commit [POST]"],
    ["see-cov", "/dev/coverage"],
  ];
};