module.exports = async function({ file, devbin }) {
  Actualizar_el_componente: {
    if(devbin.moduler.rootdirOf(file) === "@/src/Std/apis/application/MainApplication/MainApplication.object.js") {
      break Actualizar_el_componente;
    }
    await devbin.utils.touchFile("@/src/Std/apis/application/MainApplication/MainApplication.object.js");
  }
};