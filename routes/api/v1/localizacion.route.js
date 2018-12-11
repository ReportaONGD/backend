var router = require('express').Router();
let permission = require('../../permission');

const localizacionController = require('../../../controllers/localizacion.controller.js');

require('./base/base.route')(router, '/localizacion', localizacionController, permission.adminOnly(true));

module.exports = router;