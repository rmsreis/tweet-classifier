L.mapbox.accessToken = 'pk.eyJ1IjoicHFtdXJwaHkiLCJhIjoiY2szdGY4YTFtMDI5MzNkbDdkM3U5dzJjMiJ9.Vu8FS4DCrXwhSzfHNkWCxQ';
var map = L.mapbox.map("map", 'mapbox.streets').setView([54.2361, -4.5481], 6);
var zoomed = 0;
var probdata = [];

// KML DATA
var ireland = "static/data/Irl.kml";
var united = "static/data/UK.kml";

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
      $('#message').text(data.output).show();
      
      probdata = [];
      probdata.push(data.output);
      redraw(irepoly);
      redraw(ukpoly);
      
    });
    event.preventDefault();
  });
});

// Get Probability 
function colorGrade(d) {
  
      return d > 90 ? '#800026' :
      d > 80 ? '#BD0026' :
      d > 70 ? '#E31A1C' :
      d > 60 ? '#FC4E2A' :
      d > 50 ? '#FD8D3C' :
      d > 40 ? '#FEB24C' :
      d > 30 ? '#FED976' :
      d > 20 ? '#FFEDA0' :
      d > 10 ? '#fff9e2' :
               '#fffdf5' ;
  }

/// FUNCTION TO COLOUR EACH COUNTY ///
function getColor(id) {

  var d = 0;
  // Go through JSON object to grab probability for each county
  probdata.forEach(function(data) {
      if (data.name == id) {
          d = parseFloat(data.prob)
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
      zoomed = 1;
      map.fitBounds(e.target.getBounds());
  }
  else {
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

  // isles.addTo(map);
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
  // Go through JSON object to grab probability for each county
  probdata.forEach(function(data) {
      if (data.name == id) {
          d = parseFloat(data.prob)
      }
  })
  
  return d
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

addlayers();

// Recolors counties on map
function redraw(poly) {
  var counties = poly._layers;
  Object.values(counties).forEach(value => {
    poly.resetStyle(value);
  });
}

var probdata = [
  {'name': 'Carlow', 'prob': '63'},
  {'name': 'Cavan', 'prob': '100'},
  {'name': 'Clare', 'prob': '55'},
  {'name': 'Cork', 'prob': '36'},
  {'name': 'Donegal', 'prob': '81'},
  {'name': 'Dublin', 'prob': '60'},
  {'name': 'Galway', 'prob': '77'},
  {'name': 'Kerry', 'prob': '97'},
  {'name': 'Kildare', 'prob': '60'},
  {'name': 'Kilkenny', 'prob': '32'},
  {'name': 'Laoighis', 'prob': '36'},
  {'name': 'Leitrim', 'prob': '68'},
  {'name': 'Limerick', 'prob': '68'},
  {'name': 'Longford', 'prob': '32'},
  {'name': 'Louth', 'prob': '46'},
  {'name': 'Mayo', 'prob': '84'},
  {'name': 'Meath', 'prob': '1'},
  {'name': 'Monaghan', 'prob': '45'},
  {'name': 'Offaly', 'prob': '72'},
  {'name': 'Roscommon', 'prob': '83'},
  {'name': 'Sligo', 'prob': '71'},
  {'name': 'Tipperary', 'prob': '38'},
  {'name': 'Waterford', 'prob': '33'},
  {'name': 'Westmeath', 'prob': '16'},
  {'name': 'Wexford', 'prob': '91'},
  {'name': 'Wicklow', 'prob': '14'},
  {'name': 'Banbridge', 'prob': '30'},
  {'name': 'Belfast', 'prob': '5'},
  {'name': 'Carrickfergus', 'prob': '45'},
  {'name': 'Castlereagh', 'prob': '49'},
  {'name': 'Coleraine', 'prob': '20'},
  {'name': 'Cookstown', 'prob': '63'},
  {'name': 'Craigavon', 'prob': '9'},
  {'name': 'Derry', 'prob': '46'},
  {'name': 'Down', 'prob': '31'},
  {'name': 'Dungannon', 'prob': '33'},
  {'name': 'Fermanagh', 'prob': '23'},
  {'name': 'Larne', 'prob': '40'},
  {'name': 'Limavady', 'prob': '59'},
  {'name': 'Lisburn', 'prob': '93'},
  {'name': 'Magherafelt', 'prob': '18'},
  {'name': 'Moyle', 'prob': '14'},
  {'name': 'Newry and Mourne', 'prob': '94'},
  {'name': 'Newtownabbey', 'prob': '14'},
  {'name': 'North Down', 'prob': '93'},
  {'name': 'Omagh', 'prob': '54'},
  {'name': 'Strabane', 'prob': '25'},
  {'name': 'Barking and Dagenham', 'prob': '73'},
  {'name': 'Bath and North East Somerset', 'prob': '68'},
  {'name': 'Bedfordshire', 'prob': '29'},
  {'name': 'Berkshire', 'prob': '87'},
  {'name': 'Bexley', 'prob': '55'},
  {'name': 'Blackburn with Darwen', 'prob': '41'},
  {'name': 'Bournemouth', 'prob': '82'},
  {'name': 'Brent', 'prob': '23'},
  {'name': 'Brighton and Hove', 'prob': '32'},
  {'name': 'Bristol', 'prob': '6'},
  {'name': 'Bromley', 'prob': '1'},
  {'name': 'Buckinghamshire', 'prob': '11'},
  {'name': 'Cambridgeshire', 'prob': '20'},
  {'name': 'Camden', 'prob': '99'},
  {'name': 'Cheshire', 'prob': '57'},
  {'name': 'Cornwall', 'prob': '84'},
  {'name': 'Croydon', 'prob': '84'},
  {'name': 'Cumbria', 'prob': '84'},
  {'name': 'Darlington', 'prob': '16'},
  {'name': 'Derby', 'prob': '17'},
  {'name': 'Derbyshire', 'prob': '1'},
  {'name': 'Devon', 'prob': '80'},
  {'name': 'Dorset', 'prob': '85'},
  {'name': 'Durham', 'prob': '85'},
  {'name': 'Ealing', 'prob': '2'},
  {'name': 'East Riding of Yorkshire', 'prob': '21'},
  {'name': 'East Sussex', 'prob': '71'},
  {'name': 'Enfield', 'prob': '53'},
  {'name': 'Essex', 'prob': '33'},
  {'name': 'Gloucestershire', 'prob': '66'},
  {'name': 'Greenwich', 'prob': '87'},
  {'name': 'Hackney', 'prob': '27'},
  {'name': 'Halton', 'prob': '23'},
  {'name': 'Hammersmith and Fulham', 'prob': '95'},
  {'name': 'Hampshire', 'prob': '72'},
  {'name': 'Haringey', 'prob': '9'},
  {'name': 'Harrow', 'prob': '82'},
  {'name': 'Hartlepool', 'prob': '32'},
  {'name': 'Havering', 'prob': '15'},
  {'name': 'Herefordshire', 'prob': '80'},
  {'name': 'Hertfordshire', 'prob': '19'},
  {'name': 'Hillingdon', 'prob': '72'},
  {'name': 'Hounslow', 'prob': '20'},
  {'name': 'Isle of Wight', 'prob': '8'},
  {'name': 'Islington', 'prob': '24'},
  {'name': 'Kensington and Chelsea', 'prob': '45'},
  {'name': 'Kent', 'prob': '8'},
  {'name': 'Kingston upon Hull', 'prob': '1'},
  {'name': 'Kingston upon Thames', 'prob': '46'},
  {'name': 'Lambeth', 'prob': '56'},
  {'name': 'Lancashire', 'prob': '7'},
  {'name': 'Leicester', 'prob': '19'},
  {'name': 'Leicestershire', 'prob': '53'},
  {'name': 'Lewisham', 'prob': '50'},
  {'name': 'Lincolnshire', 'prob': '22'},
  {'name': 'London', 'prob': '72'},
  {'name': 'Luton', 'prob': '40'},
  {'name': 'Manchester', 'prob': '29'},
  {'name': 'Medway', 'prob': '21'},
  {'name': 'Merseyside', 'prob': '68'},
  {'name': 'Merton', 'prob': '5'},
  {'name': 'Middlesbrough', 'prob': '16'},
  {'name': 'Milton Keynes', 'prob': '16'},
  {'name': 'Newham', 'prob': '60'},
  {'name': 'Norfolk', 'prob': '1'},
  {'name': 'North East Lincolnshire', 'prob': '64'},
  {'name': 'North Lincolnshire', 'prob': '23'},
  {'name': 'North Somerset', 'prob': '15'},
  {'name': 'North Yorkshire', 'prob': '76'},
  {'name': 'Northamptonshire', 'prob': '77'},
  {'name': 'Northumberland', 'prob': '70'},
  {'name': 'Nottingham', 'prob': '90'},
  {'name': 'Nottinghamshire', 'prob': '51'},
  {'name': 'Oxfordshire', 'prob': '28'},
  {'name': 'Peterborough', 'prob': '63'},
  {'name': 'Plymouth', 'prob': '37'},
  {'name': 'Poole', 'prob': '41'},
  {'name': 'Portsmouth', 'prob': '33'},
  {'name': 'Redbridge', 'prob': '74'},
  {'name': 'Redcar and Cleveland', 'prob': '71'},
  {'name': 'Richmond upon Thames', 'prob': '37'},
  {'name': 'Rutland', 'prob': '15'},
  {'name': 'Shropshire', 'prob': '25'},
  {'name': 'Somerset', 'prob': '98'},
  {'name': 'South Gloucestershire', 'prob': '93'},
  {'name': 'South Yorkshire', 'prob': '62'},
  {'name': 'Southampton', 'prob': '61'},
  {'name': 'Southend-on-Sea', 'prob': '21'},
  {'name': 'Southwark', 'prob': '31'},
  {'name': 'Staffordshire', 'prob': '15'},
  {'name': 'Stockton-on-Tees', 'prob': '55'},
  {'name': 'Stoke-on-Trent', 'prob': '96'},
  {'name': 'Suffolk', 'prob': '64'},
  {'name': 'Surrey', 'prob': '59'},
  {'name': 'Sutton', 'prob': '9'},
  {'name': 'Swindon', 'prob': '49'},
  {'name': 'Telford and Wrekin', 'prob': '66'},
  {'name': 'Thurrock', 'prob': '35'},
  {'name': 'Torbay', 'prob': '50'},
  {'name': 'Tower Hamlets', 'prob': '54'},
  {'name': 'Tyne and Wear', 'prob': '84'},
  {'name': 'Waltham Forest', 'prob': '21'},
  {'name': 'Wandsworth', 'prob': '65'},
  {'name': 'Warrington', 'prob': '26'},
  {'name': 'Warwickshire', 'prob': '57'},
  {'name': 'West Midlands', 'prob': '23'},
  {'name': 'West Sussex', 'prob': '59'},
  {'name': 'West Yorkshire', 'prob': '9'},
  {'name': 'Westminster', 'prob': '7'},
  {'name': 'Wiltshire', 'prob': '51'},
  {'name': 'Worcestershire', 'prob': '3'},
  {'name': 'York', 'prob': '30'},
  {'name': 'Antrim', 'prob': '72'},
  {'name': 'Ards', 'prob': '94'},
  {'name': 'Armagh', 'prob': '67'},
  {'name': 'Ballymena', 'prob': '71'},
  {'name': 'Ballymoney', 'prob': '87'},
  {'name': 'Aberdeen', 'prob': '15'},
  {'name': 'Aberdeenshire', 'prob': '64'},
  {'name': 'Angus', 'prob': '100'},
  {'name': 'Argyll and Bute', 'prob': '32'},
  {'name': 'Clackmannanshire', 'prob': '40'},
  {'name': 'Dumfries and Galloway', 'prob': '85'},
  {'name': 'Dundee', 'prob': '46'},
  {'name': 'East Ayrshire', 'prob': '85'},
  {'name': 'East Dunbartonshire', 'prob': '75'},
  {'name': 'East Lothian', 'prob': '14'},
  {'name': 'East Renfrewshire', 'prob': '34'},
  {'name': 'Edinburgh', 'prob': '39'},
  {'name': 'Eilean Siar', 'prob': '57'},
  {'name': 'Falkirk', 'prob': '61'},
  {'name': 'Fife', 'prob': '33'},
  {'name': 'Glasgow', 'prob': '21'},
  {'name': 'Highland', 'prob': '75'},
  {'name': 'Inverclyde', 'prob': '90'},
  {'name': 'Midlothian', 'prob': '68'},
  {'name': 'Moray', 'prob': '63'},
  {'name': 'North Ayshire', 'prob': '65'},
  {'name': 'North Lanarkshire', 'prob': '17'},
  {'name': 'Orkney Islands', 'prob': '96'},
  {'name': 'Perthshire and Kinross', 'prob': '35'},
  {'name': 'Renfrewshire', 'prob': '52'},
  {'name': 'Scottish Borders', 'prob': '91'},
  {'name': 'Shetland Islands', 'prob': '9'},
  {'name': 'South Ayrshire', 'prob': '59'},
  {'name': 'South Lanarkshire', 'prob': '22'},
  {'name': 'Stirling', 'prob': '69'},
  {'name': 'West Dunbartonshire', 'prob': '92'},
  {'name': 'West Lothian', 'prob': '21'},
  {'name': 'Anglesey', 'prob': '70'},
  {'name': 'Blaenau Gwent', 'prob': '27'},
  {'name': 'Bridgend', 'prob': '63'},
  {'name': 'Caerphilly', 'prob': '20'},
  {'name': 'Cardiff', 'prob': '96'},
  {'name': 'Carmarthenshire', 'prob': '65'},
  {'name': 'Ceredigion', 'prob': '15'},
  {'name': 'Conwy', 'prob': '77'},
  {'name': 'Denbighshire', 'prob': '89'},
  {'name': 'Flintshire', 'prob': '101'},
  {'name': 'Gwynedd', 'prob': '78'},
  {'name': 'Merthyr Tydfil', 'prob': '87'},
  {'name': 'Monmouthshire', 'prob': '54'},
  {'name': 'Neath Port Talbot', 'prob': '73'},
  {'name': 'Newport', 'prob': '62'},
  {'name': 'Pembrokeshire', 'prob': '14'},
  {'name': 'Powys', 'prob': '38'},
  {'name': 'Rhondda, Cynon, Taff', 'prob': '39'},
  {'name': 'Swansea', 'prob': '47'},
  {'name': 'Torfaen', 'prob': '101'},
  {'name': 'Vale of Glamorgan', 'prob': '23'},
  {'name': 'Wrexham', 'prob': '31'}
  ];

  console.log(probdata)