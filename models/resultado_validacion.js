let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');
const ResultadoValidacionSchema = new Schema({
  nombre: { type: String, required: [true, i18n.__n("can't be blank")] },
  estado: { type: String, required: [true, i18n.__n("can't be blank")] },
  color: {  type: String, required: [true, i18n.__n("can't be blank")] }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("ResultadoValidacion", ResultadoValidacionSchema);

