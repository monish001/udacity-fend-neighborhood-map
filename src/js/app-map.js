(function(document, globals){
    'use strict';

    globals.initMap = function initMap(){
        var map = new globals.google.maps.Map(document.getElementsByClassName('map-section')[0], {
            center: {lat: 40.7413549, lng: -73.9980244},
            zoom: 13
        });
        var tribeca = {lat: 40.719, lng: -74.0089934};
        var marker = new globals.google.maps.Marker({
            position: tribeca,
            map: map,
            title: 'First marker'
        });
        var infoWindow = new globals.google.maps.InfoWindow({
            content: 'Hi...'
        });
        marker.addListener('click', function(){
            infoWindow.open(map, marker);
        });        
    }
})(document, window);