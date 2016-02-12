(function () {
    
    /* *
    * The image module, which will responsible for manipulating an image to ensure that it can be printed
    * */

    var q = require('q');
    var sharp = require('sharp');           //Image manipluation library
    
    exports.readyImage = function (pathToImage, width) {
        
        var deferred = q.defer();
        var height;
        var image = sharp(pathToImage)

        //Initialize the sharp image manipulating object
        image.metadata().then(function (metadata) {
            image
                .resize(width, (metadata.height / (metadata.width / width)))
                .toFile(pathToImage + "_printReady", function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(pathToImage + "_printReady");
                    }
                });
        });
        

        return deferred.promise;
    }

})();