let mongoose = require('mongoose');
let Hipotesis = mongoose.model('Hipotesis');

exports.findAll = function (req, res, next) {
  Hipotesis.find({
    objetivo: req.params.objetivo_especifico_id
  }).lean().then(function (hipotesis) {
    if (!hipotesis) {
      return res.sendStatus(404);
    }

    return res.json(hipotesis);
  }).catch(next);

};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let proyecto = req.proyecto;
  let hipotesis = new Hipotesis(req.body);
  hipotesis.objetivo = req.params.objetivo_especifico_id;

  hipotesis.save().then(function () {
    return res.json(hipotesis);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Hipotesis.findById(req.params.id).then(function (hipotesis) {
    return res.json(hipotesis);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  Hipotesis.findByIdAndUpdate(req.params.id, req.body).then(function (hipotesis) {
    return res.json(hipotesis);
  });


};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return Hipotesis.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.hipotesis'))
    });
  }).catch(next);
};