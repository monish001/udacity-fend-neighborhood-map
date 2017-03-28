(function(ko, document, globals){
    'use strict';

    // Singleton Utility that contains helper functions
    var Utility = {
        getCurrentLocation: function getCurrentLocation(){
            return '<current location>';
        }
    };

    /**
     * App Model class
     */
    var AppModel = function(){};

    var AppViewModel = function(options){
        this.title = ko.observable(options.title);
        this.searchText = ko.observable(options.searchText);
        this.searchResults = ko.observableArray(options.searchResults);
        this.isSearchBarHidden = ko.observable(options.isSearchBarHidden);
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
        this.searchText(newAddress);
        this.updateMapMarkers(newAddress);
    };
    AppViewModel.prototype.updateSearchResults = function(){
        todoHttp
        .get(url)
        .then(function(){})
        .catch(this.handleErrors);
    };
    AppViewModel.prototype.handleErrors = function(){
        
    };
    var appViewModel = new AppViewModel({
        title: 'Neighborhood Map',
        searchText: ''
    });

    function appInit(){
        ko.applyBindings(appViewModel);
    }
    appInit();
})(ko, document, window);