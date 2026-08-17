/// @ATENCIÓN: esta es la entry de refrescador en proyectos basados en DevBinaryV6
/// @ATENCIÓN: puede que me arrepienta de esta decisión, de separar el entry del directorio
/// @ATENCIÓN: incluso lo óptimo sería no requerir de ese directorio desde refrescador ya

// Si haces esto, tienes que duplicar el directorio en el @/dist/:
// module.exports = require(__dirname + "/refrescador/refrescador.api.dist.js");
// Pero puedes hacer esto y funcionará igual sin duplicar el directorio:
module.exports = require(require("path").resolve(__dirname + "/../../../src/external/refrescador/refrescador.api.dist.js"));