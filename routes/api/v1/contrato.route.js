let router = require('express').Router();
let permission = require('../../permission');

const contratoController = require('../../../controllers/contrato.controller.js');

require('./base/base.route')(router, '/contrato', contratoController, permission.adminOnly(true));

module.exports = router;