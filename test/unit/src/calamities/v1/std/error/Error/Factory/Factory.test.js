const devbin = require(__dirname + "/../../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../../dist/src/candidate/std/error/Error/Factory/Factory.dist.js");

module.exports = (async function () {
      
    const ErrorFactory = await target;

    ErrorFactory.new
        .name("TypeError")
        .message("type inserted at «wherever» is not correct")
        .add("Error message in a bottle. Of string.")
        .add(ErrorFactory.new.name("SystemicalError").message("Come on, the system").add("SystemDidNotWorkError").build())
        .add(ErrorFactory.new.name("MathematicalError").message("Come on, the numbers").build())
        .throw();
    
})();