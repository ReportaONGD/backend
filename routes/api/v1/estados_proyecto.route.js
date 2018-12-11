var router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/estados_proyecto.controller.js');

require('./base/base.route')(router, '/estados_proyecto', controller, permission.adminOnly(true));

module.exports = router;
