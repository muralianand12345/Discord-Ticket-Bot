require('dotenv').config();
const mongo = require('mongoose');
const cert = './mongodb/certificate/cert.pem'

module.exports={
    login()
    {
        mongo.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            autoIndex:false,
            connectTimeoutMS:10000,
            keepAlive:true,
            sslKey:cert,
            sslCert:cert,
        })

        mongo.connection.on('connected',() => console.log("[DB] Connected"));
        mongo.connection.on('err',() => console.log("[DB] ERROR"));
        mongo.connection.on('disconnect',() => console.log("[DB] Disconnected"));
    }
}
