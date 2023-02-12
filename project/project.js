var express=require ('express');
var app=express();
var bodyParser = require('body-parser');
 var session = require('express-session');
 
 app.use(bodyParser.urlencoded({ extended: true })); 
 
 app.use(session({secret: "Shh, its a secret!"}));
 var mongoose = require('mongoose');
 mongoose.connect('mongodb://127.0.0.1/myproject');
 app.use(express.static('./CSS'));
 app.use(express.static('./JS'));
 app.use(express.static('./Images'));
 app.use(express.static('./Uploadssports'));


 


 app.set('view engine', 'pug');
 app.set('views','./views');


 var exportproject=require('./exportproject');
 var exportarticle=require('./exportarticle');
 var exportadmin=require('./exportadmin');
 var exporttopicmanager=require('./exporttopicmanager');

 
 
 app.use('/',exportproject);
 app.use('/',exportarticle);
 app.use('/',exportadmin);
 app.use('/',exporttopicmanager);
 


 
 
 var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })

