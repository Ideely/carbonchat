/*
 * The print module, lets make this work for the thermal printer that we bought.
 * */
(function(){
    var q = require('q');
    var SerialPort = require('serialport').SerialPort;
    var Printer = require('thermalprinter');
    var Image = require('./module-image.js');
    var fs = require('fs');

    var serialPort = new SerialPort('/dev/ttyUSB0', { baudrate: 19200 });
    var imageMaxWidth;

    //This function will initialize our thermal print module, setting the settings
    exports.init = function init() {
    
        console.log('Module-print-thermal.js: Init function: entered');

        var printer = new Printer(serialPort);

        imageMaxWidth = 384;
    }

    //This will print a message from that was taken received
    //Parameters: 
    //from: user name
    //message: a string
    //image: a path to the image, will be deleted after it has been printed. This parameter is optional
    //timestamp: human readable, so June 6th, 12:06PM
    //location: City, Country (Lat, Lon)
    exports.printMessage = function printMessage(message, prevMessageId) {
        var deferred = q.defer();
        var success = "success";
        var error;
    
        var from;
        var message_text;
        var images = [];
        var timestamp;
        var location;

        try {
            from = message.from;
            message_text = message.message;
            timestamp = message.timestamp;
            location = message.location;

            for (var count = 0; count < message.attachments.length; count++) {
            
                //Remove meta data
                var attachmentType = message.attachments[count].type.replace(/^image\/,/, "");

                var base64Data = message.attachments[count].data.replace(/^data:image\/png;base64,/, "");
                base64Data = base64Data.replace(/^data:image\/jpeg;base64,/, "");
                base64Data = base64Data.replace(/^data:image\/jpg;base64,/, "");
                base64Data = base64Data.replace(/^data:image\/gif;base64,/, "");
            
                console.log('lets create a file called: ' + message.attachments[count].name);
            
                var imageName = message.attachments[count].name;

                //TODO: change the type to account for the fact that we need to parse the type from the type field send (i.e. remove "image/" from the field
                fs.writeFile(message.attachments[count].name, base64Data, 'base64', function (err) {
                    if (err) {
                        console.log(err);
                    } else {

                        images.push(imageName);   //add the name of the file to the attachments
                    }
                });
            }
        } catch(ex)  {
            console.log(ex);
        }
    
        //print the message
        //We will use the format: 
        //converation: from
        //message
        //images (optional)
        //location timestamp
    
        try {
            console.log('printing the message now');

            printLine(from);
            printLine(message);
        
            for (var count = 0; count < images.length; count++) {
                printImage(images[count]);
            }
        
            printLine(location + " " + timestamp);
        
            deferred.resolve(success);
        } catch (ex) {
            console.log('Error sending info to print function');
            console.log(ex);
        }

        console.log('done with this stupid print function.');

        return deferred.promise;
    }
    
    //Low level functions
    function printLine(message) {
        var deferred = q.defer();
        var error;
        var result;
        
        console.log('printing the line: ' + message);

        try {
            serialPort.on('open', function () {
                
                console.log('Serial Printer ready!');

                var printer = new Printer(serialPort);
                printer.on('ready', function () {
                    
                    printer.on('ready', function () {
                        printer.printLine(message);
                    });
                    
                    result = "success";
                    process.exit();                 //Assume this free's up the printer, but I'm not really sure
                    deferred.resolve(result);
                });
            });
        } catch (ex) {
            error = "printer not initialized";
            deferred.reject(error);
        }
        
        return deferred.promise();
    }

    //This will print an image with the specified path
    function printImage(path){
        var deferred = q.deferred();
        var error;
        var success;
    
        console.log('Printing image at: ' + path);
    
        try {
            serialPort.on('open', function () {

                var printer = new Printer(serialPort);
                printer.on('ready', function () {
                    Image.readyImage(path, imageMaxWidth).then(function (outputPath) {
                        printer.printImage(outputPath);
                    });
                });
            });
        
            success = "success";
            process.exit();                 //Assume this free's up the printer, but I'm not really sure
            deferred.resolve(success);
        } catch (ex) {
            console.log('Error printing');
            console.log(ex);
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

})();