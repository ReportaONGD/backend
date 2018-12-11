var router = require('express').Router();
let permission = require('../../permission');

const tipoPersonalController = require('../../../controllers/tipo_personal.controller.js');

require('./base/base.route')(router, '/tipo_personal', tipoPersonalController, permission.adminOnly(true));

module.exports = router;