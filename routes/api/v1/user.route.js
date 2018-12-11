let mongoose = require('mongoose');
let router = require('express').Router();
let permission = require('../../permission');
let auth = require('../../auth');

const controller = require('../../../controllers/user.controller');

router.get('/users/refresh_token', controller.refresh_token);

router.get('/users/:id/block', permission.adminOnly(true), controller.block);

router.get('/users/:id/unblock', permission.adminOnly(true) , controller.unblock);

router.get('/users/:id/revoke_refresh_token', permission.adminOnly(true), controller.revokingTokenRefresh);

router.post('/users/login', controller.login);

require('./base/base.route')(router, '/users', controller, permission.adminOnly(true));

router.get('/user', auth.required, controller.getMe);

router.get('/users', auth.required, controller.findAll);

router.put('/users', auth.required, controller.updateMe);

router.post('/users', auth.required, controller.create);

router.delete('/users', auth.required, controller.delete);

module.exports = router;