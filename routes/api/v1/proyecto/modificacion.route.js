var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/modificacion.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/modificacion', controller);

module.exports = router;
