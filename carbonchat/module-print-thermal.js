/*
 * The print module, lets make this work for the thermal printer that we bought.
 * */

var q = require(q);
var SerialPort = require('serialport').SerialPort;
var Printer = require('thermalprinter');
var Image = require('./module-image.js');
var serialPort = new SerialPort('/dev/ttyUSB0', { baudrate: 19200 });
var printer;
var imageMaxWidth;

//This function will initialize our thermal print module, setting the settings
exports.init = function init() {
    var printer = new Printer(serialPort);

    imageMaxWidth = 384;
}

//This will print a message from that was taken received
//Parameters: 
//from: user name
//conversation: conversation name
//message: a string
//image: a path to the image, will be deleted after it has been printed. This parameter is optional
//timestamp: human readable, so June 6th, 12:06PM
//location: City, Country (Lat, Lon)
exports.printMessage = function printMessage(from, conversation, message, image, timestamp, location) {
    var deferred = q.defer();
    var success = "success";
    var error;

    if (printer != null) {
        //print the message
        //We will use the format: 
        //converation: from
        //message
        //image (optional)
        //location timestamp
        printline(conversation + " " + from);
        printline(message);
        if (image != null)
            printImage(image);
        printline(location + " " + timestamp);

        deferred.resolve(success);
    } else {
        //We need to re-initialize
        var error = "Printer not initialized";
        deferred.reject(error);
    }

    return deferred.promise;
}

//This will print an image with the specified path
exports.printImage = function printImage(path){
    var deferred = q.deferred();
    var error;
    var success;

    if (printer != null) {
        printer.on('ready', function () {
            Image.readyImage(path, imageMaxWidth).then(function (outputPath) {
                printer.printImage(outputPath);
            });            
        });

        success = "success";
        process.exit();                 //Assume this free's up the printer, but I'm not really sure
        deferred.resolve(success);
    } else {
        error = "printer not initialized";
        deferred.reject(error);
    }
    
    return deferred.promise();
}

//Low level functions
exports.printLine = function printLine(message) {
    var deferred = q.deferred();
    var error;
    var success;

    if (printer != null) {
        printer.on('ready', function () {
            printer.printLine(message);
        });
        success = "success";
        process.exit();                 //Assume this free's up the printer, but I'm not really sure
        deferred.resolve(success);      
    } else {
        error = "printer not initialized";
        deferred.reject(error);
    }

    return deferred.promise();
}

/*
serialPort.on('open', function () {
    var printer = new Printer(serialPort);
    printer.on('ready', function () {
        printer
            .indent(10)
            .horizontalLine(16)
            .bold(true)
            .indent(10)
            .printLine('first line')
            .bold(false)
            .inverse(true)
            .big(true)
            .right()
            .printLine('second line')
            .printImage(path)
            .print(function () {
            console.log('done');
            process.exit();
        });
    });
});
 * */