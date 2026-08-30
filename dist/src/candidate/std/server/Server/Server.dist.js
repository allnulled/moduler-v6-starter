module.exports = $moduler.import([
  "@/dist/src/candidate/std/communication/WebsocketCommunication/WebsocketCommunication.dist.js"
  "@/dist/src/candidate/std/application/ServerSideApplication.dist.js"
], function(dependencies) {
  const [WebsocketCommunication, ServerSideApplication] = dependencies;
  return class Server {
    static WebsocketCommunication = WebsocketCommunication;
    static ServerSideApplication = ServerSideApplication;
    static create(...args) { return new this(...args); }
    constructor() {
      this.application = express.app;
      this.server = nodejs.server;
      this.endpoints = {};
      this.actions = {};
      this.reactions = {};
    }
    registerEndpoint() {}
    registerReaction() {}
    start() {}
    stop() {}
  };
});