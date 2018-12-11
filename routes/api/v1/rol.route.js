let router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/rol.controller');

require('./base/base.route')(router, '/rol', controller, permission.adminOnly(true));

module.exports = router;

