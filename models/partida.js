const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const i18n = require('i18n');

let PartidaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  codigo: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  costes: { 
    type: Schema.ObjectId, 
    ref: 'Costes' 
  },
  partida_padre: this,
  es_padre: { 
    type: Boolean 
  },
  es_inversion: { 
    type: Boolean, 
    default: false 
  },
  convocatoria: {
    type: Schema.ObjectId,
    ref: 'Convocatoria',
    required: [true, i18n.__n("can't be blank")]
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

PartidaSchema.pre('find', function () {
  this.populate('convocatoria')
  .populate('costes')
});

PartidaSchema.pre('findOne', function () {
  this.populate('convocatoria')
  .populate('costes')
});

module.exports = mongoose.model("Partida", PartidaSchema);

