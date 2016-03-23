var express = require('express');
var app = express();
var fs = require('fs');
var busboy = require('connect-busboy');

var upload_dir = __dirname + '/public/uploads/';

app.use(busboy());

app.use(express.static('public'));

app.post('/file-upload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(upload_dir + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            // res.redirect('back'); //redirect back to main page
            res.send('file uploaded !');
        });
    });
});
app.listen(3000, function() {
    console.log('Server is listening on 3000!');
});