let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

let RegistroActividadSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha: {
    type: Date,
    required: [true, i18n.__n("can't be blank")]
  },
  tipo_actividad: {
    type: Schema.ObjectId, ref: "TipoActividad"
  }
}, {
    toJson: { virtuals: true }
  }
);

RegistroActividadSchema.virtual("Informe", {
  ref: "Informe",
  localField: "Informe",
  foreignField: "_id"
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("RegistroActividad", RegistroActividadSchema);

