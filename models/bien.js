let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const Proyecto = require('./proyecto');
const i18n = require('i18n');
let BienSchema = new Schema({

  proveedor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String
  },
  cantidad: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  },
  importe: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha: {
    type: String
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Bien", BienSchema);