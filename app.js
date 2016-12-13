var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var express = require('express');
var app = express();
// Connection URL
var url = 'mongodb://localhost:27017/myproject';
var documents;


var findDocuments =  function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log("Found the following records");
    //console.log(docs)
    callback(docs);

  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });
}

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.deleteOne({'a': 2 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}

var indexCollection = function(db, callback) {
  db.collection('documents').createIndex(
    { "a": 1 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {czujnik : 1, czas: "21/09/2016 21:33:55"}, {czujnik : 2, czas: "21/09/2016 22:50:13"}, {czujnik : 3, czas: "23/10/2016 15:33:55", czujnik : 4, czas: "21/11/2016 13:33:55"}, {czujnik : 5, czas: "25/12/2016 11:50:13"}, {czujnik : 6, czas: "26/12/2016 15:33:55"}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(5, result.result.n);
    assert.equal(5, result.ops.length);
    console.log("Inserted 6 documents into the collection");
    callback(result);
  })
}

app.get('/', function (req, res) {
   // Use connect method to connect to the server
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected successfully to db");

  
    //updateDocument(db, function() {
      //removeDocument(db, function() {
        //indexCollection(db, function() {
	findDocuments(db, function(docs) {
		console.log(docs);            
            	res.end(JSON.stringify(docs));
		db.close();
	//});
     // });
    	});


	
  //});    res.end( data );
   });
})

app.post('/addUser', function (req, res) {
   // First read existing users.
	//data = JSON.parse( data );
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected successfully to db");
      
		insertDocuments(db, function() {
		       
       //data["user4"] = user["user4"];
       //res.end( JSON.stringify(data));
	 	    	res.end("ADDED DATA ");
			db.close();
   		});
	});
})

/*
app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/public/" + "users.json", 'utf8', function (err, data) {
       users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log( user );
       res.end( JSON.stringify(user));
   });
})
*/
app.get('/deleteAll', function (req, res) {
   // First read existing users.
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected successfully to db");
		var collection = db.collection('documents');
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

  console.log("Example app listening at http://%s:%s", host, port)

});

