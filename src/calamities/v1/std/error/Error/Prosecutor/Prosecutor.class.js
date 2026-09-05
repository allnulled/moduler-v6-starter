class ErrorProsecutor {
  static prosecute(error) {
    ErrorDissector.dissect(error);
  }
}