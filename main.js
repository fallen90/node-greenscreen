var chromakey = require('./chromakey');


//var sys = require('sys')
var exec = require('child_process').exec;

var orig = process.argv[2];
var src = orig + ".png";
var butas = orig + "_butas.png"; 
var inter = orig + "_inter.png";
var inter2 = orig + "_inter2.png";
var output = orig + "_output.png";

var command1 = "composite -geometry 300x250+350+510 " + butas + " bg.png " + inter;
var command1_2 = "composite lightleak.png " + butas + " " + inter2 + " " + inter;

var command2 = "composite fg.png " + inter + " " + output;
var command3 = "rm " + butas;
var command4 = "rm " + inter;


function command2func(error, stdout, stderr)
{
    console.log( 'COMMAND ', command2 );
    exec(command2, command3func);
}

function command12func(error, stdout, stderr)
{
    console.log( 'COMMAND ', command1_2 );
    exec(command1_2, command2func);
}
function command3func(error, stdout, stderr)
{
    console.log( 'COMMAND ', command3 );
    exec(command3, commandDelete);
}
function commandDelete(error, stdout, stderr)
{
    exec(command4, puts);
}

chromakey.create(src, butas);
setTimeout(function(){
  console.log( 'COMMAND 1', command1 );
  exec(command1, command2func);
 
}, 10000);





function puts(error, stdout, stderr) { 
    console.log( error );
    //sys.puts(stdout) 
}

/*
image magic commands

composite -geometry 300x250+370+510 butas.png bg.png intermediate.png
composite fg.png intermediate.png output.png

*/


