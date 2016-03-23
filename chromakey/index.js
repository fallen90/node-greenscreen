var fs = require('fs'),
    PNG = require('pngjs').PNG,
    easyimg = require('easyimage'),
    path = require('path');

exports.create = function(inf, outf, success, failed) {
    if (typeof outf == 'undefined') {
        outf = 'output/' + path.basename(inf, path.extname(inf)) + '.out.png';
    }
        easyimg.convert({
            src: inf,
            dst: ".tmp/" + path.basename(inf, path.extname(inf)) + '.png'
        }).then(function(file) {
            processFile(file.path, outf, success, failed);
        }, function(err) {
            console.error('error converting image', err, inf, outf);
            failed(err, inf, outf);
        });
};

var processFile = function(inf, outf, success, failed) {
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
            success(outf);
        }, function(err){
            console.log('failed to parsed stream', err, "outf",outf,"inf", inf);
            failed(err);
        });
};

var initialAlphaMap = function() {
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
};

var operate = function(pixel, alphaMap) {
    var redValue = pixel.r;
    var greenValue = pixel.g;
    var blueValue = pixel.b;
    if (greenValue > redValue && greenValue > blueValue)
        pixel.a = alphaMap[(greenValue * 2) - redValue - blueValue];
    else
        pixel.a = 255;

    return pixel;
};