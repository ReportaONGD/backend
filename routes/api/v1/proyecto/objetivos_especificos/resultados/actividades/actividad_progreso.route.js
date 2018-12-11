var router = require('express').Router();
const controller = require('../../../../../../../controllers/proyecto/objetivos_especificos/resultados/actividades/actividad_progreso.controller');

require('../../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../../base/base.route')(router,'/:proyecto_id/objetivo_especifico/:objetivo_especifico_id/resultado/:resultado_id/actividad/:actividad_id/progreso', controller);

module.exports = router;
