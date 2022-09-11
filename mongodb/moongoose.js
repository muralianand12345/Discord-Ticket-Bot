require('dotenv').config();
const mongo = require('mongoose')

module.exports={
    login()
    {
        mongo.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            autoIndex:false,
            connectTimeoutMS:10000,
            keepAlive:true,
        })

        mongo.connction.on('connected',
        () => console.log("DB Connected"))
        mongo.connction.on('disconnect',() => console.log("DB Disconnected"));
    }
}
