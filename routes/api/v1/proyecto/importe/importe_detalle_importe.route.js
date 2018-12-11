var router = require('express').Router();
const controller = require('../../../../../controllers/proyecto/importe/importe_detalle_importe.controller');

require('../../../../../controllers/base/param_proyecto_id')(router);
require('../../base/base.route')(router,'/:proyecto_id/importe/:importe_id/detalle_importe', controller);

module.exports = router;
