module.exports = function () {
  const { Progresser } = Std.all;
  const progress1 = Progresser.new;

  progress1.setProgressTotal(20);

  const sp1 = progress1.createSubprogress({ total: 4 });
  const sp2 = progress1.createSubprogress({ total: 4 });
  const sp3 = progress1.createSubprogress({ total: 4 });

  sp1.setProgressTotal(2);
  sp1.advanceProgress(1);
  sp1.advanceProgress(1);

  sp2.setProgressTotal(5);
  sp2.advanceProgress(1);
  sp2.advanceProgress(1);
  sp2.advanceProgress(1);
  sp2.advanceProgress(1);

  sp3.setProgressTotal(2);
  sp3.advanceProgress(1);

  $moduler.assert(
    progress1.percent === "76.67%",
    "Std.classes.Progresser puede actualizar al padre según los hijos (1)",
  );
  $moduler.assert(
    sp1.percent === "100.00%",
    "Std.classes.Progresser puede actualizarse el porcentaje bien (2)",
  );
  $moduler.assert(
    sp2.percent === "80.00%",
    "Std.classes.Progresser puede actualizarse el porcentaje bien (3)",
  );
  $moduler.assert(
    sp3.percent === "50.00%",
    "Std.classes.Progresser puede actualizarse el porcentaje bien (4)",
  );
};
