var mymap;
var postcode;
var distance;
var marker;

$(document).ready(function() {
  distance = 1;
  postcode = 'E1 6PL';
  $('#km').val(distance);
  $('#postcode').val(postcode);
  
  getMapFromPostcodeAndDistance(postcode, 1);

  $('.button').click(function() {
    getMapFromPostcodeAndDistance($('#postcode').val(), $('#km').val());
  });

  piechart();
});

function initMap(lat, long, dist) {
  mymap = L.map('mapid').setView([lat, long], 15);

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGxmcmQiLCJhIjoiY2lyZzR0dms1MDAwd2o3bTU4OWM4bG5sbiJ9.GtEjgTigzfBM-2J9x2Gf0w', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
  }).addTo(mymap);

  marker = L.marker([lat, long]).addTo(mymap);
  marker.bindPopup("Unboxed");

  displayChargePoints(mymap, lat, long, dist);
}

function displayChargePoints(mymap, latMid, longMid, maxDist) {
  return $.getJSON("json/chargepoints.json")
  .done(function (data) {
    var count = 0;
    var onstreet_count = 0;
    var chargepoints = data.ChargeDevice;
    var chargecircles = [];
    var connectors_list = [];
    $.each(chargepoints, function (index, item) {
      var lat = item.ChargeDeviceLocation.Latitude;
      var long = item.ChargeDeviceLocation.Longitude;
      var dist = getDistanceFromLatLonInKm(latMid,longMid,lat,long);
      if (dist < maxDist) {
        count++;
        var circle = L.circle([lat, long], 30, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5
        }).addTo(mymap);
        chargecircles.push(circle);
        circle.bindPopup(item.ChargeDeviceName + "<br/>" + item.LocationType);
        if (item.LocationType == "On-street" || item.OnStreetFlag) {
          onstreet_count++;
        }
        var connectors = item.Connector;
        $.each(connectors, function(index, item) {
          connectors_list.push(item);
        });
      }
    });
    var connectors_string = [];
    $.each(connectors_list, function(item) {
      var line = '';
      line += connectors_list[item].ConnectorType;
      connectors_string.push(line);
    });
    var counts = {};
    connectors_string.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    var counts_arr = []
    $.each(counts, function (type, count) {
      counts_arr.push([type, count]);
    });
    piechart(counts_arr);
    chargecircles.push(marker);
    var group = new L.featureGroup(chargecircles);
    mymap.fitBounds(group.getBounds());
    $('.info__count').html(count + ' chargepoints');
    $('.onstreet').html(onstreet_count + ' on-street chargepoints');
  });
};


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getMapFromPostcodeAndDistance(postcode, distance) {
  return $.getJSON("http://api.postcodes.io/postcodes/" + postcode)
  .done(function (data) {
    var lat = data.result.latitude;
    var long = data.result.longitude; 

    if (mymap) {
      mymap.remove();    
    }
    initMap(lat, long, distance);
  });
}
