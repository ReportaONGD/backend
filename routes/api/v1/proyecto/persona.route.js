var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/persona.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/persona', controller);

module.exports = router;
