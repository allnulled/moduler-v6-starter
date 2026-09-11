const devbin = require(__dirname + "/../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../dist/src/candidate/Cycler/Cycler.dist.js");

module.exports = (async function () {

    devbin.assert(true, "Test is empty right now");

    const Cycler = await target;

    const cycler = Cycler.new.configure({
        name: "Carl",
        formatGreeting: ({ name, greeting }) => greeting.replace("%s", name),
        validate: () => 1,
        format: () => 2,
        digest: () => 3,
        return: () => 4,
    });
    
    const output1 = cycler.make("formatGreeting", { greeting: "Hello, %s!" });
    const output2 = cycler.make(["formatGreeting"], { greeting: "Hi, %s!" });
    const output3 = cycler.make(["validate","format","digest","return"], { greeting: "Hi, %s!" });

    devbin.assert(output1 === "Hello, Carl!", "Can use configure and make interfaces from Cycler.prototype (1)");
    devbin.assert(output2[0] === "Hi, Carl!", "Can use configure and make interfaces from Cycler.prototype (2)");
    devbin.assert(output3[0] === 1, "Can use configure and make interfaces from Cycler.prototype (10)");
    devbin.assert(output3[1] === 2, "Can use configure and make interfaces from Cycler.prototype (20)");
    devbin.assert(output3[2] === 3, "Can use configure and make interfaces from Cycler.prototype (30)");
    devbin.assert(output3[3] === 4, "Can use configure and make interfaces from Cycler.prototype (40)");

    //Cycler.new.configure(Instructions.of("Función de nosequé", "Parte 1: validación")).make("start");

})();