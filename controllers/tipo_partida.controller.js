let mongoose = require('mongoose');
let TipoPartida = mongoose.model('TipoPartida');

exports.findAll = function (req, res, next) {
  TipoPartida.find({ empresa: req.current_user.empresa }).populate("costes").lean().then(function (tipo_partidas) {
    if (!tipo_partidas) { return res.sendStatus(404); }

    return res.json(tipo_partidas);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var tipo_partida = new TipoPartida(req.body);
  tipo_partida.empresa = req.current_user.empresa;

  tipo_partida.save().then(function (tp, err) {
    return res.json(tp);
  }).catch(next);
};

exports.get = function (req, res, next) {
  TipoPartida.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_partida) {
    if (!tipo_partida) { return res.sendStatus(404); }
      return res.json(tipo_partida);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return TipoPartida.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true })
  .then(function (tipo_partida) {
    return res.json(tipo_partida);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return TipoPartida.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_partida) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.tipo_partida')) });
  }).catch(next);
};
