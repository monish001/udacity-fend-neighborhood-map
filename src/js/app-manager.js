(function(ko, document, globals){
    'use strict';

    /**
     * CONSTANTS
     */
    var CONSTANTS = {
        FOUR_SQUARE_CLIENT_ID: 'G55PGTIJ0BIO14PWTSYKWXRCF2MM3B0YOUZDMWU5EG0DKEDM',
        FOUR_SQUARE_CLIENT_SECRET: 'AOPW13P5JSEVL0CSRCQWU2VCLG10P2UDXPN053XK10RN1PER',
        MAP_INITIAL_ZOOM: 5,
        MAP_INITIAL_POSITION: {lat: 26.9859, lng: 75.8507}
    };

    /**
     * Utility
     */
    var Utility = {
        // returns last item in list having key, value pair 
        // returns null if not found
        pickLastBy: function(list, key, value) {
            var result = null;
            list && list.forEach(function(element){
                if(element[key] === value){
                    result = element;
                }
            });
            return result;
        },

        // returns array with values of list[i].key
        // returns empty array if list is null/undefined or empty.
        pick: function(list, key){
            var result = [];
            list && list.forEach(function(element){
                result.push(element[key]);
            });
            return result;
        }
    };

    /*
     * App model
     */
    var appModel = {
        places: [
            {id: 8, title: 'Gwalior Fort', lat: '26.2303', lng: '78.1689'},
            {id: 9, title: 'Mehrangarh Fort', lat: '26.29784', lng: '73.01842'},
            {id: 10, title: 'Red Fort', lat: '28.6562', lng: '77.2410'},
            {id: 11, title: 'Chittorgarh Fort', lat: '24.8863', lng: '74.647'},
            {id: 13, title: 'Jaisalmer Fort', lat: '26.9127', lng: '70.9126'},
            {id: 14, title: 'Amer Fort', lat: '26.9859', lng: '75.8507'}
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
        self.filterText.subscribe(function(newText){
            self.clearPlaceSelection();
            globals.mapManager.clearPlaceSelection();
        });
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
        self.filteredList.subscribe(function(newList){
            self.onFilteredListChange(newList);
        });
        self.onFilteredListChange = function(filteredPlaces){
            var filteredPlaceIds = Utility.pick(filteredPlaces, 'id');
            globals.mapManager.renderMarkers(filteredPlaceIds);
        }
        // Calls on map bounds change.
        // To update places to those visible in map
        // self.updateList = function(placeIds){ 
        //     self.filterText(null);
        //     self.filteredPlaceIdsFromMap(placeIds);
        // };

        // Functions
        self.onListItemClick = function(place){
            self.selectedPlaceTitle(place.title);
            globals.mapManager.selectPlace(place.id);
        };
        // AppViewModel.prototype.init;
        // AppViewModel.prototype.onSearch;
        self.clearPlaceSelection = function() {
            self.selectedPlaceTitle('not selected');
        };
        self.selectPlace = function(placeId){
            var selectedPlace = Utility.pickLastBy(self.list, 'id', placeId);
            self.selectedPlaceTitle(selectedPlace.title);
        };
    };
    globals.AppViewModel = AppViewModel;

    /**
     * MapManager
     */
    var MapManager = function(){
        this.initMap();
    };
    MapManager.prototype.initMap = function(){
        var self = this;
        var bounds = new google.maps.LatLngBounds();

        self.map = new globals.google.maps.Map(document.getElementsByClassName('map-section')[0], {
            zoom: CONSTANTS.MAP_INITIAL_ZOOM,
            center: CONSTANTS.MAP_INITIAL_POSITION
        });

        self.infoWindow = new google.maps.InfoWindow();
        self.markersMap = {};
        var createMarkerPromises = self.createMarkers();

        $.when.apply($, createMarkerPromises).then(function() {
            google.maps.event.addListener(self.map, 'bounds_changed', function(){
                var visibleMarkerIds = self.renderVisibleMarkers();
            });
        });
    };
    MapManager.prototype.renderVisibleMarkers = function(){
        var self = this;
        var bounds = self.map.getBounds();
        var visibleMarkerIds = [];
        var filteredPlacesFromList = globals.appViewModel.filteredList();

        filteredPlacesFromList.forEach(function(place){
            var currentMarker = self.markersMap[place.id];
            if(bounds.contains(currentMarker.getPosition())){
                currentMarker.setVisible(true);
                visibleMarkerIds.push(currentMarker.id);
            }else{
                currentMarker.setVisible(false);
            }
        });
        return visibleMarkerIds;
    };
    MapManager.prototype.clearMarkersFromMap = function(){
        var self = this;
        for(var currentMarkerId in self.markersMap){
            var currentMarker = self.markersMap[currentMarkerId];
            currentMarker.setVisible(false);
        };
    };
    // Renders markers with id in markerIds[] else renders all
    MapManager.prototype.renderMarkers = function(markerIds){
        var self = this;
        var bounds = new google.maps.LatLngBounds();
        self.clearMarkersFromMap();
        markerIds.forEach(function(markerId){ // value, key
            var currentMarker = self.markersMap[markerId];
            currentMarker.setVisible(true);
            bounds.extend(currentMarker.position);
        });
        self.map.fitBounds(bounds);
    };
    MapManager.prototype.createMarker = function(currentPlace){
        var self = this;
        var fourSquareUrl = 'https://api.foursquare.com/v2/venues/search?' +
            'll=' + currentPlace.lat + ',' + currentPlace.lng + 
            '&client_id=' + CONSTANTS.FOUR_SQUARE_CLIENT_ID + 
            '&client_secret=' + CONSTANTS.FOUR_SQUARE_CLIENT_SECRET + 
            '&v=20161016' + 
            '&query=' + encodeURIComponent(currentPlace.title);

        return $.getJSON(fourSquareUrl)
            .always(function(data){self.fourSquareAlways(data, currentPlace);});
    };
    MapManager.prototype.fourSquareAlways = function(fourSquareData, currentPlace){
        var self = this;
        var venue = fourSquareData.response ? fourSquareData.response.venues[0] : null;
		var street = venue ? venue.location.formattedAddress[0] : '';
     	var city = venue ? venue.location.formattedAddress[1] : '';
        var markerTitle = `<div class="info-window-content">
                <div class="title"><b>${currentPlace.title}</b></div>
                <div class="content">${street}</div>
                <div class="content">${city}</div>
            </div>`;
        var currentMarker = new google.maps.Marker({
            position: new google.maps.LatLng(currentPlace.lat, currentPlace.lng),
            title: markerTitle,
            animation: google.maps.Animation.DROP,
            id: currentPlace.id,
            map: self.map
        });
        currentMarker.addListener('click', function(marker) {
            return function(){
                self.selectPlace(marker.id);
                globals.appViewModel.selectPlace(marker.id);
            };
        }(currentMarker));
        self.markersMap[currentMarker.id] = currentMarker;
    };
    MapManager.prototype.fourSquareFail = function(){
        alert('There was an error loading FourSquare API call. Please refresh the page to correct the problem or try after sometime.');
    }
    MapManager.prototype.createMarkers = function(){
        var self = this;
        var fourSquareApiPromises = [];
        appModel.places.forEach(function(currentPlace){
            var apiCallPromise = self.createMarker(currentPlace);
            fourSquareApiPromises.push(apiCallPromise);
        });
        $.when.apply($, fourSquareApiPromises).then(function() {
            // all foursquare api calls succeeded.
        }, function(e) {
            console.log(e);
            self.fourSquareFail();
        });
        return fourSquareApiPromises;
    };
    MapManager.prototype.selectPlace = function(markerId) {
        var self = this;
        var marker = self.markersMap[markerId];
        self.showInfoWindow(marker.id);
        self.clearMarkersAnimation();
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    MapManager.prototype.clearMarkersAnimation = function() {
        var self = this;
        for(var currentMarkerId in self.markersMap){
            var currentMarker = self.markersMap[currentMarkerId];
            currentMarker.setAnimation(null);
        };
    };

    // This function populates the infoWindow when the marker is clicked. We'll only allow
    // one infoWindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    MapManager.prototype.showInfoWindow = function(markerId) {
        var self = this;
        var marker = self.markersMap[markerId];
        var infoWindow = self.infoWindow;
        // Check to make sure the infoWindow is not already opened on this marker.
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(self.map, marker);
            // Make sure the marker property is cleared if the infoWindow is closed.
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker && infoWindow.marker.setAnimation(null);
                infoWindow.marker = null;
                globals.appViewModel.clearPlaceSelection();
            });
        }
    };
    MapManager.prototype.clearPlaceSelection = function(){
        var self = this;
        self.infoWindow.marker = null;
        self.infoWindow.close();
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

    function googleInitError(){
        alert('There is a problem with google maps. Please refresh the page to load again.');
    }
    globals.googleInitError = googleInitError;
})(ko, document, window);