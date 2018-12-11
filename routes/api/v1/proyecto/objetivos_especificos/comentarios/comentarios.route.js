var router = require('express').Router();
const controller = require('../../../../../../controllers/proyecto/objetivos_especificos/comentarios/comentarios.controller');

require('../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../base/base.route')(router,'/:proyecto_id/objetivo_especifico/:objetivo_especifico_id/comentarios', controller);

module.exports = router;
