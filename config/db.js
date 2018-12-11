var mongoose = require('mongoose');
var config = require('./env');

let dbCon;

const options = {
    useMongoClient:true,
    reconnectTries: Number.MAX_VALUE,
    poolSize: 10,
};

mongoose.connect(config.db.connection, options);
// mongoose.plugin('schema' : { 'schema.options.usePushEach' : true });

mongoose.set('debug', true);

module.exports = mongoose;