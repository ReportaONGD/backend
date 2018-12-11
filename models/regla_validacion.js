let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');
const ResultadoValidacion = mongoose.model('ResultadoValidacion').schema;
const ReglaValidacionSchema = new Schema({
  mensaje: { type: String, required: [true, i18n.__n("can't be blank")] },
  route_link: { type: String },
  resultado: ResultadoValidacion
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("ReglaValidacion", ReglaValidacionSchema);

