// @interface:AsserterInterface
{
  prototype: {
    matchesError: function(expectedError, error) {
      if (expectedError === false) return true;
      if (typeof expectedError === "function") {
        return expectedError(error);
      } else if (typeof expectedError === "object") {
        if (expectedError.name && (expectedError.name !== error.name)) return false;
        if (expectedError.message && (expectedError.message !== error.message)) return false;
        return true;
      } else if (typeof expectedError === "string") {
        if (![expectedError.name, expectedError.message].includes(expectedError)) return false;
        return true;
      } else throw new Error("Parameter «expectedError» must be function, object or string");
    },
    assert: function(condition, message = "untitled error", ...otherParameters) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "AsserterInterface.prototype.assert" });
      const eventParameters = [condition, message].concat(otherParameters);
      Std.functions.triggerMethodIfExists(this, "onAssertStart", eventParameters);
      if (condition) {
        Std.functions.triggerMethodIfExists(this, "onAssertSuccess", eventParameters);
      } else {
        Std.functions.triggerMethodIfExists(this, "onAssertError", eventParameters);
      }
      Std.functions.triggerMethodIfExists(this, "onAssertEnd", eventParameters);
      if (!condition) {
        const error = new Error(message);
        error.name = "AssertionError";
        $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "AsserterInterface.prototype.assert" });
        throw error;
      }
      $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "AsserterInterface.prototype.assert" });
      return true;
    },
    assertThrowsSync: function(callback, message = "", expectedError = false) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "AsserterInterface.prototype.assertThrowsSync" });
      let thrownError = false;
      const fakeError = new Error();
      try {
        callback();
        throw fakeError;
      } catch (error) {
        if (error !== fakeError) {
          thrownError = error;
        }
      }
      if (!thrownError) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "AsserterInterface.prototype.assert" });
        throw new Error(`Method «assertThrowsSync» expected callback to throw but it did not on: ${message}`);
      }
      if (!this.matchesError(expectedError, thrownError)) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "AsserterInterface.prototype.assert" });
        throw new Error(`Method «assertThrowsSync» expected one error but got another:\n  - expected: ${expectedError.name} | ${expectedError.message}\n  - current:  ${thrownError.name} | ${thrownError.message}`)
      }
      $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "AsserterInterface.prototype.assert" });
      return true;
    },
    assertThrowsAsync: async function(callback, message = "", expectedError = false) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "AsserterInterface.prototype.assertThrowsAsync" });
      let thrownError = false;
      const fakeError = new Error();
      try {
        await callback();
        throw fakeError;
      } catch (error) {
        if (error !== fakeError) {
          thrownError = error;
        }
      }
      if (!thrownError) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "AsserterInterface.prototype.assertThrowsAsync" });
        throw new Error(`Method «assertThrowsAsync» expected callback to throw but it did not on: ${message}`);
      }
      if (!this.matchesError(expectedError, thrownError)) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "AsserterInterface.prototype.assertThrowsAsync" });
        throw new Error(`Method «assertThrowsSync» expected one error but got another:\n  - expected: ${expectedError.name} | ${expectedError.message}\n  - current:  ${thrownError.name} | ${thrownError.message}`)
      }
      $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "AsserterInterface.prototype.assertThrowsAsync" });
      return true;
    },
    assertDoesNotThrowSync: function(callback, message = "") {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "AsserterInterface.prototype.assertThrowsAsync" });
      let thrownError = false;
      const fakeError = new Error();
      try {
        callback();
        throw fakeError;
      } catch (error) {
        if (error !== fakeError) {
          thrownError = error;
        }
      }
      if (thrownError) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "AsserterInterface.prototype.assertDoesNotThrowSync" });
        throw thrownError;
      }
      $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "AsserterInterface.prototype.assertDoesNotThrowSync" });
      return true;
    },
    assertDoesNotThrowAsync: function(callback, message = "") {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "AsserterInterface.prototype.assertDoesNotThrowAsync" });
      let thrownError = false;
      const fakeError = new Error();
      try {
        callback();
        throw fakeError;
      } catch (error) {
        if (error !== fakeError) {
          thrownError = error;
        }
      }
      if (thrownError) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "AsserterInterface.prototype.assertDoesNotThrowAsync" });
        throw thrownError;
      }
      $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "AsserterInterface.prototype.assertDoesNotThrowAsync" });
      return true;
    },
  },
  static: { },
}