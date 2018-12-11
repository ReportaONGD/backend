const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const i18n = require('i18n');
let EtapaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String
  },
  fecha_inicio: {
    type: Date,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha_fin: {
    type: Date,
    required: [true, i18n.__n("can't be blank")]
  },
  proyecto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  }
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});

module.exports = mongoose.model("Etapa", EtapaSchema);