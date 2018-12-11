var router = require('express').Router();
let permission = require('../../permission');

const monedaController = require('../../../controllers/moneda.controller.js');

require('./base/base.route')(router, '/moneda', monedaController, permission.adminOnly(true));

module.exports = router;