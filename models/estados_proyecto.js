let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const i18n = require('i18n');
let EstadosProyectoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  estado_anterior: {
    type: Schema.ObjectId,
    ref: this,
  } ,
  final: {
    type: Boolean,
    default: false,
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

EstadosProyectoSchema.pre('find', function () {
  this.populate('empresa')
});

EstadosProyectoSchema.pre('findOne', function () {
  this.populate('empresa')
});
module.exports = mongoose.model("EstadosProyecto", EstadosProyectoSchema);

