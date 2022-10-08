var express = require('express');
var app = express(); 
require("dotenv").config();

module.exports = {
    name: 'ready',
    async execute(client) {
        const Port = process.env.PORT;

        //app.use(require('morgan')('dev'));
        app.use(express.static('./ticket-logs'));
        app.listen(Port);
    }
}