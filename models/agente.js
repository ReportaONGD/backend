const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const i18n = require('i18n');
let AgenteSchema = new Schema({
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
    socio_local: {
        type: Boolean,
        required: [true, i18n.__n("can't be blank")]
    },
    implementador: {
        type: Boolean,
        required: [true, i18n.__n("can't be blank")]
    },
    financiador: {
        type: Boolean,
        required: [true, i18n.__n("can't be blank")]
    },
    pais: {
        type: Schema.ObjectId,
        ref: 'Pais',
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

AgenteSchema.pre('find', function () {
    this.populate('empresa')
        .populate('pais')
});

AgenteSchema.pre('findOne', function () {
    this.populate('empresa')
        .populate('pais')
});
module.exports = mongoose.model("Agente", AgenteSchema);

