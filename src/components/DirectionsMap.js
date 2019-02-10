import React, { PureComponent } from "react";
import home from "./home.png";
import {config} from '../config.js'

const key = config.googleMapsKey
const script =
  `https://maps.googleapis.com/maps/api/js?key=${key}`;

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

class DirectionsMap extends PureComponent {
  state = {
    directions: []
  };
  async componentDidMount() {
    await loadScript(script);
    this.calcRoute();
  }
  calcRoute = () => {
    var directionsDisplay = new window.google.maps.DirectionsRenderer();
    var directionsService = new window.google.maps.DirectionsService();
    var start = this.props.coords;
    var end = this.props.brouwerij.lat + "," + this.props.brouwerij.lng;
    var request = {
      origin: start,
      destination: end,
      travelMode: "DRIVING"
    };
    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        const directions = result.routes[0].legs[0].steps.map(
          step => step.instructions
        );
        this.setState({ directions });
        var bounds = new window.google.maps.LatLngBounds();
        const map = new window.google.maps.Map(
          document.getElementById("google-map"),
          {
            zoom: 14,
            center: { lat: 52.3679843, lng: 4.9035614 }
          }
        );
        directionsDisplay.setDirections(result);
        var path = window.google.maps.geometry.encoding.decodePath(
          result.routes[0].overview_polyline
        );
        var polyline = new window.google.maps.Polyline({
          path: path,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map
        });
        const markerHome = new window.google.maps.Marker({
          position: { lat: this.props.coords.lat, lng: this.props.coords.lng },
          map: map,
          icon: home,
          zIndex: 2
        });
        const markerDestination = new window.google.maps.Marker({
          position: { lat: this.props.brouwerij.lat, lng: this.props.brouwerij.lng },
          map: map,
          zIndex: 1,
        });
        markerHome.setMap(map)
        polyline.setMap(map);
        map.fitBounds(result.routes[0].bounds);
      }
    });
   
  };
  render() {
    return (
      <div>
        <div
          id="google-map"
          ref="map"
          style={{ height: "40vh", width: "100vw" }}
        />
        <div>
          {this.state.directions &&
            this.state.directions.map((direction, index) => {
              //direction steps are returned as html, so needs to be injected by dangerouslySetInnerHTML for React
              function createMarkup() {
                return { __html: index + 1 + `. ${direction}` };
              }
              return (
                <div dangerouslySetInnerHTML={createMarkup()} key={index} />
              );
            })}
        </div>
      </div>
    );
  }
}
export default DirectionsMap;
