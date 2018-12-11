let mongoose = require('mongoose');

let Schema = mongoose.Schema;
const i18n = require('i18n');

const EjecucionActividadSchema = new Schema({
  // mes_inicio: { type: Number },
  // mes_fin: { type: Number },
  // anio_inicio: { type: Number },
  // anio_fin: { type: Number },
  fecha_inicio: { type: String },
  fecha_fin: { type: String }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("EjecucionActividad", EjecucionActividadSchema);