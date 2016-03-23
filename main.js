var chromakey = require('./chromakey');

//var sys = require('sys')
// var exec = require('child_process').exec;

// var orig = process.argv[2];
// var src = orig + ".png";
// var butas = orig + "_butas.png"; 
// var inter = orig + "_inter.png";
// var inter2 = orig + "_inter2.png";
// var output = orig + "_output.png";

// var command1 = "composite -geometry 300x250+350+510 " + butas + " bg.png " + inter ;
// var command1_2 = "composite warm1.png " + inter + " " + inter2;

// var command2 = "composite fg.png " + inter2 + " " + output;
// var command3 = "bash -c \"rm " + butas + "\"";
// var command4 = "bash -c \"rm  " + inter + "\"";
// var command5 = "bash -c \"rm  " + inter2 + "\"";


// function command2func(error, stdout, stderr)
// {
//     console.log( 'COMMAND ', command2, '  ERROR:', error );
//     exec(command2, command3func);
// }

// function command12func(error, stdout, stderr)
// {
//     console.log( 'COMMAND ', command1_2, '  ERROR:', error );
//     exec(command1_2, command2func);
// }
// function command3func(error, stdout, stderr)
// {
//     console.log( 'COMMAND ', command3, '  ERROR:', error );
//     exec(command3, puts);
//     exec(command4, puts);
//     exec(command5, puts);

// }


chromakey.create(process.argv[2], process.argv[3], function(file){
   
  console.log( 'FILE', file );
    // setTimeout( function() {
    //     exec( command1, command12func);
    // } ,500);
  
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


