let router = require('express').Router();
let permission = require('../../permission');

const categoriaController = require('../../../controllers/categoria.controller');

require('./base/base.route')(router, '/categoria', categoriaController, permission.adminOnly(true));

module.exports = router;

