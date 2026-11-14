module.exports = async function ({ file, devbin }) {
  Actualizar_estilos: {
    if(!file.endsWith(".css")) {
      break Actualizar_estilos;
    }
    const isDialogView = devbin.moduler.rootdirOf(file) === "@/src/Std/apis/views/dialogs/DialogView/DialogView.style.css";
    if (!isDialogView) {
      await devbin.utils.touchFile("@/src/www/app.entry.css");
    }
  }
};