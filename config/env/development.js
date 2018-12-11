module.exports = {
  db: {
     connection: 'mongodb://172.27.54.155:27017/development4',
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
    clientId: '45d5133dc7afaaa0207d094aa9e450277a5d1e4996dc47eaf8c91736e7b8365e',
    clientSecret: 'e9772af05fe6a370931413810672e608999843e576afc9f9e434d0d024aa2328',
    accessTokenUri: 'http://gestionaong.gong.gestionaongd.es/oauth/token',
    authorizationUri: 'http://gestionaong.gong.gestionaongd.es/oauth/authorize',
    apiUrl: 'http://gestionaong.gong.gestionaongd.es/webservice'
  }
};