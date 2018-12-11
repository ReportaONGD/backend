var router = require('express').Router();
const periodoController = require('../../../../controllers/proyecto/periodo.controller.js');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/periodo', periodoController);


module.exports = router;
