class ImageUtils {

    static getCanvas(w, h) {
        var c = document.querySelector("canvas");
        c.width = w;
        c.height = h;
        return c;
    }

    static getPixels(img) {
        var c = ImageUtils.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0,0,c.width,c.height);
    }

    static putPixels(imageData, w, h) {
        var c = ImageUtils.getCanvas(w, h);
        var ctx = c.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }

}

// Declares a class called RGBA
class RGBA {
    // "constructs" the properties for the class RGBA
    // i.e the quadruple (4-tuple) redValue, greenValue, blueValue, alphaValue
    constructor(redValue, greenValue, blueValue, alphaValue){
        //The keyword "this" controls the object, i.e the current instance of the class
        // In this case, sets the property red to the argument "redValue"
        this.red = redValue;
        this.green =  greenValue;
        this.blue = blueValue;
        this.alpha = alphaValue;
    }
}

// creates a new instance of RGBA; initialises properties to 255,0,0,1
var colour = new RGBA(255, 0, 0, 255);
// access the properties by using the "." dot operator in the argument
//console.log(colour.red);


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//// function definitions here///


/// applies colourisePixel method to image

function colourise(img, colour, jitter){

    // grabs pixel data from the image, assigns variable "pixels"
    var pixels = ImageUtils.getPixels(img);
    // grabs length of RGBA array, assigns variable "all"
    var all = pixels.data.length;
    // grabs 4-tuple pixel data from the image, assigns variable "data"
    var data = pixels.data;

    // applies colourisePixel method iteratively through array
    for (var i = 0; i < all; i +=4){
        var currentRGBA = new RGBA(data[i], data[i+1], data[i+2], data[i+3]);
        var modifiedRGBA = colourisePixel(currentRGBA, colour, jitter);
        // forwards new RGBA object to setPixel
        setPixel(data, i, modifiedRGBA);
    }
    //displays modified pixels back in canvas
    ImageUtils.putPixels(pixels, img.width, img.height);
}

/// defines colourisePixel filter method

function colourisePixel(originalRGBA, colour, jitter){

    // defines the method colourisePixel
    var diffRed = (originalRGBA.red - colour.red)* (jitter/100);
    var modifiedRed = originalRGBA.red - diffRed;

    var diffGreen  = (originalRGBA.green - colour.green) * (jitter/100);
    var modifiedGreen = originalRGBA.green - diffGreen;

    var diffBlue = (originalRGBA.blue - colour.blue)*(jitter/100);
    var modifiedBlue = originalRGBA.blue - diffBlue;

    // keyword "return" stops execution of colourisePixel
    // keyword "new" initialises properties of RGBA as per colourisePixel method
    return new RGBA(modifiedRed, modifiedGreen, modifiedBlue, colour.alpha);
}

/// applies sepiaPixel method to image

function sepia(img){

    // grabs pixel data from the image, assigns variable "pixels"
    var pixels = ImageUtils.getPixels(img);
    // grabs length of RGBA array, assigns variable "all"
    var all = pixels.data.length;
    // grabs 4-tuple pixel data from the image, assigns variable "data"
    var data = pixels.data;

    // applies sepiaPixel method iteratively through array
    for (var i = 0; i < all; i +=4) {
        var currentRGBA = new RGBA(data[i], data[i + 1], data[i + 2], data[i + 3]);
        var modifiedRGBA = sepiaPixel(currentRGBA)
        // forwards new RGBA object to setPixel
        setPixel(data, i, modifiedRGBA);
    }
    //displays modified pixels back in canvas
    ImageUtils.putPixels(pixels, img.width, img.height);
}

/// defines sepiaPixel filter method

function sepiaPixel(colour){
    // defines the method sepiaFilter
    var modifiedRed = colour.red * 0.393 + colour.green * 0.769 + colour.blue * 0.189;
    var modifiedGreen = colour.red * 0.349 + colour.green * 0.686 + colour.blue * 0.168;
    var modifiedBlue = colour.red * 0.272 + colour.green * 0.534 + colour.blue * 0.131;

    // keyword "return" stops execution of sepiaFilter method
    // keyword "new" initialises properties of RGBA as per sepiaFilter method
    return new RGBA(modifiedRed, modifiedGreen, modifiedBlue, colour.alpha);
}


/// function which calls the specified filter method to every pixel (4-tuple) in image

function setPixel(data, i, colour){

    data[i] = colour.red;
    data[i+1] = colour.green;
    data[i+2] = colour.blue;
    data[i+3] = colour.alpha;
}

