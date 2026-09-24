module.exports = async function ({ Std, devbin }) {
  devbin.tester.assertThrows(function() {
    Error.normalize({name:"OriginalError"}).rethrow();
  }, "Can throw throught Error.throw", {name: "OriginalError" });

};