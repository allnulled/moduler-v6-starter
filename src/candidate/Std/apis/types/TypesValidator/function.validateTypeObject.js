async function validateTypeObject(validator, data, step, state) {
  const keys = Object.keys(validator.properties || {});
  const validation = {};
  Validating_properties:
  for (let index = 0; index < keys.length; index++) {
    let subvalidation;
    const key = keys[index];
    const subvalidator = validator.properties[key];
    Skip_by_optionalProperty: {
      if ((subvalidator.optionalProperty === true) && (typeof data[key] === "undefined")) {
        subvalidation = {
          "*type": "object",
          value: data[key],
          validated: true,
          because: "optional property",
          fails: [Error.normalize({ name: "ValidationWarning", message: `Property «${keys.slice(0, index).join(".")}» is optional and missing` })],
        };
        continue Validating_properties;
      }
    }
    try {
      subvalidation = await this.validateData(validator.properties[key], data[key], state, step.newClone.config({
        dataPointer: step.dataPointer.concat([key]),
        validatorPointer: step.dataPointer.concat(["properties", key]),
      }));
    } catch (error) {
      throw error;
    }
    validation[key] = subvalidation;
  }
  return step.result = validation;
}