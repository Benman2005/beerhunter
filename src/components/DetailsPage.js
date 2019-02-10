import React, { PureComponent } from "react";
import bieren from "../JSON-files/bieren";
import DirectionsMap from './DirectionsMap';
import {Redirect } from 'react-router-dom'

export default class DetailsPage extends PureComponent {
  render() {
    if(!this.props.location.state)return<Redirect to="/" />
    const {brouwerij, coords} = this.props.location.state;
    const beers = bieren.beers.filter(beer=>beer.brewery===brouwerij.name)
    console.log(beers)
    return (
      <div className="details">
        <h1>{brouwerij.name}</h1>
        <p>
          {brouwerij.distance}km - {brouwerij.duration}
        </p>
        <p>{brouwerij.address}</p>
        <p>{brouwerij.city}</p>
        <div>
          <p>Beers: {beers.map(beer=>{return beer.name +', ' })} </p>
        </div>
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
