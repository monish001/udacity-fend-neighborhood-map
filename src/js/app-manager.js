(function(ko, document, globals){
    'use strict';

    var PATIALA_LAT_LNG = {latitude: 30.332595, longitude: 76.400283};

    /**
     * App ViewModel class
     */
    var AppViewModel = function(options){
        this.title = ko.observable(options.title);
        //this.searchText = ko.observable(options.searchText);
        this.currentPosition = ko.observable(); // {latitude: a, longitude: b}
        this.searchResults = ko.observableArray(options.searchResults);
        //this.isSearchBarHidden = ko.observable(options.isSearchBarHidden);
    };
    AppViewModel.prototype.toggleSearchBarView = function(){
        this.isSearchBarHidden(!this.isSearchBarHidden());
    };
    /**
     * reads the address from input text and delegates to update the map markers/items
     */
    AppViewModel.prototype.onSearchTextChange = function(newAddress){
        if(!isAddressValid(newAddress)){
            return;
        }
        var position = getPosition(newAddress)
        this.updateCurrentPosition(position);
        this.updateMapMarkers(newAddress);
    };
    AppViewModel.prototype.updateCurrentPosition = function(pos){
        globals.mapManager.setCurrentPosition(pos);
        this.currentPosition(pos);
    };
    AppViewModel.prototype.updateSearchResults = function(){
        todoHttp
        .get(url)
        .then(function(){})
        .catch(this.handleErrors);
    };
    AppViewModel.prototype.handleErrors = function(){
        
    };
    
    /**
     * App init
     */
    function appInit() {
        var appViewModel = new AppViewModel({
            title: 'Neighborhood Map',
            searchResults: ['a', 'b']
        });
        ko.applyBindings(appViewModel);
        
        globals.mapManager = new globals.MapManager();
        
        appViewModel.updateCurrentPosition(PATIALA_LAT_LNG);
        
        // Utility
        // .getCurrentLocation()
        // .then(function(args){)
        // .catch(console.error);
    }
    globals.appInit = appInit;
})(ko, document, window);