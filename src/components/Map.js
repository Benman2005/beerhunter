import React, { PureComponent } from "react";
import home from "./home.png";

const script =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCoPhuanwcuptxhdtQNL7Xn0Osr8uqq-zM";

//Google maps api needs to be injected into document to actually render a map
function loadScript(src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.src = src;
    script.addEventListener("load", function() {
      resolve();
    });
    script.addEventListener("error", function(e) {
      reject(e);
    });
    document.body.appendChild(script);
  });
}

class Map extends PureComponent {
  state = {
    brouwerijen: []
  };

  //takes input from homepage and looks for coordinates for home location, since google distance api doesn't return coordinates.
  getCityCoords = async city => {
    return fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyCoPhuanwcuptxhdtQNL7Xn0Osr8uqq-zM&address=${city}`
    )
      .then(res => res.json())
      .then(response => {
        if (response.status === "OK") {
          const { lat, lng } = response.results[0].geometry.location;
          return { lat, lng };
        } else
          this.setState({
            error: `sorry, we couldn't find coordinates for ${city}`
          });
      });
  };

  async componentDidMount() {
    this.props.location &&
      (await this.getCityCoords(this.props.location).then(res => {
        this.setState({
          latitude: res.lat,
          longitude: res.lng
        });
        this.props.setCoords(res.lat, res.lng);
      }));
    if (this.props.brouwerijen) {
      const breweries = this.props.brouwerijen.map(async brewery =>
        this.getCityCoords(brewery.address + " " + brewery.city).then(res => {
          brewery.lat = res.lat;
          brewery.lng = res.lng;
          return brewery;
        })
      );
      await Promise.all(breweries).then(res => {
        this.setState({ brouwerijen: res });
      });
    }
    await loadScript(script);
    this.initMap();
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      await this.getCityCoords(this.props.location).then(res => {
        this.setState({
          latitude: res.lat,
          longitude: res.lng
        });
        this.props.setCoords(res.lat, res.lng);
      });
      this.initMap();
    }
  }
  renderMarkers = (map, locations) => {
    //extending bounds (zooming out on map) to show all markers on map
    if (this.state.brouwerijen[0].lat) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(location => {
        const brewCoords = new window.google.maps.LatLng(
          location.lat,
          location.lng
        );
        const homeCoords = new window.google.maps.LatLng(
          this.state.latitude,
          this.state.longitude
        );
        bounds.extend(brewCoords);
        bounds.extend(homeCoords);
        map.fitBounds(bounds);
      });
    }
    //creating marker for each brewery
    this.state.brouwerijen &&
      locations.map(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          zIndex: 1,
          content: location.lat
        });
        const infoWindow = new window.google.maps.InfoWindow({
          content:
            "<p><b>" + location.name + "</b><br />" + location.address + "</p>",
          map: map
        });
        marker.addListener("mouseover", () => {
          infoWindow.open(map, marker);
          marker.setOptions({ zIndex: 10 });
        });
        marker.addListener("mouseout", () => {
          infoWindow.close(map, marker);
          marker.setOptions({ zIndex: 1 });
        });
        return marker;
      });
  };
  //this initiates the google map
  initMap = () => {
    const map = new window.google.maps.Map(
      document.getElementById("google-map"),
      {
        zoom: 14,
        center: { lat: this.state.latitude, lng: this.state.longitude }
      }
    );
    // putting home marker on it
    const marker = new window.google.maps.Marker({
      position: { lat: this.state.latitude, lng: this.state.longitude },
      map: map,
      icon: home,
      zIndex: 2
    });
    this.renderMarkers(map, this.state.brouwerijen);
  };
  render() {
    return (
      <div
        id="google-map"
        ref="map"
        style={{ zIndex: "0", height: "40vh", width: "100vw" }}
      />
    );
  }
}
export default Map;
