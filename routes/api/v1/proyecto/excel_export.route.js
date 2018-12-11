const router = require('express').Router();
const controller = require('../../../../controllers/proyecto/excel_export.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
router.post('/:proyecto_id/export-excel', controller.post);

module.exports = router;
