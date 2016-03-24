var express = require('express');
var app = express();
var fs = require('fs');
var busboy = require('connect-busboy');
var chromakey = require('./chromakey');
var path = require('path');
var low = require('lowdb')
var storage = require('lowdb/file-sync')
var db = low('db.json', { storage });
var gdrive = require('./gdrive');

var upload_dir = __dirname + '/public/uploads/';
var output_dir = __dirname + '/public/outputs/';

app.use(busboy());

app.use(express.static('public'));

app.post('/file-upload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {

        var key = db('images').size() + 1;
        filename = upload_dir + key + path.extname(filename);

        fstream = fs.createWriteStream(filename);
        file.pipe(fstream);

        fstream.on('close', function() {
            // res.redirect('back'); //redirect back to main page
            // res.send('file uploaded !');
            chromakey.create(filename, key, function(file) {
                console.log('file processed', file);
                db('images').push({
                    id: key,
                    file: file
                });
                res.end();
                uploadFile(key);
            }, function(err) {
                console.log('failed');
            });
        });
    });
});
app.listen(3000, function() {
    console.log('Server is listening on 3000!');
});

var uploadFile = function(key) {
    console.log('Uploading...');
    gdrive.uploadFile(key + '.out.png', key + '.out.png', function(result) {
        console.log('success!!!', result);
    }, function(err) {
        console.log('Error!!!', err);
    });
}