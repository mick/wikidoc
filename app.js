var express = require("express"),
    app = express();

var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

app.use(express.bodyParser());
app.use('/', express.static(__dirname + '/')); 


// api for setting the relation of a fileid to a path
app.post('/api/path', function(req, res){

  var fileid  = req.param("fileid", "");
  var path = req.param("path", "");

  if((path === "") || (fileid === "")){
    res.send("missing param", 400);
  }

  client.set("PATH_"+path, fileid, function(err, b){
    console.log(err, b);
    res.send(b);
  });

});

// request the file id for a given path
// request the path for a file id
app.get('/api/path', function(req, res){
  var path = req.param("path", "");

  if(path === ""){
    res.send("missing param", 400);
  }
  
  client.get("PATH_"+path, function(val){
    console.log(val);
    res.send({fileid:val});
  });
  
});

app.get('/api/path/list', function(req, res){
  var path = req.param("path", "/");

  if(path === ""){
    res.send("missing param", 400);
  }
  
  client.keys("PATH_"+path+"*", function(err, keys){

    client.mget(keys, function(err, vals){
      var paths = {};
      for(k in keys){
        paths[keys[k].substring(5)] = vals[k];
      }

      res.send(paths);
    });
  });
});



// remove a fileid or path
//app.del('/api/path', function(req, res){
//});





console.log("listening on: ", process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);
