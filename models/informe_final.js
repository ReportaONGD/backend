// let mongoose = require('mongoose');
// let Schema = mongoose.Schema;
// let Documento = require('./documento');
// let Valoraciones = require('./valoracion');
// let Informe = require('./informe');
// let i18n = require('i18n');

// let InformeFinalSchema = new Schema({
//   logica_de_intervencion: {
//     type: String,

//   },
//   plan_de_transferencia: { type: Schema.ObjectId, ref: "Documento" },
//   colectivos_meta: {
//     type: String,
//   },
//   propuestas_de_modificacion_en_ejecuccion: {
//     type: String,
//   },
//   con_auditoria: {
//     type: Boolean
//   },
//   fecha_de_finalizacion: {
//     type: Date
//   },
//   informe: { type: Schema.ObjectId, ref: "Informe" },
//   valoraciones_por_criterio: [{ type: Schema.ObjectId, ref: "Valoraciones" }],
//   valoraciones_cierre_proyecto: [{ type: Schema.ObjectId, ref: "Valoraciones" }]
// }, {
//     toJSON: { virtuals: true },
//     timestamps: true
//   });

// module.exports = mongoose.model("InformeFinal", InformeFinalSchema);

