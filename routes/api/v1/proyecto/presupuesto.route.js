var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/presupuesto.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/presupuesto', controller);

module.exports = router;
