class JsonParser {
  static stringify(data, spaces = 0) {
    return JSON.stringify(data, (key, value) => {
      if (value instanceof Error) {
        return {
          type: "Error",
          name: value.name,
          message: value.message,
          stack: value.stack
        };
      }
      if (value instanceof Map) {
        return {
          type: "Map",
          entries: [...value.entries()]
        };
      }
      if (value instanceof RegExp) {
        return {
          type: "RegExp",
          source: value.source,
          flags: value.flags
        };
      }
      return value;
    }, 2);
  }
}