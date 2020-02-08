L.mapbox.accessToken = 'pk.eyJ1IjoicHFtdXJwaHkiLCJhIjoiY2szdGY4YTFtMDI5MzNkbDdkM3U5dzJjMiJ9.Vu8FS4DCrXwhSzfHNkWCxQ';
var map = L.mapbox.map("map", 'mapbox.streets').setView([54.2361, -4.5481], 6);
var zoomed = 0;
var probdata = [];

// KML DATA
var ireland = "static/data/Irl.kml";
var united = "static/data/UK.kml";v

// FUNCTION FOR PASSING TEXT TO BACKEND //
$(function() {
  $("#submit").click(function() {
    $.ajax({
      type: 'POST',
      url: '/predict',
      data: {tweet: $('#inputTweet').val(),}
    })
    // RETURNS DATA FROM BACKEND AND UPDATES MAP //
    .done(function(data) {
      probdata = data.output
      addlayers();
    });
    event.preventDefault();
  });
});

// Get Probability 
function colorGrade(d) {
  console.log("this goes into the colour gradient: "+d)
  
      return d > 90 ? '#800026' :
      d > 80  ? '#BD0026' :
      d > 70  ? '#E31A1C' :
      d > 60  ? '#FC4E2A' :
      d > 50   ? '#FD8D3C' :
      d > 40   ? '#FEB24C' :
      d > 30   ? '#FED976' :
      d > 20   ? '#FFEDA0' :
      d > 10   ? '#fff9e2' :
                 '#fffdf5' ;
  }
/// FUNCTION TO COLOUR EACH COUNTY ///
function getColor(id) {

  var d = 0;
  // Go Through indexdat JSON object to grab probability for each county
  probdata.forEach(function(data) {
      if (data.name == id) {
          d = parseFloat(data.prob)
          console.log("this is my name: "+id+" - this is my prob: "+d)
      }
  })
  
  return colorGrade(d)
}

// Styling and Hover Interaction
function style(feature) {
  return {
      fillColor: getColor(feature.properties.name),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

// STYLING FOR HIGHLIGHTING COUNTIES //
function highlightFeature(e) {
  var layer = e.target;

  info.update(layer.feature.properties);
  // console.log(layer.feature.properties)

  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}

// FUNCTION WHEN HOVER OUT OF COUNTY //
function resetHighlight(e) {
  irepoly.resetStyle(e.target);
  ukpoly.resetStyle(e.target);
  info.update();
}

// FUNCTION FOR ZOOMING //
function zoomToFeature(e) {
  if (zoomed == 0) {
      // "hood" variable is used to indicate what the spider plot should draw //
      var hood = e.target.feature.properties.name;
      zoomed = 1;
      map.fitBounds(e.target.getBounds());
      /// PLACE REDRAW FUNCTION HERE ///
      buildCharts(hood);
      /// PLACE REDRAW FUNCTION HERE ///
  }
  else {
      // "hood" variable is used to indicate what the spider plot should draw //
      var hood = 0;
      zoomed = 0;
      map.setView([54.2361, -4.5481], 6);
  }
}

// FUNCTION FOR INTERACTION CALLS //
function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

// Draw the map
// Instantiate initial style //
var customLayer = L.geoJson(null, {
  style: style,
  onEachFeature: onEachFeature
});

// Creates the GeoJSON Layers ///
var irepoly = omnivore.kml(ireland, null, customLayer)
var ukpoly = omnivore.kml(united, null, customLayer)

// FUNCTION FOR ADDING THE LAYERS //
function addlayers() {
  irepoly.addTo(map);
  ukpoly.addTo(map);
}

// FUNCTION FOR CREATING INFORMATION AREA //
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// function for grabbing percentage
function percgrab(id) {   
    
  var d = 0;
  
  // Go Through indexdat JSON object to grab probability for each county
  ire_testdata.forEach(function(data) {
      if (data.name == id) {
          d = parseFloat(data.prob)
          console.log("this is my name: "+id+" - this is my prob: "+d)
      }
  })

  uk_testdata.forEach(function(data) {
      if (data.name == id) {
          d = parseFloat(data.prob)
          console.log("this is my name: "+id+" - this is my prob: "+d)
      }
  })
  
  return (d)
}

// FUNCTION FOR POPULATING INFORMAITON AREA //
info.update = function (props) {
  this._div.innerHTML = '<h4>County Name</h4>' +  (props ?
      '<b>' + props.name + '</b><br />' + 
      '<h4>Percentage Match</h4>' + 
      '<b>' + percgrab(props.name) + '%' + '</b>'  
      : 'Hover over a county');
};

info.addTo(map);

// FUNCTION FOR COLOUR LEGEND //

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorGrade(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '-100');
    }

    return div;
};

legend.addTo(map);

addlayers()