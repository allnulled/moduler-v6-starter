module.exports = async function ({ file, devbin }) {
  Recompilar_el_index_html: {
    // @ACTIVAR si quieres compilar el index.html al final de cualquier cambio:
    // await require(`${__dirname}/../bin.js`).utils.touchFile("@/src/www/index.html");
  }
  Copiar_los_punto_tyla_de_src_a_dist: {
    if (file.endsWith(".tyla")) {
      const rootpath = devbin.moduler.rootdirOf(file);
      if (rootpath.startsWith("@/src/www/")) {
        await devbin.files.copyFile(rootpath, rootpath.replace("@/src/www/", "@/dist/www/"));
      } else if (rootpath.startsWith("@/src/")) {
        await devbin.files.copyFile(rootpath, rootpath.replace("@/src/", "@/dist/"));
      }
    }
  }
};