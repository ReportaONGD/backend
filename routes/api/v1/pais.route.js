let router = require('express').Router();
let permission = require('../../permission');

const paisController = require('../../../controllers/pais.controller');

require('./base/base.route')(router, '/pais', paisController, permission.adminOnly(true));

module.exports = router;

