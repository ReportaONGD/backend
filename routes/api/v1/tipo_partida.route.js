var router = require('express').Router();
let permission = require('../../permission');

const tipoPartidaController = require('../../../controllers/tipo_partida.controller.js');

require('./base/base.route')(router, '/tipo_partida', tipoPartidaController, permission.adminOnly(true));

module.exports = router;
