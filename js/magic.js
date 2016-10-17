var geo = {
  local: {
    longitude: "",
    latitude: "",
    positionFound: false
  },
  location: (function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        geo.local.longitude = position.coords.longitude;
        geo.local.latitude = position.coords.latitude;
        geo.local.positionFound = true;
      });
    }
  })()
};

function initMap() {
  var userLocation = {
  lat: geo.local.latitude,
  lng: geo.local.longitude
};
var map = new google.maps.Map(document.getElementById('map'), {
    zoom:17,
    center: userLocation
  });
var marker = new google.maps.Marker({
  position: userLocation,
  map: map
});
var infowindow = new google.maps.InfoWindow({
  content: "hello world"
});
marker.addListener('click', function() {
  infowindow.open(map, marker);
});

};

console.log(geo.local.longitude);
console.log(geo.local.latitude);

setTimeout(function() {
  initMap();
}, 5000);
