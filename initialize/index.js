const mongoose = require('mongoose');
const User = mongoose.model('Usuario');
const Empresa = mongoose.model('Empresa');
const catalogos = require('./json/catalogos');
const empresa = require('./json/default_empresa');
const usuario = require('./json/default_usuario');
const monedas = require('./json/monedas');
const paises = require('./json/paises');
const costes = require('./json/costes');
const partidas = require('./json/partidas');
const resultados_validacion = require('./json/resultado_validacion');
const TipoPersonal = mongoose.model('TipoPersonal');
const TipoPeriodo = mongoose.model('TipoPeriodo');
const Localizacion = mongoose.model('Localizacion');
const Cofinanciador = mongoose.model('Cofinanciador');
const TipoMovimiento = mongoose.model('TipoMovimiento');
const TipoValoracion = mongoose.model('TipoValoracion');
const EstadoProyecto = mongoose.model('EstadosProyecto');
const Monedas = mongoose.model('Moneda');
const Pais = mongoose.model('Pais');
const Moneda = mongoose.model('Moneda');
const Coste = mongoose.model('Costes');
const ResultadoValidacion = mongoose.model('ResultadoValidacion');
const Financiador = mongoose.model('Financiador');
const Agente = mongoose.model('Agente');
const Implementador = mongoose.model('Implementador');
const Contrato = mongoose.model('Contrato');
const Rol = mongoose.model('Rol');
const Partida = mongoose.model('Partida');
const Convocatoria = mongoose.model('Convocatoria');
// const Proyecto = mongoose.model('Proyecto');
Empresa.count(function (err, count, next) {
  console.log("Numero de Empresas " + count);
  // updateProject();
  // updatePartidas();
  if (count == 0) {

    const _empresa = new Empresa(empresa.empresa);

    _empresa.save().then(function () {
      console.log("Empresa " + _empresa.nombre + " creada correctamente");
      SaveCostes(_empresa);
      SaveUser(_empresa);
      SavePais(_empresa);
      SaveMonedas(_empresa);
      SaveTipoPersonal(_empresa);
      SaveLocalizaciones(_empresa);
      SaveCofinanciador(_empresa);
      SaveTipoMovimiento(_empresa);
      SaveTipoValoracion(_empresa);
      SaveTipoPeriodo(_empresa);
      SaveEstadosProyecto(_empresa);
      SaveResultadoValidacion();
      SaveContratos(_empresa);
      SaveRoles(_empresa);
      // SavePartidas(_empresa);
    });
  }
});

function SavePais(_empresa) {
  paises.paises.forEach(function (e) {
    let pais = new Pais(e);
    let moneda = new Moneda(e.moneda);
    pais.empresa = _empresa;
    moneda.empresa = _empresa;
    pais.moneda = moneda;
    if (pais.valor === 'Spain') {
      //SaveFinanciadores(_empresa, pais);
      //SaveImplementador(_empresa, pais);
      SaveAgentes(_empresa, pais);
    }
    pais.save();
  });
}

function SaveUser(empresa_item) {
  var user = new User(usuario.user);
  user.empresa = empresa_item;

  user.save().then(function () {
    console.log("Usuario " + user.username + " creado correctamente");
  });
}

function SaveTipoPersonal(empresa_item) {
  catalogos.tipo_personal.forEach(function (e) {
    let tipo_personal = new TipoPersonal(e);
    tipo_personal.empresa = empresa_item;
    tipo_personal.save();
  });
}

function SaveLocalizaciones(empresa_item) {
  catalogos.localizacion.forEach(function (e) {
    let localizacion = new Localizacion(e);
    localizacion.empresa = empresa_item;
    localizacion.save();
  });
}

function SaveCofinanciador(empresa_item) {
  catalogos.cofinanciador.forEach(function (e) {
    e.Empresa = empresa_item._id;
    let cofinanciador = new Cofinanciador(e);
    cofinanciador.empresa = empresa_item;
    cofinanciador.save();
  });
}

function SaveRoles(empresa_item) {
  catalogos.roles.forEach(function (e) {
    e.Empresa = empresa_item._id;
    let rol = new Rol(e);
    rol.empresa = empresa_item;
    rol.save();
  });
}

function SaveTipoMovimiento(empresa_item) {
  catalogos.tipo_movimiento.forEach(function (e) {
    let tipo_movimiento = new TipoMovimiento(e);
    tipo_movimiento.empresa = empresa_item;
    tipo_movimiento.save();
  });
}

function SaveTipoValoracion(empresa_item) {
  catalogos.tipo_valoracion.forEach(function (e) {
    let tipo_valoracion = new TipoValoracion(e);
    tipo_valoracion.empresa = empresa_item;
    tipo_valoracion.save();
  });
}

function SaveMonedas(_empresa) {
  monedas.monedas.forEach(function (e) {
    let moneda = new Monedas(e);
    moneda.empresa = _empresa;
    moneda.save();
  });
}

