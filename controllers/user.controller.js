var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('Usuario');
var passport = require('passport');
let crypto = require('crypto');
const EmailConfig = require('../models/email_reset_password/email_reset_password_config');
let jwt = require('jsonwebtoken');
let secret = require('../config').secret;
const auth_util = require('../utils/auth');
const binding = require('../utils/binding');
var nodemailer = require('nodemailer');
var async = require('async');

const PROTECTED_ATTRIBUTES = ['hash','salt','refresh_token','activo'];

exports.findAll = function (req, res) {
  User.find({empresa: req.current_user.empresa}).populate("empresa").exec(function (err, users) {
    return res.json(users);
  });
};

exports.create = function (req, res, next) {
  if (!req.body.user && hasProtectedAttributes(req.body.user, PROTECTED_ATTRIBUTES)) { return res.sendStatus(404); }

  if (typeof req.body.user.password !== 'undefined' && req.body.user.password.trim === "" ) {
    return res.status(404).json({ errors: { password: req.t("can't be blank") } });
  }

  const empresa = req.current_user.empresa;
  
  var user = new User(req.body.user);

  user.empresa = empresa;

  return user.save().then(function () {
    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
};

exports.get = function (req, res, next) {
  return User.findById(req.params.id).then(function (user) {
    if (!user) { return res.sendStatus(404); }

    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body.user && hasProtectedAttributes(req.body.user, PROTECTED_ATTRIBUTES)) { return res.sendStatus(404); }

  if (typeof req.body.user.password !== 'undefined' && req.body.user.password.trim === "" ) {
    return res.status(404).json({ errors: { password: req.t("can't be blank") } });
  }

  return User.findById(req.params.id).then(function (user) {
    if (!user) { return res.sendStatus(404); }
    
    binding.bindingObject(req.body.user, user);
    return user.save().then(function (user) {
      return res.json({ user: user.toAuthJSON() });
    }).catch((err) => {
     if (err) {
       return res.status(404).json({ errors: { user: req.t("Nombre de usuario incorrecto") } });
     }
     next
    });
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return User.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.user'))
    });
  }).catch(next);
};

exports.login = function (req, res, next) {
  if (!req.body.user.email) {
    return res.status(404).json({ errors: { email: req.t("can't be blank") } });
  }

  if (!req.body.user.password) {
    return res.status(404).json({ errors: { password: req.t("can't be blank") } });
  }

  if (req.body.user.isReset) {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ 'email': req.body.user.email }).exec(function (err, user) {
          if (err) {
            throw err;
          }
          if (!user) {
            return res.status(404).json({ errors: { user: req.t('No existe una cuenta con esa dirección de correo electrónico.') } });
          }

          // user.resetPasswordToken = token;
          // user.resetPasswordExpires = Date.now() + 3600000;
          console.log("nueva Contraseña: " + req.body.user.password);
          binding.bindingObject(req.body.user, user);
          user.save().then(function (user) {
            done(err, token, user);
          }).catch(next);
        });
      },
      function (token, user, done) {
        var smtpConfig = {
          service: EmailConfig.EmailConfig.SERVICE,
          auth: {
            user: EmailConfig.EmailConfig.USER,
            pass: EmailConfig.EmailConfig.PASSWORD
          }
        };
        var smtpTransport = nodemailer.createTransport(smtpConfig);
        var mailOptions = {
          to: user.email,
          from: EmailConfig.EmailConfig.USER,
          subject: 'Nueva contraseña',
          text: 'Está recibiendo esto porque usted (o alguien más) ha solicitado el restablecimiento de la contraseña de su cuenta.\n\n' +
            'Esta es su nueva contraseña. La puede cambiar en el apartado cambiar contraseña:\n\n' +
            'Usuario: ' + req.body.user.email + '\n\n' +
            'Contraseña: ' + req.body.user.password + '\n\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          res.json({ success: { user: req.t('An e-mail has been sent to ' + user.email + ' with further instructions.') } });
          done(err, 'done');
        });

      }
    ], function (err, done) {
      if (err) return res.status(404).json({ errors: { user: req.t('No se pudo enviar el correo. Error del servidor..') } });
      return res.json(done);
    });

  } else {

    passport.authenticate('local', { session: false }, function (err, user, info) {
      if (err) { return next(err); }

      if (user) {
        //Pasando true como parametro se genera el refresh_token
        return res.json({ user: user.toAuthJSON(true) });
      } else {
        User.findOne({'email': req.body.user.email}).exec(function (err, user) {
          if (err) {
            throw err;
          }
          
          if (null != user) {
            if (user.activo) 
            {
              user.fail_login ++;
              // probar 
              // user.fail_login.$inc();
              if (user.fail_login == 3) {
                user.activo = false;
              }

              return user.save().then(function (err, user) {
                return res.status(404).json(info);
              }).catch(next);
            } else {
              return res.status(404).json({errors: { user : req.t('is blocked')} });
            }
          }
          else
          {
            return res.status(404).json(info);
          }
        }).catch(next);
      }
    })(req, res, next);
  }
};

exports.getMe = function (req, res, next) {
  let user = req.current_user;
  if (!user) { return res.sendStatus(404); }

  return res.json({ user: user.toAuthJSON() });
};

exports.updateMe = function (req, res, next) {
  if (!req.body.user && hasProtectedAttributes(req.body.user, PROTECTED_ATTRIBUTES)) { return res.sendStatus(404); }

  if (typeof req.body.user.password !== 'undefined' && req.body.user.password.trim === "" ) {
    return res.status(404).json({ errors: { password: req.t("can't be blank") } });
  }

  return User.findByIdAndUpdate(req.current_user.id, req.body.user, { new: true }).then(function (user) {
    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
};

// exports.delete = function (req, res, next) {
//   User.remove(req.payload.id).then(function (err, user) {
//     res.json({ message: i18n.__n("% Deleted Correctly", i18n.__n("User")) });
//   });
// };

exports.refresh_token = function (req, res, next) {
  let user = req.current_user;
  
  if (!user || user.refresh_token !== req.payload.jwid || !user.activo) { return res.sendStatus(404); }
  
  return res.json({ user: user.toAuthJSON(true) });
};

exports.block = function (req, res, next) {
  return User.findByIdAndUpdate(req.params.id, {activo: false}, { new: true }).then(function (user) {
    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
};

exports.unblock = function (req, res, next) {
  return User.findByIdAndUpdate(req.params.id, {activo: true}, { new: true }).then(function (user) {
    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
};

exports.revokingTokenRefresh = function (req, res, next) {
  return User.findByIdAndUpdate(req.params.id, {refresh_token: null}, { new: true }).then(function (user) {
    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
};

function hasProtectedAttributes(obj, protectedAttributes) {
  protectedAttributes.forEach(function(element) {
    if(obj in user){
      return true;
    }
  }); 
  return false;
}