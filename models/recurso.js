let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

const RecursoSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")],
  },
  coste: {
    type: Number,
    required: [true, i18n.__n("can't be blank")],
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Recurso", RecursoSchema);

