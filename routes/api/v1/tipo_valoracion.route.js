let router = require('express').Router();
let permission = require('../../permission');

const tipoValoracionController = require('../../../controllers/tipo_valoracion.controller');

require('./base/base.route')(router, '/tipo_valoracion', tipoValoracionController, permission.adminOnly(true));

module.exports = router;

