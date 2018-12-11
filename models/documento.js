let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const i18n = require('i18n');
let DocumentoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  ruta: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha: {
    type: String,
    required: [true, i18n.__n("can't be blank")],
  },
  // es_gasto: {type: Boolean, default: false}
  gasto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Documento", DocumentoSchema);

