let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const i18n = require('i18n');
// const Proyecto = require('./proyecto');

let EntidadSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Entidad", EntidadSchema);

