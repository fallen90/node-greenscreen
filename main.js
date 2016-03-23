var fs = require('fs'),
    PNG = require('pngjs').PNG,
    easyimg = require('easyimage');

var exec = require('child_process').exec;

var orig = process.argv[3];
var src = orig + ".jpg";
var converted = orig + ".png"; 

easyimg.convert({
    src : process.argv[2],
    dst : 'in2.png'
}).then(function(file){
    mainOperation(file.path, process.argv[3]);
}, function(err){
    console.log('error convert', err);
})


function puts(error, stdout, stderr) { sys.puts(stdout) }

function mainOperation(inf, outf) {
    fs.createReadStream(inf)
        .pipe(new PNG({
            filterType: 4
        }))
        .on('parsed', function() {
            var pixelSize = 4;
            var row = [];
            var alphaMap = initialAlphaMap();
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;
                    var pixel = {
                        r: this.data[idx],
                        g: this.data[idx + 1],
                        b: this.data[idx + 2],
                        a: this.data[idx + 3]
                    };
                    var newPixel = operate(pixel, alphaMap);
                    this.data[idx] = newPixel.r;
                    this.data[idx + 1] = newPixel.g;
                    this.data[idx + 2] = newPixel.b;
                    this.data[idx + 3] = newPixel.a;
                }
            }


            this.pack().pipe(fs.createWriteStream(outf));
        });
}

function initialAlphaMap() {
    var alphaMapArray = [];
    var fullyTransparentEndIndex = 35;
    var semiTransparentEndIndex = 90;
    for (var i = 0; i < 510; i++) {
        if (i < fullyTransparentEndIndex) {
            alphaMapArray.push(255);
        } else if (i >= fullyTransparentEndIndex && i < semiTransparentEndIndex) {
            var lengthOfSemis = semiTransparentEndIndex - fullyTransparentEndIndex;
            var indexValue = i - fullyTransparentEndIndex;
            var multiplier = 1 - (indexValue / lengthOfSemis);
            var alphaValue = multiplier * 255.0;
            alphaMapArray.push(alphaValue);
        } else {
            alphaMapArray.push(0);
        }
    }
    return alphaMapArray;
}


function operate(pixel, alphaMap) {
    var redValue = pixel.r;
    var greenValue = pixel.g;
    var blueValue = pixel.b;

    if (greenValue > redValue && greenValue > blueValue)
        pixel.a = alphaMap[(greenValue * 2) - redValue - blueValue];
    else
        pixel.a = 255;

    return pixel;
}
/*
image magic commands

composite -geometry 300x250+370+510 butas.png bg.png intermediate.png
composite fg.png intermediate.png output.png

*/