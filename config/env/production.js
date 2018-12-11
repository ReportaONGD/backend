module.exports = {
    db: {
        connection: 'mongodb://172.27.54.155:27017/development',
        debug: false
    },
    secret: process.env.SECRET,
    log: 'error'
};