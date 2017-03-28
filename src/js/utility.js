(function(globals){
    'use strict';

    // Singleton Utility that contains helper functions
    var Utility = {
        getCurrentLocation: function getCurrentLocation(){
            // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition#Example
            // http://stackoverflow.com/a/10540565/989139
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 60000
            };
            var promise = new Promise((resolve, reject)=>{

                function success(pos) {
                    var crd = pos.coords;

                    console.log('Your current position is:');
                    console.log(`Latitude : ${crd.latitude}`);
                    console.log(`Longitude: ${crd.longitude}`);
                    console.log(`More or less ${crd.accuracy} meters.`);
                    
                    resolve(crd);
                };

                function error(err) {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                    reject(err);
                };

                navigator.geolocation.getCurrentPosition(success, error, options);
            });
            return promise;
        }
    };
    globals.Utility = Utility;
})(window);


