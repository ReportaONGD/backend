let mongoose = require('mongoose');
let EtapaValidacion = mongoose.model('EtapaValidacion');
let Cofinanciador = mongoose.model('Cofinanciador');
let Financiador = mongoose.model('Agente');
let Etapa = mongoose.model('Etapa');
let resultado_validacion = require('../../initialize/json/resultado_validacion.json');
const enumerado = require('../../enums/validaciones.enum');
exports.findAll = function (req, res, next) {
  // EtapaValidacion.find({
  //   })
  //   .lean()
  //   .then(function (validaciones) {
  //     if (!validaciones) {
  //       return res.sendStatus(404);
  //     }
  //     return res.json(validaciones);
  //   }).catch(next);
  //return res.json(validacion_catalogos(next));
  validacion_catalogos(next).then(function (resp) {
    return res.json(resp);
  }).catch(next);
  // return validacion_catalogos(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
  let etapa_validacion = new EtapaValidacion(req.body);
  etapa_validacion.save().then(function () {
    return res.json(etapa_validacion);
  }).catch(next);
};

exports.get = function (req, res, next) {
  EtapaValidacion.findOne({
    _id: req.params.id
  })
    .then(function (etapa_validacion) {
      if (!etapa_validacion) {
        return res.sendStatus(404);
      }
      return res.json(etapa_validacion);
    }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
  return EtapaValidacion.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
      new: true
    }).then(function (etapa_validacion) {
      return res.json(etapa_validacion);
    }).catch(next);


};

exports.delete = function (req, res, next) {
  return EtapaValidacion.findOneAndRemove({
    _id: req.params.id
  }).then(function (etapa_validacion) {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.etapa_validacion'))
    });
  }).catch(next);
};

exports.validacion_catalogos = async function (req, res, next) {
  evs = [];
  let promise = new Promise((resolve, reject) => {
    EtapaValidacion.find({
      nombre: 'Configuración'
    }).then(function (etapas_validacion) {
      
      etapas_validacion.forEach(function (ev, index) {
        ev.definiciones.forEach(function (definicion, index) {
           ValidateDefinicion(definicion).then(function (def) {
            definicion = def
            resolve(definicion)
          });
        });
        evs.push(ev);
      });
      
      // return etapas_validacion;
    }).catch(next);
  });
  
  return res.json(evs);
};

exports.validacion_proyectos = function (req, res, next) {
  const proyecto = req.proyecto;
};

async function ValidateDefinicion(definicion) {
  let promise = new Promise((resolve, reject) => {
    let resultado;
    if (enumerado.catalogo_validation_enum[definicion.model] === enumerado.catalogo_validation_enum.Cofinanciador) {
      FindCofinanciador().then(function (r) { 
        resultado = r; 
        resolve(resultado); 
      });
    } else if (enumerado.catalogo_validation_enum[definicion.model] === enumerado.catalogo_validation_enum.Etapa) {
      FindEtapa().then(function (r) { 
        resultado = r; 
        resolve(resultado); 
      });
    } else if (enumerado.catalogo_validation_enum[definicion.model] === enumerado.catalogo_validation_enum.Financiador) {
      FindFinanciador().then(function (r) { 
        resultado = r; 
        resolve(resultado); 
      });
    }
  });
  definicion.reglas[0].resultado = await promise;
  return (definicion);

}



async function FindCofinanciador() {
  let promise = new Promise((resolve, reject) => {
    let resultado;
    Cofinanciador.find().then(function (items) {
      if (items.length > 0) {
        GetResultado("OK").then(function (r) { resultado = r; resolve(resultado); });
      } else {
        GetResultado("ERROR").then(function (r) { resultado = r; resolve(resultado); });
      }
      // resolve(resultado);
    });
  });
  const r = await promise;
  return r;
}
async function FindEtapa() {
  let promise = new Promise((resolve, reject) => {
    let resultado;
    Etapa.find().then(function (items) {
      if (items.length > 0) {
        GetResultado("OK").then(function (r) { resultado = r; resolve(resultado); });
      } else {
        GetResultado("ERROR").then(function (r) { resultado = r; resolve(resultado); });
      }

    });
  });
  const r = await promise;
  return r;
}
async function FindFinanciador() {
  let promise = new Promise((resolve, reject) => {
    let resultado;
    Financiador.find().then(function (items) {
      if (items.length > 0) {
        GetResultado("OK").then(function (r) { resultado = r; resolve(resultado); });
      } else {
        GetResultado("ERROR").then(function (r) { resultado = r; resolve(resultado); });
      }
      // resolve(resultado);
    });
  });
  const r = await promise;
  return r;
}
async function GetResultado(estado) {
  let promise = new Promise((resolve, reject) => {
    let r;
    resultado_validacion.filter(function (rv) {
      if (rv.estado === estado) {
        r = rv;
        resolve(r);
      }
    });
  });
  const resultado = await promise;
  return resultado;
}