let permission = require('../../../permission');

/***
 * This method implements the basics routes and funcionality for managing a controller crud.
 * Parameters are:
 *  router
 *  endpoint-> Base Url
 *  controller-> Object with the logic
 * Controller has to implements following methods:
 *  Create -> create
 *  Retrieve all-> findAll;
 *  Retrieve an Object with id -> get;
 *  Update a Object with id -> update;
 *  Delete a Object with id -> delete;
 * It creates automaticaly the following entries:
 *  Create 
 *  router.post(endpoint, controller.create);
 *  Retrieve all
 *  router.get(endpoint, controller.findAll);
 *  Retrieve a Objetivo with id
 *  router.get(endpoint +'/:id', controller.get);
 *  Update a Objetivo with id
 *  router.put(endpoint +'/:id', controller.update);
 *  Delete a Objetivo with id
 *  router.delete(endpoint +'/:id', controller.delete);
 */

module.exports = function (router, endpoint, controller, permission) {
  const func = function (req, res, next) { next(); };

  if (!permission) {
    permission = {};
    permission.all = func;
  } else if (typeof permission === 'function') {
    permission.all = permission;
  }

  if (permission.all) {
    permission.create = permission.all;
    permission.findAll = permission.all;
    permission.get = permission.all;
    permission.update = permission.all;
    permission.delete = permission.all;
  } else {
    permission.create = permission.create || func;
    permission.findAll = permission.findAll || func;
    permission.get = permission.get || func;
    permission.update = permission.update || func;
    permission.delete = permission.delete || func;
  }

  router.post(endpoint, permission.create, controller.create);

  router.get(endpoint, permission.findAll, controller.findAll);

  router.get(endpoint + '/:id', permission.get, controller.get);

  router.put(endpoint + '/:id', permission.update, controller.update);

  router.delete(endpoint + '/:id', permission.delete, controller.delete);
};
