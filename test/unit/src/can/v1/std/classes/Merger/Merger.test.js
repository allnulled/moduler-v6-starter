const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/classes/Merger/Merger.dist.js");

module.exports = async function () {
      
    const Merger = await target;

    const out = Merger.byStrategy({
        // Caso 1: preferimos la urgencia más alta
        urgency: function(list) {
            return Math.max(...list);
        },
        // Caso 2: preferimos la distancia más corta
        location: function(list) {
            return Math.min(...list);
        },
        // Caso 3: un array de funciones y queremos agruparlas en 1 función e ignorar no-functions
        newInstance: function(list) {
            return (...args) => list.filter(item => typeof item === "function").map(item => item.call(this, ...args));
        }
    }, [{
        urgency: 10,
        location: 30,
        newInstance: function() {
            return "constructor from 1";
        },
    }, {
        urgency: 40,
        location: 98,
        newInstance: function() {
            return "constructor from 2";
        },
    }, {
        urgency: 60,
        location: 80,
        newInstance: function() {
            return "constructor from 3";
        },
    }]);

    console.log(out);

    devbin.assert(out.urgency === 60);
    devbin.assert(out.location === 30);
    devbin.assert(out.newInstance()[0] === "constructor from 1");

    throw new Error("OKKK")
    
};