module.exports = async function({ file, devbin }) {
  Actualizar_el_componente: {
    if(devbin.moduler.rootdirOf(file) === "@/src/candidate/Std/apis/application/MainApplication/MainApplication.object.js") {
      break Actualizar_el_componente;
    }
    await devbin.utils.touchFile("@/src/candidate/Std/apis/application/MainApplication/MainApplication.object.js");
  }
};