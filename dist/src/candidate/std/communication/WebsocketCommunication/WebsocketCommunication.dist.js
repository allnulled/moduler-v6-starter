module.exports = $moduler.import([], function () {
  return (() => {
    let __firstHolder = {};
    let __originalHolder = __firstHolder;
    const module = {
      get exports() {
        return __originalHolder;
      },
      set exports(value) {
        __originalHolder = value;
      },
    };
    const exports = module.exports;
    const __result = (() => {
      class WebsocketCommunication {
        static Settings = class WebsocketCommunicationSettings {
          /**
           * # Settings.class
           * - section: std.communication.WebsocketCommunication.Settings.Settings.class
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/Settings/Settings.class.js
           */
          constructor() {
            /**
             * # constructor
             * - section: std.communication.WebsocketCommunication.Settings.constructor
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Settings/constructor.js
             */
          }
        };
        static Client = class WebsocketCommunicationClient {
          /**
           * # Client.class
           * - section: std.communication.WebsocketCommunication.Client.Client.class
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/Client/Client.class.js
           */
          constructor() {
            /**
             * # constructor
             * - section: std.communication.WebsocketCommunication.Client.constructor
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Client/constructor.js
             */
          }
        };
        static Server = class WebsocketCommunicationServer {
          /**
           * # Server.class
           * - section: std.communication.WebsocketCommunication.Server.Server.class
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/Server/Server.class.js
           */
          constructor() {
            /**
             * # constructor
             * - section: std.communication.WebsocketCommunication.Server.constructor
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Server/constructor.js
             */
          }
        };
        static Reactor = class Reactor {
          /**
           * # Reactor.class
           * - section: std.communication.WebsocketCommunication.Reactor.Reactor.class
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/Reactor/Reactor.class.js
           */
          static Action = class Action {
            /**
             * # Action.class
             * - section: std.communication.WebsocketCommunication.Reactor.Action.Action.class
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Reactor/Action/Action.class.js
             */
            constructor() {
              /**
               * # constructor
               * - section: std.communication.WebsocketCommunication.Reactor.Action.constructor
               * - file:    @/src/candidate/std/communication/WebsocketCommunication/Reactor/Action/constructor.js
               */
            }
          };
          assert() {
            /**
             * # prototype.assert
             * - section: std.communication.WebsocketCommunication.Reactor.prototype.assert
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Reactor/prototype.assert.js
             */
          }
          defineActionOf(id, callback) {
            /**
             * # prototype.defineActionOf
             * - section: std.communication.WebsocketCommunication.Reactor.prototype.defineActionOf
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Reactor/prototype.defineActionOf.js
             */
          }
          getActionOf(action) {
            /**
             * # prototype.getActionOf
             * - section: std.communication.WebsocketCommunication.Reactor.prototype.getActionOf
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Reactor/prototype.getActionOf.js
             */
          }
          on(action, reaction) {
            /**
             * # prototype.on
             * - section: std.communication.WebsocketCommunication.Reactor.prototype.on
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Reactor/prototype.on.js
             */
          }
          constructor() {
            /**
             * # constructor
             * - section: std.communication.WebsocketCommunication.Reactor.constructor
             * - file:    @/src/candidate/std/communication/WebsocketCommunication/Reactor/constructor.js
             */
            this.actions = {};
            this.reactions = {};
          }
        };
        static create() {
          /**
           * # static.create
           * - section: std.communication.WebsocketCommunication.static.create
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/static.create.js
           */
        }
        constructor() {
          /**
           * # constructor
           * - section: std.communication.WebsocketCommunication.constructor
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/constructor.js
           */
        }
        _createServer() {
          /**
           * # prototype._createServer
           * - section: std.communication.WebsocketCommunication.prototype._createServer
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/prototype._createServer.js
           */
        }
        _createClient() {
          /**
           * # prototype._createClient
           * - section: std.communication.WebsocketCommunication.prototype._createClient
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/prototype._createClient.js
           */
        }
        createServer() {
          /**
           * # prototype.createServer
           * - section: std.communication.WebsocketCommunication.prototype.createServer
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/prototype.createServer.js
           */
        }
        createClient() {
          /**
           * # prototype.createClient
           * - section: std.communication.WebsocketCommunication.prototype.createClient
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/prototype.createClient.js
           */
        }
        static globalInstance() {
          /**
           * # static.globalInstance
           * - section: std.communication.WebsocketCommunication.static.globalInstance
           * - file:    @/src/candidate/std/communication/WebsocketCommunication/static.globalInstance.js
           */
        }
      }
    })();
    let __output = undefined;
    const __returnsUndefined = () => typeof __result === "undefined";
    const __isSameEmptyObject = () =>
      module.exports === __firstHolder &&
      Object.keys(__firstHolder).length === 0;
    if (!__returnsUndefined()) {
      __output = module.exports = __result;
    } else if (!__isSameEmptyObject()) {
      __output = module.exports;
    }
    return __output;
  })();
});
