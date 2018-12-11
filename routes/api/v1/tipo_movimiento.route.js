var router = require('express').Router();
let permission = require('../../permission');

const tipoMovimientoController = require('../../../controllers/tipo_movimiento.controller.js');

require('./base/base.route')(router, '/tipo_movimiento', tipoMovimientoController, permission.adminOnly(true));

module.exports = router;
