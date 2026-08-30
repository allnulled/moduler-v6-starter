module.exports = function({ devbin }) {
  let settingsProfile;
  settingsProfile = "clean";
  settingsProfile = "debug";
  const profiles = {
    debug: () => {
      // Restart logger
      devbin.compiler._initializeLogger(`${__dirname}/logs/`);
      // Logger by console off
      devbin.compiler._logger.current.setOption("development-setup", false);
      // Logger resets file
      devbin.compiler._logger.resetFile("Setup started");
      // Tracer off
      devbin.compiler._tracer.activate(1);
      // Logger by tracing
      devbin.compiler._tracer.isLogging = true;
    },
    clean: () => {
      // Restart logger
      devbin.compiler._initializeLogger(`${__dirname}/logs/`);
      // Logger by console off
      devbin.compiler._logger.current.setOption("development-setup", false);
      // Logger resets file
      devbin.compiler._logger.resetFile("Setup started");
      // Tracer off
      devbin.compiler._tracer.activate(0);
      // Logger by tracing
      devbin.compiler._tracer.isLogging = false;
    }
  }
  Configuraciones_iniciales: {
    profiles[settingsProfile]();
  }
};