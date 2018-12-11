var router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/agente.controller.js');

require('./base/base.route')(router, '/agente', controller, permission.adminOnly(true));

module.exports = router;
