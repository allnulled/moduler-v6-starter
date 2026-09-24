async function (title, callback, options = {}, extensions = {}, baseTester = false) {
  
  Validate_parameters: {
    $moduler.assert(typeof title === "string", "Required parameter «title» to be string on «Tester.start»");
    $moduler.assert(typeof callback === "function", "Required parameter «callback» to be function on «Tester.start»");
    $moduler.assert(typeof options === "object", "Required parameter «options» to be object on «Tester.start»");
  }
  
  let tester, result;

  Create_tester: {
    tester = baseTester || Std.classes.Tester.new.config({
      ...extensions,
      title,
      options,
      parent: null,
    });
  }

  Print_start: {
    if(tester.parent === null) {
      Std.objects.Ansi.style("cyan,underline").print(`[*] [Std.all.Tester] begins collection: ${title}`);
    } else {
      Std.objects.Ansi.style("blackBright").print(`[*] [Std.all.Tester] begins case «${title}»`);
    }
  }
  
  Execute_tests: {
    result = await Std.classes.Tester.evaluateCallback(callback, {
      collection: title,
      progresser: Std.classes.Progresser.new,
      tester: tester,
      asserter: Std.classes.Asserter.new.config({
        // onAssertSuccess: function() {},
        // onAssertFailure: function() {}
      })
    });
  }
  
  Report_case: {
    if (result instanceof Error) {
      Std.objects.Ansi.style("red").print(`[!] [Std.all.Tester] failed case «${title}», more details:`);
      console.log(result);
      tester.getRoot().errors.push({ title: tester.getFullTitle(), error: result });
    } else if(tester.parent !== null) {
      Std.objects.Ansi.style("green").print(`[*] [Std.all.Tester] passed case «${title}» successfully`);
    }
  }

  Report_on_root: {
    if(tester.parent === null) {
      if(tester.errors.length) {
        Std.objects.Ansi.style("red,underline").print(`[!] [Std.all.Tester] reporting ${tester.errors.length} errors from collection «${title}»:`);
        console.log(Error.formatList(tester.errors));
        Std.objects.Ansi.style("bgRed,black,underline").print(`[!] [Std.all.Tester] failed collection «${title}» with ${tester.errors.length} errors.`);
      } else {
        Std.objects.Ansi.style("bgGreen,black,underline").print(`[*] [Std.all.Tester] passed collection «${title}» succesfully`);
      }
    }
  }

  return result;

}