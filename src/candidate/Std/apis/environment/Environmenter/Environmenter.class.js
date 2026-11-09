class Environmenter {
  /**
   * 
   * # Std.classes.Environmenter
   * 
   * - Es una clase global no instanciable.
   * - Tiene 2 propiedades estáticas:
   *    - isBrowser:Boolean
   *    - isNodejs:Boolean
   * 
   */
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.EnvironmenterInterface,
    ], this);
    Browser_environmentals: {
      this.browser.isLocalhost = this.isBrowser && ["localhost", "127.0.0.1"].includes(window.location.hostname);
      this.browser.isGithubPages = this.isBrowser && (/\.github\.io$/i).test(window.location.hostname);
      this.browser.isMobile = undefined;
      this.browser.isDesktop = undefined;
      this.browser.isGoogleChrome = undefined;
      this.browser.isFirefox = undefined;
    }
    Nodejs_environmentals: {
      this.nodejs.isWindows = undefined;
      this.nodejs.isLinux = undefined;
    }
  }
}