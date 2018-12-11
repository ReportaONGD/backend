var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/documentos.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
router.get('/:proyecto_id/documentos', controller.findAll);
// router.get('/:proyecto_id/documentos/:document_name', controller.download);
router.post('/:proyecto_id/documentos', controller.download);
module.exports = router;
