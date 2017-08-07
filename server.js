 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient
var url = 'mongodb://' + process.env.DB_USER +':' + process.env.DB_PASS + '@ds119548.mlab.com:19548/url_shortener';
var app = express();

app.use('/public', express.static(process.cwd() + '/public'));


app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })


app.get('/new/:url*', function(req, res){
  
  var wrongURL = ({error: 'Wrong url format, make sure you have a valid protocol and real site.'});
  var validURL = ''
  var randId = getRandId();
  
  validateUrl(req.params.url + req.params[0]) ? 
    validURL = req.params.url + req.params[0] :
  res.json(wrongURL)

  //saveToDb(randId, validURL);

  res.json({original_url: validURL, short_url: 'https://' + req.hostname + '/' + randId})
})

app.get('/:id', function(req, res){
  var id = req.params.id;
  // if (!isNaN(Number(id)) && id.length === 4){
  //   res.send(req.params.id)
  // }else{
  //   res.json({"error":"This url is not on the database."});
  // }
  console.log(getUrlFromDb('1111'))
  res.send();
  
})

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

function getUrlFromDb(id){
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('urls');
    return collection.find({
      short_id: id
    },{
      url: 1
    })
  })
}

function saveToDb(short_id, validURL){
    mongo.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('urls');
    collection.insertOne({short_id: short_id, url: validURL})
  })
}

function getRandId(){
  return Math.floor(Math.random() * (9999 - 1000) + 1000);
}

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

