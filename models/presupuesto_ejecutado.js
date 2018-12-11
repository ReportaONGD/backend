
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let i18n = require('i18n');

const PresupuestoEjecutadoSchema = new Schema({
  partida: {
    type: Schema.ObjectId,
    ref: 'Partida'
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });


PresupuestoEjecutadoSchema.pre('find', function () {
  this.populate('partida')
});

PresupuestoEjecutadoSchema.pre('findOne', function () {
  this.populate('partida')
});
module.exports = mongoose.model("PresupuestoEjecutado", PresupuestoEjecutadoSchema);