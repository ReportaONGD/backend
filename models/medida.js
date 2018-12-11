let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

let MedidaSchema = new Schema({
  fecha: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  valor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  comentario: {
    type: String,
    // required: [true, i18n.__n("can't be blank")]
  },
  indicador: {
    type: String,
    required: [ true, i18n.__n("can't be blank")]
  },
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Medida", MedidaSchema);

