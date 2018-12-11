const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let i18n = require('i18n');

const MonedaSchema = new Schema({
  codigo: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  empresa: {
    type: Schema.ObjectId,
    ref: 'Empresa',
    required: [true, i18n.__n("can't be blank")]
  }
  //TODO:Faltan relaciones MONEDA y PERIODO
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Moneda", MonedaSchema); 