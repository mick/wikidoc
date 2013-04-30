var express = require("express"),
    app = express();


app.use(express.bodyParser());

app.use('/', express.static(__dirname + '/')); 





// api for setting the relation of a fileid to a path

// request the file id for a given path

// request the path for a file id

// remove a fileid or path





console.log("listening on: ", process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);
