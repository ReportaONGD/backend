const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Empresa = require('./empresa');
const i18n = require('i18n');
let CategoriaSchema = new Schema({
  valor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  empresa: {
    type: Schema.ObjectId,
    ref: 'Empresa',
    required: [true, i18n.__n("can't be blank")]
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Categoria", CategoriaSchema);

