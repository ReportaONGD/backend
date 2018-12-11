let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');
const Comentario = mongoose.model('Comentario').schema;

const ObjetivoSchema = new Schema({
  codigo: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String
  },
  general: {
    type: Boolean,
    defaultValue: false
  },
  proyecto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  // hipotesis: [Hipotesis],
  // indicadores: [Indicador],
  // resultados: [Resultado],
  /* comentarios: [{
    type: Schema.ObjectId,
    ref: 'Comentario'
  }] */
},
  {
    toJSON: { virtuals: true },
    timestamps: true
  }
);


ObjetivoSchema.virtual('comentarios', {
  ref: 'Comentario',
  localField: '_id',
  foreignField: 'objetivo',
  // justOne: true // Only return one owner
});

ObjetivoSchema.virtual('hipotesis', {
  ref: 'Hipotesis',
  localField: '_id',
  foreignField: 'objetivo',
  // justOne: true // Only return one owner
});

ObjetivoSchema.virtual('indicadores', {
  ref: 'Indicador',
  localField: '_id',
  foreignField: 'objetivo',
  // justOne: true // Only return one owner
});

ObjetivoSchema.virtual('resultados', {
  ref: 'Resultado',
  localField: '_id',
  foreignField: 'objetivo',
  // justOne: true // Only return one owner
});

// ObjetivoSchema.virtual('comentarios', {
//   ref: 'Comentario',
//   localField: '_id',
//   foreignField: 'objetivo',
//   // justOne: true // Only return one owner
// });
ObjetivoSchema.pre('find', function () {
  this.populate('hipotesis')
    .populate('indicadores')
    .populate('resultados')
    .populate('comentarios')
});

ObjetivoSchema.pre('findOne', function () {
  this.populate('hipotesis')
    .populate('indicadores')
    .populate('resultados')
    .populate('comentarios')
});
module.exports = mongoose.model("Objetivo", ObjetivoSchema);

