(function(document, globals){
    'use strict';
    var RADIUS = '100';
    var ZOOM = 13;
    var INITIAL_POSITION = {lat: 40.7413549, lng: -73.9980244};
    var LOCATIONS = [
        // todo add more locations from Malerkotla as well
        {title: 'Batra Studio', location: {lat: 30.3314833, lng: 76.38994}},
        {title: `Expert Team Photography 'Wedding Cinema'`, location: {lat: 30.3314833, lng: 76.38994}}
    ];
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
    MapManager.prototype.createMarkers = function(places){
        var bounds = new google.maps.LatLngBounds();
        var placesList = document.getElementById('places');

        for (var i = 0, place; place = places[i]; i++) {
            var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
            };

            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            placesList.innerHTML += '<li>' + place.name + '</li>';

            bounds.extend(place.geometry.location);
        }
        this.map.fitBounds(bounds);
    }
    MapManager.prototype.updatePlaces = function(){
        this.placesService.nearbySearch({
            location: this.getCurrentPosition(),
            // types: ['store'],
            radius: RADIUS
        }, function(results, status){
            if (status == globals.google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    console.log(place.geometry.location.lat());
                    console.log(place.geometry.location.lng());
                    createMarkers(results[i]);
                }
            }            
        });
    };
    MapManager.prototype.init = function(){
        var self = this;
        this.map = new globals.google.maps.Map(document.getElementsByClassName('map-section')[0], {
            //center: PATIALA_LAT_LNG,
            zoom: this.getZoom()
        });
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.updatePlaces();

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