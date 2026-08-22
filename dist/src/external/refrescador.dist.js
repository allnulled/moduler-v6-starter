module.exports = function() {
  try {
    require(require("path").resolve(__dirname + "/refrescador/refrescador.api.dist.js"));
  } catch (error) {
    require(require("path").resolve(__dirname + "/../../../src/external/refrescador/refrescador.api.dist.js"));
  }
}();