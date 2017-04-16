(function(ko, document, globals){
    'use strict';

    /*
     * App model
     */
    var appModel = {
        places: [
            {id: 1, title: 'Timeless Wedding Moments', lat: '12.944436', lng: '77.624534'},
            {id: 2, title: 'WeddingBellz', lat: '12.985665', lng: '77.548819'},
            {id: 3, title: 'Candid Wedding Photography by Vikash Kumar', lat: '12.867634', lng: '77.563906'},
            {id: 4, title: 'Studio AJ by Anbujawahar', lat: '13.0189818', lng: '77.6374287'},
            {id: 5, title: 'Wed Gorgeous.com', lat: '12.91791', lng: '77.59268'},
            {id: 6, title: 'Pradeep Sanyal Photography', lat: '12.9206491', lng: '77.6516286'},
            {id: 7, title: 'Arun Candid Wedding Photography', lat: '12.9538846', lng: '77.4898208'}
        ]
    };

    /**
     * AppViewModel
     */
    var AppViewModel = function(options){
        // Data members
        var self = this;
        this.list = options.places;
        this.selectedPlaceTitle = ko.observable('not selected');
        this.filterText = ko.observable('');
        this.filteredList = ko.computed(function(){
            var filteredList = [];
            var filterText = self.filterText().toLowerCase();
            self.list.forEach(function(place){
                if(place.title.toLowerCase().indexOf(filterText) != -1){ // if contains
                    filteredList.push(place);
                }
            });
            return filteredList;
        });

        // Functions
        this.onClick = function(place){
            // self.selectedPlace.id = place.id;
            // self.selectedPlace.lat = place.lat;
            // self.selectedPlace.lng = place.lng;
            self.selectedPlaceTitle(place.title);
        };
        // AppViewModel.prototype.init;
        // AppViewModel.prototype.onSearch;
    };
    globals.AppViewModel = AppViewModel;

    /** constants */
    var MAP_INITIAL_ZOOM = 13;
    //var MAP_INITIAL_POSITION = {lat: 40.7413549, lng: -73.9980244};
    /**
     * MapManager
     */
    var MapManager = function(){
        this.zoom = MAP_INITIAL_ZOOM;
        this.initMap();
    };
    MapManager.prototype.initMap = function(){
        var self = this;
        // var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        this.map = new globals.google.maps.Map(document.getElementsByClassName('map-section')[0], {
            zoom: this.getZoom(),
        });

        this.markers = [];

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0, currentPlace, currentPlaceLatLng, currentPlaceTitle, currentMarker; i < appModel.places.length; i++) {
            // Get the position
            currentPlace = appModel.places[i];
            currentPlaceLatLng = new google.maps.LatLng(currentPlace.lat, currentPlace.lng);
            currentPlaceTitle = currentPlace.title;

            // Create a marker per location, and put into markers array.
            currentMarker = new google.maps.Marker({
                map: self.map,
                position: currentPlaceLatLng,
                title: currentPlaceTitle,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // Push the marker to our array of markers.
            self.markers.push(currentMarker);
            // Create an onclick event to open an infowindow at each marker.
            // currentMarker.addListener('click', function() {
            // populateInfoWindow(this, largeInfowindow);
            // });
            bounds.extend(self.markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        this.map.fitBounds(bounds);
    };
    MapManager.prototype.getZoom = function(){
        return this.zoom;
    };
    // MapManager.prototype.selectPlace = function(place){};
    // MapManager.prototype.fitBounds = function(place){};
    globals.MapManager = MapManager;

    /**
     * App init
     */
    function appInit() {
        var appViewModel = new AppViewModel({places: appModel.places});
        ko.applyBindings(appViewModel);

        globals.mapManager = new globals.MapManager();
    }
    globals.appInit = appInit;
})(ko, document, window);