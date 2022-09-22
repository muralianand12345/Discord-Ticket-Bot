require('dotenv').config();
const mongo = require('mongoose');
const cert = './mongodb/certificate/cert.pem'
const err_log = require("../logs/err_log.js")
var colors = require('colors/safe');

module.exports={
    login(client)
    {
        mongo.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            autoIndex:false,
            connectTimeoutMS:10000,
            keepAlive:true,
            sslKey:cert,
            sslCert:cert,
        })

        mongo.connection.on('connected',() => {
            console.log(colors.green("[DB] Connected"));
            //client.err_log.error(client,file="mongoose.js",line="20",err="[DB] CONNECTED")
        });

        mongo.connection.on('err',(err) => {
            console.log(colors.red("FiveM [DB] ERROR"));
            client.err_log.error(client,file="mongoose.js",line="21",err=err);
        });  

        mongo.connection.on('disconnect',() => {
            console.log(colors.yellow("FiveM [DB] Disconnected"));
            client.err_log.error(client,file="mongoose.js",line="24",err="[DB] DISCONNECTED");
        });
        
    }    
}
