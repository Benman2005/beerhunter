import React, { PureComponent } from "react";
// import brouwerijen from "../JSON-files/brouwerijen";
import DirectionsMap from './DirectionsMap';

export default class DetailsPage extends PureComponent {
  render() {
    const {brouwerij, coords} = this.props.location.state;
    return (
      <div className="details">
        <h1>{brouwerij.name}</h1>
        <p>
          {brouwerij.distance}km - {brouwerij.duration}
        </p>
        <p>{brouwerij.address}</p>
        <p>{brouwerij.city}</p>
        <div className="openingTimes">
          <p>
            Open:{" "}
            {brouwerij.open.map(day => {
              return day + ", ";
            })}
          </p>
          <DirectionsMap brouwerij={brouwerij} coords={coords}/>
        </div>
      </div>
    );
  }
}
