const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const i18n = require('i18n');
let ImplementadorSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  publico: {
    type: Boolean,
    required: [true, i18n.__n("can't be blank")]
  },
  pais: {
    type: Schema.ObjectId,
    ref: 'Pais'
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
ImplementadorSchema.pre('find', function () {
  this.populate('pais')
    .populate('empresa')
});

ImplementadorSchema.pre('findOne', function () {
  this.populate('pais')
    .populate('empresa')
});
module.exports = mongoose.model("Implementador", ImplementadorSchema);

