static Drivers = $compiler.inject.source("./Drivers/Drivers.class.js");
static {
  // Se tiene que hacer así porque si no, no podrías alcanzar el Abstraction para los extends:
  Object.assign(this.Drivers, {
    ForIndexeddb: /*@injects:"./Drivers/ForIndexeddb/ForIndexeddb.class.js"*/,
    ForLocalStorage: /*@injects:"./Drivers/ForLocalStorage/ForLocalStorage.class.js"*/,
    ForNodejs: /*@injects:"./Drivers/ForNodejs/ForNodejs.class.js"*/,
    ForWebsocketServer: /*@injects:"./Drivers/ForWebsocketServer/ForWebsocketServer.class.js"*/,
    ForWebsocketClient: /*@injects:"./Drivers/ForWebsocketClient/ForWebsocketClient.class.js"*/,
  });
}