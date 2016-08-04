$(document).ready(function() {
	var mymap = L.map('mapid').setView([51.521130, -0.077916], 15);

	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGxmcmQiLCJhIjoiY2lyZzR0dms1MDAwd2o3bTU4OWM4bG5sbiJ9.GtEjgTigzfBM-2J9x2Gf0w', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	}).addTo(mymap);

	var marker = L.marker([51.521130, -0.077916]).addTo(mymap);
  marker.bindPopup("Unboxed");

  displayChargePoints(mymap);
});

var lat1 = 51.521130;
var long1 = -0.077916;

function displayChargePoints(mymap) {
  return $.getJSON("json/chargepoints.json")
  .done(function (data) {
    var chargepoints = data.ChargeDevice;
    $.each(chargepoints, function (index, item) {
      var lat = item.ChargeDeviceLocation.Latitude;
      var long = item.ChargeDeviceLocation.Longitude;
      var dist = getDistanceFromLatLonInKm(lat1,long1,lat,long);
      if (dist < 1) {
        var circle = L.circle([lat, long], 30, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5
        }).addTo(mymap);
        circle.bindPopup(item.ChargeDeviceName);
      }
    });
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
