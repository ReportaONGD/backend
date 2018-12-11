var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/aportacion.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/aportacion', controller);

module.exports = router;
