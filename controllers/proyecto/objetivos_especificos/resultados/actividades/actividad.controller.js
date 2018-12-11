let mongoose = require('mongoose');
let Actividad = mongoose.model('Actividad');
let Resultado = mongoose.model('Resultado');

exports.findAll = function (req, res, next) {
  Resultado.findById(req.params.resultado_id)
    .then(function (resultado) {
      if (!resultado) {
        return res.sendStatus(404);
      }

      return res.json(resultado.actividades);
    }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body || !req.params.resultado_id) {
    return res.sendStatus(404);
  }

  let actividad = new Actividad(req.body);
  actividad.resultado = req.params.resultado_id;

  actividad.save().then(function () {
    return res.json(actividad);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Actividad.findById(req.params.id).then(function (actividad) {
    return res.json(actividad);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  if (req.body.planificacion_actividad.fecha_inicio.day != undefined && req.body.ejecucion_actividad.fecha_inicio.day != undefined) {
    req.body.planificacion_actividad.fecha_inicio = req.body.planificacion_actividad.fecha_inicio.day + "/" + req.body.planificacion_actividad.fecha_inicio.month + "/" + req.body.planificacion_actividad.fecha_inicio.year;
    req.body.planificacion_actividad.fecha_fin = req.body.planificacion_actividad.fecha_fin.day + "/" + req.body.planificacion_actividad.fecha_fin.month + "/" + req.body.planificacion_actividad.fecha_fin.year;
    req.body.ejecucion_actividad.fecha_inicio = req.body.ejecucion_actividad.fecha_inicio.day + "/" + req.body.ejecucion_actividad.fecha_inicio.month + "/" + req.body.ejecucion_actividad.fecha_inicio.year;
    req.body.ejecucion_actividad.fecha_fin = req.body.ejecucion_actividad.fecha_fin.day + "/" + req.body.ejecucion_actividad.fecha_fin.month + "/" + req.body.ejecucion_actividad.fecha_fin.year;
  }
  Actividad.findByIdAndUpdate(req.params.id, req.body).then(function (actividad) {
    return res.json(actividad);
  });
};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return Actividad.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.actividad'))
    });
  }).catch(next);
};