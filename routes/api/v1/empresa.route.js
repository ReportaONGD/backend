var router = require('express').Router();
let permission = require('../../permission');

const empresaController = require('../../../controllers/empresa.controller.js');

require('./base/base.route')(router, '/empresa', empresaController, permission.adminOnly(true));

module.exports = router;
