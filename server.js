const https = require('https');
const fs = require('fs');
var http = require('http');
var express = require('express');
var admin = require('firebase-admin');
var vhost = require('vhost');


var tatillia = express();

var briantat = express();
var SSLPort = 13337;
var port = 8080;
var path = require('path');


var serviceAccount = require("./resources/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tatilliaordering.firebaseio.com"
}); 

var firebaseDB = admin.database();

tatillia.get("/", function (req,res){
    res.sendFile(path.join(__dirname + '/tatillia/index.html'))
});

tatillia.get("/order", function(req,res){
    res.sendFile(path.join(__dirname + '/tatillia/order.html'))
});

tatillia.get("/api/order/menulist", (req, res, next) => {
    var menuList = firebaseDB.ref('/Menu');
    menuList.on("value", function(snapshot){
        res.json(snapshot.val());
    }, function (errorObject){
        console.log("The read failed: " + errorObject.code);
        res.json("Unable to Retrieve Data");
    });
});

tatillia.get("/api/order/orderlist", (req, res) => {
    var orderList = firebaseDB.ref('/Orders');
    orderList.on("value", function(snapshot){
        res.json(snapshot.val());
    }, function (errorObject){
        console.log("The read failed: " + errorObject.code);
        res.json("Unable to Retrieve Data");
    });
});

tatillia.get("/order/Admin/orderlist", function (req,res){
    res.sendFile(path.join(__dirname + '/tatillia/Admin/orderlist.html'))
});

tatillia.get("/Login", function (req,res){

});

tatillia.post("/Login", function (req, res){

});

tatillia.get("/Register", function (req, res){

});

tatillia.post("/Register", function (req, res){

});

briantat.get("/", function (req, res){
    res.sendFile(path.join(__dirname + '/briantat/index.html'))
});

var app = module.exports = express();
app.use(vhost('localhost', tatillia));
app.use(vhost('*.tatillia.com', tatillia));
app.use(vhost('*.briantat.ca', briantat));
app.use(express.static('briantat'));
app.use(express.static('tatillia'));

app.listen(port, '0.0.0.0', () =>{
    console.log("Server running on port " + port);
});

const options = {
    key: fs.readFileSync(__dirname + '/certs/briantat.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/certs/briantat.public.cert', 'utf8')
};

var app2 = module.exports = express();
app2.use(vhost('*.briantat.ca', briantat));
app2.use(express.static('briantat'));

var server = https.createServer(options, app2).listen(SSLPort, '0.0.0.0', () =>{
    console.log("Server running on port " + SSLPort);
});

//app2.listen(13337, '0.0.0.0', () =>{
//    console.log("Server running on port " + 13337);
//});