function clip(img, adjustment) {

    // grabs pixel data from the image, assigns variable "pixels"
    var pixels = ImageUtils.getPixels(img);
    // grabs length of RGBA array, assigns variable "all"
    var all = pixels.data.length;
    // grabs 4-tuple pixel data from the image, assigns variable "data"
    var data = pixels.data;

    // applies clipPixel method iteratively through array
    for (var i = 0; i < all; i += 4) {
        var currentRGBA = new RGBA(data[i], data[i + 1], data[i + 2], data[i + 3]);
        var newRGBA = clipPixel(currentRGBA, adjustment)
    }
    //displays modified pixels back in canvas
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function clipPixel(colour, range){

    var clippedRed = 0;
    if(colour.red > 255 - range){
        clippedRed = 255;
    }
    var clippedGreen = 0;
    if(colour.green > 255 - range){
        clippedRed = 255;
    }
    var clippedBlue = 0;
    if(colour.blue > 255 - range){
        clippedRed = 255;
    }

    return new RGBA(clippedRed, clippedGreen, clippedBlue, colour.alpha);

}

/// function which calls method colourisePixel to every pixel (4-tuple) in image
//function colourise(img, colour, jitter){
//
//    var pixels = ImageUtils.getPixels(img);
//    var all  = pixels.data.length;
//    var data = pixels.data;
//
//    // iterates over all pixel information (4-tuples) in original image
//    for (var i = 0; i < all; i += 4){
//        // creates a new RGBA object by calling original image colour data
//        var originalRGBA = new RGBA(data[i], data[i+1], data[i+2], data[i+3]);
//        // creates a new RGBA object which modifies the colour data according to parameters "colour", "jitter"
//        var modifiedRGBA = colourisePixel(originalRGBA, colour, jitter);
//
//        // replaces content of each channel by accessing the data array
//        data[i] = modifiedRGBA.red;
//        data[i+1] = modifiedRGBA.green;
//        data[i+2] = modifiedRGBA.blue;
//        data[i+3] = modifiedRGBA.alpha;
//
//    }
//    // displays modified pixels back in canvas
//    ImageUtils.putPixels(pixels, img.width, img.height);
//}
//


/// function which defines the recolouring method


/// function which calls sepiaPixel to each pixel (4-tuple) in image
//
//function sepia(img){
//
//    var pixels = ImageUtils.getPixels(img);
//    var all  = pixels.data.length;
//    var data = pixels.data;
//
//    // iterates over all pixel information (4-tuples) in original image
//    for (var i = 0; i < all; i += 4){
//        // creates a new RGBA object by calling original image colour data
//        var originalRGBA = new RGBA(data[i], data[i+1], data[i+2], data[i+3]);
//        // creates a new RGBA object which modifies the colour data according to colourisePixel
//        var sepiaRGBA = sepiaPixel(originalRGBA);
//
//        // replaces content of each channel by accessing the data array
//        data[i] = sepiaRGBA.red;
//        data[i+1] = sepiaRGBA.green;
//        data[i+2] = sepiaRGBA.blue;
//        data[i+3] = sepiaRGBA.alpha;
//
//    }
//    // displays modified pixels back in canvas
//    ImageUtils.putPixels(pixels, img.width, img.height);
//}

///  function which defines sepia filter method

//function sepiaPixel(colour){
//
//    // defines the method sepiaFilter
//    var modifiedRed = colour.red * 0.393 + colour.green * 0.769 + colour.blue * 0.189;
//    var modifiedGreen = colour.red * 0.349 + colour.green * 0.686 + colour.blue * 0.168;
//    var modifiedBlue = colour.red * 0.272 + colour.green * 0.534 + colour.blue * 0.131;
//
//    // keyword "return" stops execution of sepiaFilter method
//    // keyword "new" initialises properties of RGBA as per sepiaFitler method
//    return new RGBA(modifiedRed, modifiedGreen, modifiedBlue, colour.alpha);
//}
//

/// function which calls the specified filter method to every pixel (4-tuple) in image

//function setPixel(data, i, colour){
//
//        data[i] = colour.red;
//        data[i+1] = colour.green;
//        data[i+2] = colour.blue;
//        data[i+3] = colour.alpha;
//}


$(document).ready(function() {
    var img = new Image();
    img.src = "img/cat.jpg";

    colourise(img, colour, 50);
    //sepia(img);
    //clip(img);

});
