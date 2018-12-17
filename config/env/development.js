module.exports = {
  db: {
    connection: process.env.DB_CONECTION,
    // connection: 'mongodb://localhost:27017/development3',
    //connection: "mongodb://juanf:Kurosaki15@cluster0-shard-00-00-srvik.mongodb.net:27017,cluster0-shard-00-01-srvik.mongodb.net:27017,cluster0-shard-00-02-srvik.mongodb.net:27017/development?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
    //connection: "mongodb://juanf:Kurosaki15@cluster0-shard-00-00-srvik.mongodb.net:27017,cluster0-shard-00-01-srvik.mongodb.net:27017,cluster0-shard-00-02-srvik.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"

  },
  log: 'debug',
  // AECID
  // gong: {
  //   clientId: 'ee6eb91d403a6743d4be05adc47c619f39cb75310fa485c27277e656268568d5',
  //   clientSecret: '9e66c4581c86169a6cf0528311ed25864e1dfcf9b6562f4b9c02894c9fa92fba',
  //   accessTokenUri: 'http://aecidong.gong.gestionaongd.es/oauth/token',
  //   authorizationUri: 'http://aecidong.gong.gestionaongd.es/oauth/authorize',
  //   apiUrl: 'http://aecidong.gong.gestionaongd.es/webservice'
  // }
  // Gestionaongd
  gong: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessTokenUri: process.env.ACCESS_TOKEN_URI,
    authorizationUri: process.env.AUTHORIZATION_URI,
    apiUrl: process.env.API_URL
  }
};