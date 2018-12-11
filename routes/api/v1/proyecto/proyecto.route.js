var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/proyecto.controller.js');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'', controller);

module.exports = router;

