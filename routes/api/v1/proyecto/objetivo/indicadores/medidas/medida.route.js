var router = require('express').Router();
const controller = require('../../../../../../../controllers/proyecto/objetivo/indicadores/medidas/medida.controller');

require('../../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../../base/base.route')(router,'/:proyecto_id/objetivo/:objetivo_id/indicador/:indicador_id/medida', controller);

module.exports = router;
