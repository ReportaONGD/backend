var router = require('express').Router();
const controller = require('../../../../../../../../controllers/proyecto/objetivos_especificos/resultados/indicadores/fuentes_verificacion/fuentes_verificacion.controller');

require('../../../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../../../base/base.route')(router,'/:proyecto_id/objetivo_especifico/:objetivo_especifico_id/resultado/:resultado_id/indicador/:indicador_id/fuentes_verificacion', controller);

module.exports = router;
