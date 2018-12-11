var router = require('express').Router();
const controller = require('../../../../../../../../controllers/proyecto/objetivos_especificos/resultados/indicadores/medidas/medida.controller');

require('../../../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../../../base/base.route')(router,'/:proyecto_id/objetivo_especifico/:objetivo_especifico_id/resultado/:resultado_id/indicador/:indicador_id/medida', controller);

module.exports = router;
