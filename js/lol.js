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

var map;
var info;
var service;

function initMap() {
  var userLocation = {
  lat: geo.local.latitude,
  lng: geo.local.longitude
};
    map = new google.maps.Map(document.getElementById('map'), {
    zoom:17,
    center: userLocation
  });
 infoWindow = new google.maps.InfoWindow();
 service = new google.maps.places.PlacesService(map);
};

console.log(geo.local.longitude);
console.log(geo.local.latitude);

setTimeout(function() {
  initMap();
}, 5000);

function performSearch() {
    var request = {
        keyword: 'wal' //KO Clicakble
    };
    service.radarSearch(request, callback);
}

function callback(results , status) {
    if ( status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
    }
    for (var i = 0, result; result = results[i]; i++){
        addMarker(result);
    }

}

function addMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        postition: place.geometry.location,
        icon: {
            url: 'http://maps.gstatic.com/mapfiles/circle.png',
            anchor: new google.maps.Point(10,10),
            scaledSize: new google.maps.Size(10,17)
        }

        });

    google.maps.event.addEventListener(marker, 'click', function() {
        service.getDetails(place, function(result, status) {
            if (status !== google.maps.place.PlacesServiceStatus.OK) {
                console.error(status);
                return;
            }
            infoWindow.setContent(result.name);
            infoWindow.open(map, marker);
        });
    });
}
  performSearch();
  addMarker();
