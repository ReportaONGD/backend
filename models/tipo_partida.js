let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');
let TipoPartidaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  codigo: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  empresa: {
    type: Schema.ObjectId,
    ref: 'Empresa',
    required: [true, i18n.__n("can't be blank")]
  },
  costes: {type: Schema.ObjectId, ref: 'Costes'}
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  });
TipoPartidaSchema.pre('find', function () {
  this.populate('empresa')
});

TipoPartidaSchema.pre('findOne', function () {
  this.populate('empresa')
});
  // TipoPartidaSchema.virtual('costes_ref').set()
module.exports = mongoose.model("TipoPartida", TipoPartidaSchema);

