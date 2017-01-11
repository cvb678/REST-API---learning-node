var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var assert = require('assert');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
var documents;


var dataSchema = new Schema({
  id: { type: Number, index: true, unique: true },
  idSensor:  Number,
  date: Date,
  sensor: String
}, { timestamps: { createdAt: 'created_at' } });

var Data = mongoose.model('Data', dataSchema);

var findDocuments =  function(db, callback) {
  // Get the documents collection
  var collection = db.collection('Data');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);

  });
}

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('Data');
  // Insert some documents
  collection.deleteOne({'a': 2 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}

app.get('/', function (req, res) {

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to db");

    findDocuments(db, function(docs) {
      console.log(docs);            
      res.end(JSON.stringify(docs));
      db.close();
    });
  });
})

app.post('/add', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to db");
    console.dir(req.body);

    var dateAdd = new Date();

    dateAdd.setDate(req.body.date.substring(0,2));
    dateAdd.setMonth(parseInt(req.body.date.substring(3,5))-1);
    dateAdd.setYear(req.body.date.substring(6,10)); 
    dateAdd.setHours(parseInt(req.body.date.substring(12,14))+1);
    dateAdd.setMinutes(req.body.date.substring(15,17));   
    dateAdd.setSeconds(req.body.date.substring(18,20));
    dateAdd.setMilliseconds(0);	    
    console.log(dateAdd.toISOString());

    var col = db.collection('Data');
    col.insertOne({"id": req.body.id, "date": dateAdd.toIsoString(), "sensor": req.body.sensor}, 	function(err, r) {
         assert.equal(null, err);
         assert.equal(1, r.insertedCount);
        
    	 res.end('ADDED');
    	 db.close();
  	});
    });
})


app.get('/deleteAll', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to db");
    var collection = db.collection('Data');
    collection.remove({}, {safe: true}, function(err, result) {
      if(err) {
        console.log(err);
	throw err;
      }
      console.log(result);
     });
  });

  res.end("Deleted all records");
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Server listening at http://%s:%s", host, port)
});

