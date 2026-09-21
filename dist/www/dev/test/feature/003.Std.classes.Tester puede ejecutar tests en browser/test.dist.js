module.exports = function () {
  Std.all.Tester.evaluateCallback(
    function ({ progresser }) {
      progresser.setProgressTotal(10);
      progresser.advanceProgress(1);
      progresser.advanceProgress(1);
      progresser.advanceProgress(1);
      progresser.advanceProgress(1);
      progresser.advanceProgress(1);
      progresser.advanceProgress(1);
      progresser.advanceProgress(1);
      progresser.advanceProgress(1);
      // progresser.advanceProgress(1);
      progresser.advanceProgress(1);
      // console.log(progresser);
    },
    {
      htmlElement: Std.all.Domer.insertElementById("std-tester"),
    },
  );
};
