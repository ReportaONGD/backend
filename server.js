// import db from './db';
import jwt from "jsonwebtoken";

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require("http");
var cors = require("cors");
var db = require("./db");

var app = express();


const config = require('./config/config');
// const payload = require('request-payload');
const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}));
app.options('*', cors({credentials: true, origin: true}));
//MIDDLEWARE TRANSACTION INTERCEPTOR
app.use(function (req, res, next)
{
    var token = req.headers['authorization'];
    if(req.method !== 'GET' && req.method != 'OPTIONS')
    {
        // decode token
        if (token) {
            //let t = token.split(' ')[1];
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(401).send({
                success: false,
                message: 'Usuario no autorizado.'
            });

        }
    }
    /*else if(req.method !== 'POST' && req.method != 'PUT')
    {
        payload(req, function(body) {
            console.log(body);
            res.end('awesome!');
        });
    }*/
    else {
        next();
    }
    //next();
});
app.server = http.createServer(app);

// app.use(cors({
// 	exposedHeaders: ['Link']
// }));
// Add headers


db( _ => {
	app.server.listen(port);
}, () => {
	console.log(`Server running at http://localhost:${port}`);
    }
);

module.exports = app;
