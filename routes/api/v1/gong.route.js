let router = require('express').Router();
let permission = require('../../permission');

const gongController = require('../../../controllers/gong.controller');

router.get('/gong', gongController.findAll);
router.get('/gong/:id/importar', gongController.importar);

module.exports = router;