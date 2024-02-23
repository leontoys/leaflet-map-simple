// Initialize the map
var map = L.map('map').setView([-25.2744, 133.7751], 4);

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Add a marker for a specific location (e.g., Sydney)
//var marker = L.marker([-33.8688, 151.2093]).addTo(map);

/* // Load the GeoJSON file
fetch('electoral_boundaries_50p.geojson')
    .then(response => response.json())
    .then(data => {
        // Create a GeoJSON layer and add it to the map
        L.geoJSON(data).addTo(map);
    }); */

/*  // Function to geocode electorates using Nominatim
function geocodeElectorate(electorate, callback) {
    // Use Nominatim API to geocode the electorate
    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + electorate)
      .then(response => response.json())
      .then(data => {
        // Extract latitude and longitude from the response
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        console.log([latitude, longitude]);
        // Pass the coordinates to the callback function
        callback([latitude, longitude]);
      })
      .catch(error => {
        console.error('Error geocoding electorate:', error);
      });
  }  */

// Define a custom marker icon with a watermelon image
var watermelonIcon = L.icon({
  iconUrl: 'watermelon-icon.png', // URL to the watermelon image file
  iconSize: [40, 40], // Size of the icon
  iconAnchor: [20, 40], // Point of the icon which corresponds to marker's location
  popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
});

// Parse CSV data and add markers to the map
Papa.parse('mp_data_geocoded.csv', {
  download: true,
  header: true,
  complete: function(results) {
    results.data.forEach(function(row) {
      if(row.Voted == 'Yes'){
      // Extract latitude and longitude from the row
      var latitude = parseFloat(row.Latitude);
      var longitude = parseFloat(row.Longitude);
      
      // Create a marker with a popup showing MP's information
      L.marker([latitude, longitude], { icon: watermelonIcon })
        .bindPopup('<b>' + row['Honorific'] + ' ' + row['Surname'] + ', ' + row['First Name'] + '</b><br>' +
                   'Electorate: ' + row['Electorate'] + '<br>' +
                   'Political Party: ' + row['Political Party'])
        .addTo(map);
      }
    });
  }
});