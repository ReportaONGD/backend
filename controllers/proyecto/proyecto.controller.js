let mongoose = require('mongoose');
let Proyecto = mongoose.model('Proyecto');
let EstadosProyecto = mongoose.model('EstadosProyecto');
const Partida = mongoose.model('Partida');

const ClientOAuth2 = require('client-oauth2');
const config = require('../../config/env');
const popsicle = require('popsicle');

exports.findAll = function (req, res, next) {
  // var githubAuth = new ClientOAuth2({
  //   clientId: config.gong.clientId,
  //   clientSecret: config.gong.clientSecret,
  //   accessTokenUri: config.gong.accessTokenUri,
  //   authorizationUri: config.gong.authorizationUri,
  // });

  // githubAuth.credentials.getToken()
  //   .then(function (user) {
  //     console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }
  //     return popsicle.request(user.sign({
  //       method: 'get',
  //       url: config.gong.apiUrl + '/proyectos'
  //     })).then(function (api_res) {
  //       console.log(JSON.parse(api_res.body)); //=> { body: { ... }, status: 200, headers: { ... } }
  //       return res.json(JSON.parse(api_res.body));
  //     });
  //   });

  Proyecto.find({
    empresa: req.current_user.empresa
  }).lean().then(function (proyectos) {
    return res.json(proyectos);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  Partida.find({
    'convocatoria.id': req.body.convocatoria.id
  }).then((resp) => {
    delete req.body._id;
    var proyecto = new Proyecto(req.body);
    proyecto.empresa = req.current_user.empresa;
    proyecto.readonly = false;
    proyecto.partida = resp;
    proyecto.save().then(function () {
      return res.json(proyecto);
    }).catch(next);
  }, (err) => {
    console.log(err.error.message || err.error);
  });
};

exports.get = function (req, res, next) {
  Proyecto.findOne({
    empresa: req.current_user.empresa.id,
    _id: req.params.id
  }).then(function (proyecto) {
    return res.json(proyecto);
  }).catch(next);
};

exports.update = function (req, res, next) {

  if (!req.body) {
    return res.sendStatus(404);
  }

  return Proyecto.findOneAndUpdate({
    empresa: req.current_user.empresa,
    _id: req.params.id
  }, req.body, {
    new: true
  }).then(function (proyecto) {
    return res.json(proyecto);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Proyecto.findOneAndRemove({
    empresa: req.current_user.empresa,
    _id: req.params.id
  }).then(function (proyecto) {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.proyecto'))
    });
  }).catch(next);
};