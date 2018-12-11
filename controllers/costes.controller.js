let mongoose = require('mongoose');
let Costes = mongoose.model('Costes');

exports.findAll = function (req, res, next) {
    Costes.find().lean().exec(function (err, costes) {
    return res.json(costes);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
  
  var costes = new Costes(req.body);
  
  costes.save().then(function () {
    return res.json(costes);
  }).catch(next);
};

exports.get = function (req, res, next) {
  return Costes.findById(req.params.id).then(function (costes) {
    if (!costes) { return res.sendStatus(404); }

    return res.json(costes);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
 
  return Costes.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(function (costes) {
    return res.json(costes);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  Costes.remove(req.params.id).then(function (err, costes) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.costes')) });
  }).catch(next);
};
