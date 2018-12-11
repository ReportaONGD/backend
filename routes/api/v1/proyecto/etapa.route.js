var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/etapa.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/etapa', controller);

module.exports = router;