function SaveCostes() {
  costes.costes.forEach(function (e) {
    let coste = new Coste(e);
    coste.save();
  });
}

function SaveResultadoValidacion() {
  resultados_validacion.forEach(function (e) {
    let r = new ResultadoValidacion(e);
    r.save();
  });
}

function SaveTipoPeriodo(empresa_item) {
  catalogos.tipo_periodo.forEach(function (e) {
    let tipo_periodo = new TipoPeriodo(e);
    tipo_periodo.empresa = empresa_item;
    tipo_periodo.save();
  });
}

function SaveEstadosProyecto(empresa) {
  let estado_anterior = null;
  const estados_proyecto = catalogos.estado_proyecto;
  estados_proyecto.forEach(function (e, indice) {
    const estado_proyecto = new EstadoProyecto(e);
    estado_proyecto.empresa = empresa;
    estado_proyecto.estado_anterior = estado_anterior;
    if (indice === estados_proyecto.length - 1) {
      estado_proyecto.final = true;
    }
    estado_proyecto.save();
    estado_anterior = estado_proyecto;
  });
}

function SaveAgentes(empresa, pais) {
  const agentes = catalogos.agentes;
  agentes.forEach(function (e) {
    const agente = new Agente(e);
    agente.empresa = empresa;
    agente.pais = pais;
    agente.save().then((f) => {
      SaveConvocatoria(empresa, agente);
    });
  });
}

function SaveFinanciadores(empresa, pais) {
  const financiadores = catalogos.financiadores;
  financiadores.forEach(function (e) {
    const financiador = new Financiador(e);
    financiador.empresa = empresa;
    financiador.pais = pais;
    financiador.save().then((f) => {
      SaveConvocatoria(empresa, financiador);
    });
  });
}
function SaveImplementador(empresa, pais) {
  const implementador = catalogos.implementador;
  implementador.forEach(function (e) {
    const implementador = new Implementador(e);
    implementador.empresa = empresa;
    implementador.pais = pais;
    implementador.save();
  });
}

function SaveContratos(empresa_item) {
  catalogos.contratos.forEach(function (e) {
    let contrato = new Contrato(e);
    contrato.empresa = empresa_item;
    contrato.save();
  });
}

function SavePartidas(empresa_item, convocatoria) {
  let p_personal;
  let p_construccion;
  Coste.find({}).then(function (costes) {
    partidas.partidas.forEach(function (e) {
      let partida = new Partida(e);
      partida.empresa = empresa_item;
      partida.convocatoria = convocatoria;
      if (partida.codigo.indexOf('A.I.') > -1) {
        coste = costes.filter(c => c.valor.indexOf('Corrientes') > -1);
        partida.costes = coste[0];
      } else if (partida.codigo.indexOf('A.II.') > -1) {
        coste = costes.filter(c => c.valor.indexOf('Inversión') > -1);
        partida.costes = coste[0];
      } else {
        coste = costes.filter(c => c.valor.indexOf('Indirectos') > -1);
        partida.costes = coste[0];
      }
      if (partida.es_padre && partida.codigo.indexOf('A.I.6') > -1) {
        p_personal = partida;
      } else if (partida.es_padre && partida.codigo.indexOf('A.II.2') > -1) {
        p_construccion = partida;
      }
      if (p_personal && partida.codigo.indexOf('A.I.6') > -1 && p_personal._id != partida._id) {
        partida.partida_padre = p_personal;
      }
      if (p_construccion && partida.codigo.indexOf('A.II.2') > -1 && p_construccion._id != partida._id) {
        partida.partida_padre = p_construccion;
      }
      partida.save().then((res) => {
        console.log(JSON.stringify(res));
      }, (err) => {
        console.log('err: ' + err.value || err);
      });
    });

  });
}

function SaveConvocatoria(empresa_item, financiador) {
  const convocatoria = new Convocatoria(catalogos.convocatorias[0]);
  convocatoria.financiador = financiador;
  convocatoria.empresa = empresa_item;
  // convocatoria.save().then(function (resp) {
  //   SavePartidas(empresa_item, resp);
  // });
  convocatoria.save().then((res) => {
    SavePartidas(empresa_item, res);
  }, (err) => {
    console.log('err: ' + err.value || err);
  });

}
// function updateProject() {
//   Partida.find({}).then((partidas) => {
//     Proyecto.findById('5b3c6511b37f1a4a78eb67ee').then((p) => {
//       p.partida = partidas;
//       p.save();
//     });
//   });
// }

// function updatePartidas() {
//   Partida.find({}).then((partidas) => {
//     Convocatoria.find({nombre: 'AECID'}).then((c) => {
//       partidas.forEach(p => {
//         p.convocatoria = c[0];
//         p.save();
//       });
//     });
//   });
// }