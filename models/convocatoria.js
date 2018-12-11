const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Agente = mongoose.model('Agente').schema;
const i18n = require('i18n');
let ConvocatoriaSchema = new Schema({
  codigo: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  financiador: {
    type: Schema.ObjectId,
    ref: 'Agente',
    required: [true, i18n.__n("can't be blank")]
  },
  empresa: {
    type: Schema.ObjectId,
    ref: 'Empresa',
    required: [true, i18n.__n("can't be blank")]
  }
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});
ConvocatoriaSchema.pre('find', function () {
  this.populate('financiador')
  .populate('empresa')
});

ConvocatoriaSchema.pre('findOne', function () {
  this.populate('financiador')
  .populate('empresa')
});
module.exports = mongoose.model("Convocatoria", ConvocatoriaSchema);