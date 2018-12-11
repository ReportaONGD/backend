let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Cofinanciador = mongoose.model('Cofinanciador').schema;
const i18n = require('i18n');
let AportacionSchema = new Schema({
  cofinanciador: {
    type: Schema.ObjectId,
    ref: 'Cofinanciador'
  },
  cuantia: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Aportacion", AportacionSchema);

