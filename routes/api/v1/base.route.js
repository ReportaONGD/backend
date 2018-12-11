var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('Usuario');
var Proyecto = mongoose.model('Proyecto');
var auth = require('../../auth');

//Este metodo incluye en la peticion un objeto con el usuario.
router.all('/*', auth.required, function (req, res, next) {
  //Cuando es login no viene el payload
  if (!req.url.includes('login')) {
    User.findById(req.payload.id).populate('empresa').then(function (user) {
      if (!user) { return res.sendStatus(404); }
      if (!user.activo) { return res.status(404).json({errors: { user : req.t('is blocked')} }); }
      
      req.current_user = user;
      return next();
    }).catch(next);
  }
  else {
      return next();
  }

});

module.exports = router;