let router = require('express').Router();
let permission = require('../../permission');

const costesController = require('../../../controllers/costes.controller');

require('./base/base.route')(router, '/costes', costesController, permission.adminOnly(true));

module.exports = router;

