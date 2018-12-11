let mongoose = require('mongoose');
let InformeFinal = mongoose.model('InformeFinal');

exports.findAll = function (req, res, next) {
  InformeFinal.find().lean().exec(function (err, informes_finales) {
    return res.json(informes_finales);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
  
  var informe_final = new InformeFinal(req.body);

  informe_final.save().then(function () {
    return res.json(informe_final);
  }).catch(next);
};

exports.get = function (req, res, next) {
  return InformeFinal.findById(req.params.id).then(function (informe_final) {
    if (!informe_final) { return res.sendStatus(404); }

    return res.json(informe_final);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
  
  return InformeFinal.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(function (informe_final) {
    return res.json(informe_final);
}).catch(next);
};

exports.delete = function (req, res, next) {
  InformeFinal.remove(req.params.id).then(function (err, informe_final) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.informe_final')) });
  }).catch(next);
};
