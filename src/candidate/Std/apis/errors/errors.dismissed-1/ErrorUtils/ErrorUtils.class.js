class ErrorUtils {

  static stringifyError(errorBrute, subindex = []) {
    const error = Error.normalize(errorBrute);

    //*
    let text = "";
    if(subindex.length) {
      text += `{${subindex.join(".")}} `;
    }
    text += `${error.name}`;
    text += ` => `;
    text += `${error.message}`;
    //text += `\n[[\n${error.stack.split("\n").map(line => "  " + line).join("\n").trimEnd()}\n]]`;
    if(error.stack) {
      text += `\n${Std.classes.ErrorDissector.dissectToJsonString(error)}`;
    }
    if(error.std?.history.length) {
      const subtext = error.std.history.map((suberror, index) => {
        return ErrorUtils.stringifyError(suberror, subindex.concat([`${index+1}/${error.std.history.length}`]));
      }).join("\n");
      text += `\n${subtext}`;
    }
    //*/
    return text;
  }

}