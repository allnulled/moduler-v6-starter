const devbin = require(__dirname + "/../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../dist/src/candidate/oop/Reflection/Reflection.dist.js");

module.exports = (async function () {
      

    const { createClass } = await target;

    const Connection = createClass(async function (settings = {}) {
        this.settings = settings;
        await this.open();
        return this;
    }, {
        constructor: {
            create: function (...args) {
                return ConnectionPrototype.constructor(...args);
            },
        },
        open: async function () {
            await require("timers/promises").setTimeout(1000);
        },
        select: async function (where = []) {
            return "hi!";
        }
    });

    const Database = createClass(function (settings = {}) {
        this.settings = settings;
    }, {
        create: function (...args) {
            return this(...args);
        },
        openConnection: function (settings) {
            return Connection(settings);
        }
    }, {
        constructor: {},
        connect: async function (fallback = null) {
            try {
                console.log("[*] Trying to connect...");
                this.connection = await this.constructor.openConnection(this.settings);
                console.log("[*] Connected!");
                return this;
            } catch (error) {
                if (fallback) fallback(error);
                throw error;
            }
        },
        select: function (...args) {
            return this.connection.select(...args);
        }
    });

    Example_of_usage: {
        const db = Database({ host: "localhost", port: 3899 });
        console.log(db);
        console.log(db.prototype);
        await db.connect();
        const output = await db.select();
        console.log(output);
    }
    
})();