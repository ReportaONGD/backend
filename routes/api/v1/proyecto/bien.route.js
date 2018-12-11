const router = require('express').Router();
const controller = require('../../../../controllers/proyecto/bien.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/bien', controller);

module.exports = router;
