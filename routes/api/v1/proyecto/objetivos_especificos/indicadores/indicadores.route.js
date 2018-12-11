var router = require('express').Router();
const controller = require('../../../../../../controllers/proyecto/objetivos_especificos/indicadores/indicadores.controller');

require('../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../base/base.route')(router,'/:proyecto_id/objetivo_especifico/:objetivo_especifico_id/indicador', controller);

module.exports = router;
