let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

const ProgresoSchema = new Schema({
  fecha: {
    type: Date,
    required: [true, i18n.__n("can't be blank")],
    default: new Date()
  },
  porcentaje: {
    type: Number,
    required: [true, i18n.__n("can't be blank")],
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Progreso", ProgresoSchema);

