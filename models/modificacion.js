let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

let ModificacionSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha: {
    type: Date,
    required: [true, i18n.__n("can't be blank")]
  },
  proyecto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Modificacion", ModificacionSchema);
