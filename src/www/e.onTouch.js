module.exports = async function({ file, devbin }) {
  Actualizar_index_html: {
    if(devbin.moduler.rootdirOf(file) === "@/src/www/index.entry.html") {
      break Actualizar_index_html;
    }
    await devbin.utils.touchFile("@/src/www/index.entry.html");
  }
};