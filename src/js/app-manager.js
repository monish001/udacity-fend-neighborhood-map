(function(ko, document, globals){
    'use strict';

    /**
     * Utility
     */
    var Utility = {
        pickBy: function(list, key, value) {
            var result = null;
            list && list.forEach(function(element){
                if(element[key] === value){
                    result = element;
                }
            });
            return result;
        }
    };

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
        self.list = options.places;
        self.selectedPlaceTitle = ko.observable('not selected');
        self.filterText = ko.observable('');
        // self.filteredPlaceIdsFromMap = ko.observable([]);
        self.filteredList = ko.computed(function(){
            var filteredList = [];
            var filterText = self.filterText() && self.filterText().toLowerCase();
            self.list.forEach(function(place){
                if(place.title.toLowerCase().indexOf(filterText) != -1){ // if contains
                    filteredList.push(place);
                }
            });
            return filteredList;
        });
        // Calls on map bounds change.
        // To update places to those visible in map
        // self.updateList = function(placeIds){ 
        //     self.filterText(null);
        //     self.filteredPlaceIdsFromMap(placeIds);
        // };

        // Functions
        self.onListItemClick = function(place){
            self.selectedPlaceTitle(place.title);
            globals.mapManager.showInfoWindow(place.id);
        };
        // AppViewModel.prototype.init;
        // AppViewModel.prototype.onSearch;
        self.clearPlaceSelection = function() {
            self.selectedPlaceTitle('');
        };
        self.selectPlace = function(id){
            var selectedPlace = Utility.pickBy(self.list, 'id', id);
            self.selectedPlaceTitle(selectedPlace.title);
        };
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
        var bounds = new google.maps.LatLngBounds();

        self.map = new globals.google.maps.Map(document.getElementsByClassName('map-section')[0], {
            zoom: this.getZoom(),
        });

        self.markers = self.createMarkers();

        google.maps.event.addListener(self.map, 'bounds_changed', function(){
            var visibleMarkerIds = self.renderVisibleMarkers();
            // globals.appViewModel.updateList(visibleMarkerIds);
        });

        self.renderAllMarkers();
    };
    MapManager.prototype.renderVisibleMarkers = function(){
        var self = this;
        var bounds = self.map.getBounds();
        var visibleMarkerIds = [];

        for(var i=0, currentMarker; i< self.markers.length; i++){
            currentMarker = self.markers[i];
            if(bounds.contains(currentMarker.getPosition())){
                currentMarker.setMap(self.map);
                visibleMarkerIds.push(currentMarker.id);
            }else{
                currentMarker.setMap(null);
            }
        }
        return visibleMarkerIds;
    };
    MapManager.prototype.renderAllMarkers = function(){
        var self = this;
        var bounds = new google.maps.LatLngBounds();
        for(var i=0, currentMarker; i< self.markers.length; i++){
            currentMarker = self.markers[i];
            currentMarker.setMap(self.map);
            bounds.extend(currentMarker.position);
        }
        self.map.fitBounds(bounds);
    };
    MapManager.prototype.createMarkers = function(){
        var self = this;
        var markers = [];
        self.infoWindow = new google.maps.InfoWindow();

        for(var i=0, currentMarker, currentPlace; i< appModel.places.length; i++){
            currentPlace = appModel.places[i];
            currentMarker = new google.maps.Marker({
                position: new google.maps.LatLng(currentPlace.lat, currentPlace.lng),
                title: currentPlace.title,
                animation: google.maps.Animation.DROP,
                id: currentPlace.id
            });
            currentMarker.addListener('click', function(marker) {
                return function(){
                    self.showInfoWindow(marker.id);
                    globals.appViewModel.selectPlace(marker.id);
                };
            }(currentMarker));
            markers.push(currentMarker);
        }
        return markers;
    };

    // This function populates the infoWindow when the marker is clicked. We'll only allow
    // one infoWindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    MapManager.prototype.showInfoWindow = function(markerId) {
        var self = this;
        var marker = Utility.pickBy(self.markers, 'id', markerId);
        var infoWindow = self.infoWindow;
        // Check to make sure the infoWindow is not already opened on this marker.
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(self.map, marker);
            // Make sure the marker property is cleared if the infoWindow is closed.
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
                globals.appViewModel.clearPlaceSelection();
            });
        }
    };
    MapManager.prototype.selectMarker = function(id) {

    };
    MapManager.prototype.getZoom = function() {
        return this.zoom;
    };
    // MapManager.prototype.selectPlace = function(place){};
    // MapManager.prototype.fitBounds = function(place){};
    globals.MapManager = MapManager;

    /**
     * App init
     */
    function appInit() {
        globals.appViewModel = new AppViewModel({places: appModel.places});
        ko.applyBindings(appViewModel);

        globals.mapManager = new globals.MapManager();
    }
    globals.appInit = appInit;
})(ko, document, window);