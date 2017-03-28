(function(document, globals){
    'use strict';
    var ZOOM = 13;
    var INITIAL_POSITION = {lat: 40.7413549, lng: -73.9980244};
    var MapManager = function(){
        // currentPosition in format {lat: 40.7413549, lng: -73.9980244}
        this.currentPosition = INITIAL_POSITION;
        this.zoom = ZOOM;
        this.map;
        this.init();
    };
    MapManager.prototype.getCurrentPosition = function(){
        return this.currentPosition;
    };

    // param pos of format {latitude: 123, longitude: 1234}
    MapManager.prototype.setCurrentPosition = function(pos){
        this.currentPosition = {lat: pos.latitude, lng: pos.longitude};
        this.map.setCenter(this.currentPosition);
    };
    MapManager.prototype.getZoom = function(){
        return this.zoom;
    };
    MapManager.prototype.init = function(){
        this.map = new globals.google.maps.Map(document.getElementsByClassName('map-section')[0], {
            center: this.getCurrentPosition(),
            zoom: this.getZoom()
        });
        // var tribeca = {lat: 40.719, lng: -74.0089934};
        // var marker = new globals.google.maps.Marker({
        //     position: tribeca,
        //     map: map,
        //     title: 'First marker'
        // });
        // var infoWindow = new globals.google.maps.InfoWindow({
        //     content: 'Hi...'
        // });
        // marker.addListener('click', function(){
        //     infoWindow.open(map, marker);
        // });        
    };
    globals.MapManager = MapManager;
})(document, window);