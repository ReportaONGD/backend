let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

let ComentarioSchema = new Schema({
  texto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  objetivo: {
    type: String
  },
  resultado: {
    type: String
  },
  indicador: {
    type: String
  },
  actividad: {
    type: String
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Comentario", ComentarioSchema);

