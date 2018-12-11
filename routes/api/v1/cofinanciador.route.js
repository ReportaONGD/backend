let router = require('express').Router();
let permission = require('../../permission');

const cofinanciadorController = require('../../../controllers/cofinanciador.controller.js');

require('./base/base.route')(router, '/cofinanciador', cofinanciadorController, permission.adminOnly(true));

module.exports = router;