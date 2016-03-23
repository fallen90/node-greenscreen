var chromakey = require('./chromakey');

chromakey.create(process.argv[2], process.argv[3], function(file){
    console.log('processed file', file);
}, function(err){
    console.log('failed');
});