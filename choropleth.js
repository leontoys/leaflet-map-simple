// Initialize the map
var map = L.map('map').setView([-25.2744, 133.7751], 4);

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialize an empty object to store MP data by electorate
var mpData = {};

// Parse CSV data and store it into the object
Papa.parse('mp_data_geocoded.csv', {
    download: true,
    header: true,
    complete: function (results) {
        results.data.forEach(function (row) {
            var electorate = row.Electorate;
            mpData[electorate] = {
                voted: row.Voted
            };
        });

        // Now you have access to the MP data by electorate in the mpData object
        console.log(mpData);

        // Load GeoJSON data
        fetch('electoral_boundaries_50p.geojson')
            .then(response => response.json())
            .then(geojsonData => {
                var geojsonLayer = L.geoJSON(geojsonData, {
                    style: function (feature) {
                        var electorateName = feature.properties.Elect_div;
                        var mp = mpData[electorateName];
                        var fillColor = '#cccccc'; // Default color
                        if (mp) {
                            fillColor = mp.voted === 'Yes' ? '#00FF00' : '#FF0000';
                        }
                        return {
                            fillColor: fillColor,
                            weight: 1,
                            opacity: 1,
                            color: 'white',
                            fillOpacity: 0.7
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        var electorateName = feature.properties.Elect_div;
                        var mp = mpData[electorateName];
                        layer.bindPopup('<b>' + electorateName + '</b><br>Voted: ' + (mp ? mp.voted : 'Unknown'));                    }
                }).addTo(map);
            });
    }
});
