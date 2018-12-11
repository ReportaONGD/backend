var router = require('express').Router();
const controller = require('../../../controllers/registro_actividad.controller.js');

require('../../../controllers/base/param_proyecto_id')(router);
require('./base/base.route')(router,'/:proyecto_id/registro_actividad', controller);

module.exports = router;

