static normalize(error) {
  if (typeof error !== "object") return error;
  if (typeof error.std === "undefined") error.std = {};
  if (typeof error.std.history === "undefined") error.std.history = [];
  return error;
}