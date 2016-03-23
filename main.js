var chromakey = require('./chromakey');
chromakey.create(process.argv[2], process.argv[3], function(file){

chromakey.create(src, butas, function(file){
   
  console.log( 'FILE', file );

  
}, function(err){
    console.log('failed');
});


// function puts(error, stdout, stderr) { 
//     if( error )  console.log( error );
//     //sys.puts(stdout) 
// }

/*
image magic commands

composite -geometry 300x250+370+510 butas.png bg.png intermediate.png
composite fg.png intermediate.png output.png

*/


