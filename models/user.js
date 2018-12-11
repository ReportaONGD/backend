let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let secret = require('../config/env').secret;
let i18n = require('i18n');
let Rol = mongoose.model('Rol').schema;
let UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true, required: [true, i18n.__n("can't be blank")], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
  email: { type: String, lowercase: true, unique: true, required: [true, i18n.__n("can't be blank")], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  hash: { type: String },
  salt: { type: String },
  admin: { type: Boolean, default: false },
  refresh_token: { type: String },
  resetPasswordToken : { type: String },
  resetPasswordExpires : { type: Date },
  fail_login: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa'
  },
  roles: {type: [Rol], default: []}
}, { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: i18n.__n('is already taken.') });


UserSchema.virtual('password').set(function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
});

UserSchema.methods.validPassword = function (password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};


UserSchema.pre('save', function (next) {
  let user = this;
  if (user.isNew) {
    crypto.randomBytes(48, function (err, buffer) {
      var token = buffer.toString('hex');
      user.refresh_token = token;
      next();
    });
  } else {
    next();
  }
});

UserSchema.methods.generateJWT = function () {
  // Esto significa que tiene una hora
  //const exp = Math.floor(Date.now() / 1000) + (60 * 60);
  //TODO: QUITAR
  const exp = Math.floor(Date.now() / 100) + (60 * 60);
  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: exp,
  }, secret);
};

UserSchema.methods.generateRefreshToken = function () {
  // Esto significa que tiene un año
  const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365);
  
  return jwt.sign({
    id: this._id,
    username: this.username,
    jwid: this.refresh_token,
    exp: exp,
  }, secret);
};

UserSchema.methods.toAuthJSON = function (refresh_token = false) {
  let result = {
    id: this.id,
    username: this.username,
    email: this.email,
    empresa: this.empresa,
    token: this.generateJWT(),
    admin: this.admin
  };

  if (refresh_token) {
    result.refresh_token = this.generateRefreshToken();
  }

  return result;
};

module.exports = mongoose.model('Usuario', UserSchema);