let router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/convocatoria.controller');

require('./base/base.route')(router, '/convocatoria', controller, permission.adminOnly(true));

module.exports = router;

