module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;
  const { PathResolver } = Std.all;

  const dir = "/dir/ej";
  const resolver = PathResolver.new.config({ rootdir: dir, basedir: dir, });
  const resolver2 = PathResolver.new;

  Usando_valores_por_defecto: {
    assert(resolver2.normalizationOf("./ok.txt") === "~/ok.txt");
    assert(resolver2.normalizationOf("@/ok.txt") === "~/ok.txt");
  }

  Esto_es_segun_el_rootdir: {
    assert(resolver.normalizationOf("@/README.md") === `${dir}/README.md`, "normalización de rootpath (1)");
  }
  Esto_es_segun_el_basedir: {
    assert(resolver.normalizationOf("./README.md") === `${dir}/README.md`, "normalización de basepath (2)");
  }
  Aqui_vas_cambiando_el_basedir: {
    resolver.setBasedir("./one");
    assert(resolver.normalizationOf("./one.txt") === `${dir}/one/one.txt`, "normalización de basepath + setBasedir (3)");
    resolver.setBasedir("./two");
    assert(resolver.normalizationOf("./two.txt") === `${dir}/one/two/two.txt`, "normalización de basepath + setBasedir (4)");
  }
  Aqui_pruebas_que_el_rootdir_se_mantiene: {
    assert(resolver.normalizationOf("@/three.txt") === `${dir}/three.txt`, "normalización de rootpath + setBasedir (5)");
  }
  Aqui_devuelves_el_basedir_al_root: {
    resolver.setBasedir("../..");
    assert(resolver.normalizationOf("./ok.txt") === `${dir}/ok.txt`, "normalización de basepath + setBasedir (6)");
  }
  Normalizaria_las_barras_de_windows_a_linux: {
    assert(resolver.normalizationOf("C:\\\\ruta\\fichero.txt") === `/C//ruta/fichero.txt`, "normalización de ruta de windows (7)");
  }
  Si_empieza_tipo_URL: {
    assert(resolver.normalizationOf("http://ok.ok") === `http://ok.ok`, "normalización de URL (8)");
  }
  Si_no_empieza_por_nada: {
    assert(resolver.normalizationOf("ok.txt") === `ok.txt`, "normalización de ningún patrón concreto (9)");
  }
  Los_tests_tipicos_serian: {
    Estos_no_estoy_seguro_de_como_se_traducen_normalmente: {
      assert(resolver.normalizationOf("C:/una/ruta/cualquiera.js") === "/C/una/ruta/cualquiera.js", "normalización de ruta de sistemas operativos (20)");
      assert(resolver.normalizationOf("C:\\una\\ruta\\cualquiera.js") === "/C/una/ruta/cualquiera.js", "normalización de ruta de sistemas operativos (21)");
      assert(resolver.normalizationOf("\\\\una\\ruta\\cualquiera.js") === "/una/ruta/cualquiera.js", "normalización de ruta de sistemas operativos (22)");
      assert(resolver.normalizationOf("/una/ruta/cualquiera.js") === "/una/ruta/cualquiera.js", "normalización de ruta de sistemas operativos (23)");
      assert(resolver.normalizationOf("://una/ruta/cualquiera.js") === "://una/ruta/cualquiera.js", "normalización de ruta de sistemas operativos (24)");
    }
    assert(resolver.normalizationOf("http://una/ruta/cualquiera.js") === "http://una/ruta/cualquiera.js", "normalización de URL (30)");
    resolver.setRootdir(dir);
    resolver.setBasedir(`${dir}/sub/uno`);
    assert(resolver.normalizationOf("./una/ruta/relativa.js") === `${dir}/sub/uno/una/ruta/relativa.js`, "normalización de ruta relativa + setBasedir + setRootdir (31)");
    assert(resolver.normalizationOf("../una/ruta/superlativa.js") === `${dir}/sub/una/ruta/superlativa.js`, "normalización de ruta superlativa + setBasedir + setRootdir (32)");
    assert(resolver.normalizationOf("@/una/ruta/enraizada.js") === `${dir}/una/ruta/enraizada.js`, "normalización de ruta enraizada + setBasedir + setRootdir (33)");
  }
  Atento_a_este: {
    assert(resolver.normalizationOf("una/ruta/huerfana.js") === `una/ruta/huerfana.js`, "normalización de ruta normal (34)");
  }
  Luego_estan_los_2_métodos_de_relativizacion: {
    assert(resolver.basepathOf("/dir/ej/sub/uno/parte/3") === "./parte/3", "normalización de basepathOf (35)");
    assert(resolver.rootpathOf("/dir/ej/sub/uno/parte/3") === "@/sub/uno/parte/3", "normalización de rootpathOf (36)");
  }
}