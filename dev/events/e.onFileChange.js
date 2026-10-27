module.exports = async function ({ file, devbin }) {
  Recompilar_el_index_html: {
    // @ACTIVAR si quieres compilar el index.html al final de cualquier cambio:
    // await require(`${__dirname}/../bin.js`).utils.touchFile("@/src/www/index.html");
  }
  Copiar_fichero_de_src_a_dist: {
    const extensionesCopiables = [
      ".tyla",
      ".cale"
    ];
    let isCopiable = false;
    Iterating_extensions:
    for(let index=0; index<extensionesCopiables.length; index++) {
      const extensionCopiable = extensionesCopiables[index];
      if(extensionCopiable) {
        isCopiable = true;
        break Iterating_extensions;
      }
    }
    if (isCopiable) {
      const rootpath = DevBinaryV6.globalInstance.moduler.rootdirOf(file);
      if (rootpath.startsWith("@/src/www/")) {
        await DevBinaryV6.globalInstance.files.copyFile.try(rootpath, rootpath.replace("@/src/www/", "@/dist/www/"));
      } else if (rootpath.startsWith("@/src/")) {
        await DevBinaryV6.globalInstance.files.copyFile.try(rootpath, rootpath.replace("@/src/", "@/dist/src/"));
      }
    }
  }
};