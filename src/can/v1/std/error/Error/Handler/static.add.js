static add(newError) {
  return (error) => {
    ErrorHandler.pick(error).add(newError).rethrow();
  }
}