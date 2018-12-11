const mongoose = require("mongoose");
// const Indicador = require('./indicador');
const Schema = mongoose.Schema;
const i18n = require('i18n');
const Documento = mongoose.model('Documento').schema;
const FuenteVerificacionSchema = new Schema({
  codigo: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  indicador: {
    type: String,
    required: [ true, i18n.__n("can't be blank")]
  },
  documentos: {type: [Documento], default: []}
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("FuenteVerificacion", FuenteVerificacionSchema);