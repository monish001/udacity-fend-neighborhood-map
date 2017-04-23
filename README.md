### Introduction
Neighborhood maps project as per udacity fend nanodegree requirements.

### Index
- Running locally
- Demo
- Deployment
- Features

### Running locally
- Open `/src/index.html` in chrome web-browser.

### Demo
- Latest version can be run at [http://mg-neighborhood-map.surge.sh](http://mg-neighborhood-map.surge.sh)

### Deployment
- Run `surge ./src` from root directory to deploy the `./src` directory.
- Verify the deployed changes at [http://mg-neighborhood-map.surge.sh](http://mg-neighborhood-map.surge.sh)

### Features
##### Version 0.1.0
- Initial list of famous forts from India is shown in the list and in the map.
- List can be filtered by text. Locations in the map are updated accordingly.
- Foursquare API is used to fetch address of the forts.
- The web-app renders gracefully in mobile as well as bigger screen. Filter and list can be viewed in mobile device by tapping on the ham-burger icon on right-top.
- Clicking on item from list or marker in map shows name of the fort and address fetched from foursquare API.
- Bounce animation added to the marker when marker is clicked or an item is selected from the list.

##### Changes as per review comments
- Error handling done if google maps script fails to load.
- Steps to run the app locally added in readme.
- marker.setMap replaced with marker.setVisible for optimization.