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
     * App viewModel
     */
    var AppViewModel = function(options){
        // Data members
        var self = this;
        this.list = appModel.places;
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

    var MapManager = function(){};
    MapManager.prototype.selectPlace = function(place){};
    MapManager.prototype.fitBounds = function(place){};
    globals.MapManager = MapManager;
    
    /**
     * App init
     */
    function appInit() {
        var appViewModel = new AppViewModel({
            title: 'Neighborhood Map',
            searchResults: ['a', 'b']
        });
        ko.applyBindings(appViewModel);
        
        //globals.mapManager = new globals.MapManager();
        
        //appViewModel.updateCurrentPosition(PATIALA_LAT_LNG);
        
        // Utility
        // .getCurrentLocation()
        // .then(function(args){)
        // .catch(console.error);
    }
    globals.appInit = appInit;
})(ko, document, window);