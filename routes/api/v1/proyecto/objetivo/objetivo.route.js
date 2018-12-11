var router = require('express').Router();
const controller = require('../../../../../controllers/proyecto/objetivo/objetivo.controller.js');

require('../../../../../controllers/base/param_proyecto_id')(router);
require('../../base/base.route')(router,'/:proyecto_id/objetivo', controller);

module.exports = router;
