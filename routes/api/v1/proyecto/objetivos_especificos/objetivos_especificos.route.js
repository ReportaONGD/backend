var router = require('express').Router();
const controller = require('../../../../../controllers/proyecto/objetivos_especificos/objetivos_especificos.controller.js');

require('../../../../../controllers/base/param_proyecto_id')(router);
require('../../base/base.route')(router,'/:proyecto_id/objetivo_especifico', controller);

module.exports = router;
