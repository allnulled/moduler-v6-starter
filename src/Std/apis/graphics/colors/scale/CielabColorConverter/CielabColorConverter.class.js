class CielabColorConverter {

  static convert(value, max = 10) {
    if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0 || value < 0 || value > max) {
      throw new RangeError(`Value must be between 0 and ${max}`);
    }

    // ------------------------------------------------------------
    // 1. Convertir el valor a luminosidad CIELAB (L*)
    const lightness = value / max * 100;

    // ------------------------------------------------------------
    // 2. Convertir L* a luminancia lineal Y
    let luminance;
    if (lightness > 8) {
      luminance = Math.pow((lightness + 16) / 116, 3);
    } else {
      luminance = lightness / 903.3;
    }

    // ------------------------------------------------------------
    // 3. Convertir luminancia lineal a sRGB
    let channel;
    if (luminance <= 0.0031308) {
      channel = 12.92 * luminance;
    } else {
      channel = 1.055 * Math.pow(luminance, 1 / 2.4) - 0.055;
    }

    // ------------------------------------------------------------
    // 4. Generar el color hexadecimal
    const hex = Math.round(channel * 255).toString(16).padStart(2, "0");

    return `#${hex}${hex}${hex}`;
  }

  static convertRange(max = 100) {
    const output = {};
    for(let index=0; index<=max; index++) {
      output[index] = CielabColorConverter.convert(index, max);
    }
    return output;
  }

}