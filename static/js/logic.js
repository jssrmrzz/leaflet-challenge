const eqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform API call
d3.json(eqURL).then(createMarkers);

d3.json(eqURL).then(data => {
    console.log(data);
});

// Set color function for EQ mag size
function getColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'yellow'
    } else if (magnitude > 2) {
        return 'lightgreen'
    } else if (magnitude > 1) {
        return 'green'
    } else {
        return 'black'
    }
}

function createMap(earthquakes) {

    // Create base map
    var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create baseMaps object to hold lightMap layer
    var baseMap = {
        "base map": basemap
    };

    // Create an overlayMaps object
    var overlayMaps = {
        "Earthquakes": earthquakes
    };
    
      // Create myMap object
      var myMap = L.map('map', {
        center: [40.7, -94.5],
        zoom: 4,
        layers: [basemap, earthquakes]
      });
    
    // Create a layer control, and pass in both baseMap, overlayMaps
    L.control.layers(baseMap, overlayMaps, {
        collapse: false,
    }).addTo(myMap);

     //Create Legend - figure out add color spectrum bug
     var legend = L.control({position: 'bottomright'});
     legend.onAdd = function () {
 
     var div = L.DomUtil.create('div', 'info legend'),
     
     magLevels = [0, 1, 2, 3, 4, 5];

     div.innerHTML += "<h3>Magnitude</h3>"
 
     for (var i = 0; i < magLevels.length; i++) {
         div.innerHTML +=
             '<i style="background:' + getColor(magLevels[i] + 1) + '"></i> ' +
             magLevels[i] + (magLevels[i + 1] ? '&ndash;' + magLevels[i + 1] + '<br>' : '+');
     }
     return div;
     };
     // Add Legend to map
     legend.addTo(myMap); 
}

function createMarkers(response) {

    // Function to have run on each feature
    var features = response.features;

    var earthquakeMarkers = [];

    // Loop to build EQ details
    for (var i = 0; i < features.length; i++) {

        var earthquake = features[i];
        var magnitude = earthquake.properties.mag;
        var depthColor = getColor(earthquake.geometry.coordinates[2]);

        var earthquakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            radius: magnitude * 10000,
            color:  depthColor
        }).bindPopup(
            "</h3><h3>Date & Time: " + new Date (earthquake.properties.time) + "</h3>" +
            "</h3><h3>Title: " + earthquake.properties.title + "</h3>" +
            "</h3><h3>Place: " + earthquake.properties.place + "</h3>" +
            "</h3><h3>Magnitude: " + earthquake.properties.mag + "</h3>" +
            "</h3><h3>Focal Depth: " + earthquake.geometry.coordinates[2] + "</h3>" 
        );

        earthquakeMarkers.push(earthquakeMarker);
    }
    // Create layer group from the markers array then pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));
};


