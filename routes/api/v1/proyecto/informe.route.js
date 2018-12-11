var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/informe.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/informe', controller);

module.exports = router;
