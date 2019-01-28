import React, { PureComponent } from "react";

const script =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCoPhuanwcuptxhdtQNL7Xn0Osr8uqq-zM";

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
  getCityCoords = async city => {
    await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyCoPhuanwcuptxhdtQNL7Xn0Osr8uqq-zM&address=${city}`
      )
      .then(res => res.json())
      .then(response => {
        console.log(response);
        if (response.status === "OK") {
          const { lat, lng } = response.results[0].geometry.location;
          this.setState({
            latitude:lat,
            longitude:lng,
            error: null
          });
        } else
        this.setState({
          error: `sorry, we couldn't find coordinates for ${city}`
        });
      });
    };
    async componentDidMount() {
      await this.getCityCoords("amsterdam");
      await loadScript(script);
      this.initMap();
    }
    initMap = () => {
      // 'google' could be accessed from 'window' object
      console.log(window);
      const map = new window.google.maps.Map(
        document.getElementById("google-map"),
        {
          zoom: 14,
          center: { lat: this.state.latitude, lng: this.state.longitude }
        }
        );
    // putting a marker on it
    const marker = new window.google.maps.Marker({
      position: { lat: this.state.latitude, lng: this.state.longitude },
      map: map
    });
  };
  render() {
    // this.initMap()
    return (
      <div
        id="google-map"
        ref="map"
        style={{ height: "40vh", width: "100vw" }}
      />
    );
  }
}
export default Map;
