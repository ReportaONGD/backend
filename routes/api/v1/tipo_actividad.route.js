var router = require('express').Router();
let permission = require('../../permission');

const tipoActividadController = require('../../../controllers/tipo_actividad.controller.js');

require('./base/base.route')(router, '/tipo_actividad', tipoActividadController, permission.adminOnly(true));

module.exports = router;
