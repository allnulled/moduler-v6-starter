(function() {
  const Std = {};

  Object.assign(Std, {
    all: {},
    primitives: {},
    traits: {},
    interfaces: {},
    classes: {},
  });
  
  /*

  @trait Std.all.CanStaticNew = [
    + static new
  ]
  @trait Std.all.CanStaticCreate = [
    + static create
  ]
  @trait Std.all.CanConfig = [
    + config
  ]
  @trait Std.all.CanClone = [
    + clone 
  ]
  @trait Std.all.CanNewClone = [
    + newClone
  ]
  @trait Std.all.CanRunSync = [
    + runSync
  ]
  @trait Std.all.CanRunAsync = [
    + runAsync
  ]

  @interface Std.all.Creable = [
    Std.all.CanStaticNew
    Std.all.CanStaticCreate
  ]

  @interface Std.all.Configurable = [
    Std.all.CanConfig
  ]

  @interface Std.all.Clonable = [
    Std.all.CanClone
    Std.all.CanNewClone
  ]

  @interface Std.all.Construible = [
    Std.all.Creable
    Std.all.Configurable
    Std.all.Clonable
  ]
  
  @interface Std.all.Runnable = [
    Std.all.CanRunSync
    Std.all.CanRunAsync
  ]

  @interface Std.all.Isolable = [
    Std.all.Construible
    Std.all.Runnable
  ];

  @class Std.all.Isolation = [
    Std.all.Isolable
  ]

  //*/

  return Std;
})()