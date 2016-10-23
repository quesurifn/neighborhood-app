var viewModel = function() {
  var self = this;
  self.food = ko.observable(food);
  self.queryL = ko.observable("");
  self.typeL = ko.observable("");
  self.typeOfFood = ko.observable();


  var map;
  var service;
  var infowindow;
  var results = [];

  var food = {
    mexican: "mexican food",
    pizza: "italian food",
    venue: {
      keyword: "restaurant"
    }
  };

  var cafe = {
    venue: "cafe",
    keyword: "coffee"
  };

  var geo = {
    local: {
      longitude: "",
      latitude: "",
      positionFound: false
    }
  };

  self.geo.location = function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          geo.local.longitude = position.coords.longitude;
          geo.local.latitude = position.coords.latitude;
          geo.local.positionFound = true;
        });
      }
  }();

  self.typeOfFood.subscribe(function(newValue){
    switch(newValue){
      case "mexican":
      self.queryL(self.food().mexican);
      self.typeL(self.food().venue.keyword);
      self.initMap();
      break;
    case "pizza":
      self.queryL(self.food().pizza);
      self.typeL(self.food().venue.keyword);
      self.initMap();
      break;
    case "coffee":
      self.queryL(self.cafe().keyword);
      self.typeL(self.cafe().venue);
      self.initMap();
      break;
    }
  });

  self.initMap = function(){
  var userLocation = new google.maps.LatLng(geo.local.latitude, geo.local.longitude);
  console.log(geo.local.latitude);
  console.log(geo.local.longitude);


  map = new google.maps.Map(document.getElementById('map'), {
    center: userLocation,
    zoom: 11
  });

    var request = {
    location: userLocation,
    bounds: map.getBounds(),
    query: self.queryL(),
    type: self.typeL(),
    openNow: true

  };
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
  };

     self.callback = function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }

    self.createMarker = function(place) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("<div><strong>" + place.name + "</strong><br>" + place.formatted_address + "<br>" + place.rating );
        infowindow.open(map, this);
      });
    }
  };
  }
