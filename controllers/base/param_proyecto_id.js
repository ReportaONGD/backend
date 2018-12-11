const mongoose = require('mongoose');
const Proyecto = mongoose.model('Proyecto');

module.exports = function (router) {
  router.param('proyecto_id', function (req, res, next, proyecto_id) {
    Proyecto.findById(proyecto_id)
      .then(function (proyecto) {
        if (!proyecto) {
          return res.sendStatus(404);
        }

        req.proyecto = proyecto;

        return next();
      }).catch(next);
  });
};