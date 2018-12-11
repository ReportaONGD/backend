var router = require('express').Router();
let permission = require('../../permission');

const tipoPeriodoController = require('../../../controllers/tipo_periodo.controller.js');

require('./base/base.route')(router, '/tipo_periodo', tipoPeriodoController, permission.adminOnly(true));

module.exports = router;
