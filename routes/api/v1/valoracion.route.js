let router = require('express').Router();
let auth = require('../../auth');

const controller = require('../../../controllers/valoracion.controller');

require('../../../controllers/base/param_proyecto_id')(router);
require('./base/base.route')(router,'/:proyecto_id/valoracion', controller);

module.exports = router;

