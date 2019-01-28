import React, { PureComponent } from "react";
import InputForm from "./InputForm";
import brouwerijen from "../JSON-files/brouwerijen";
import Map from "./Map";
import { Link } from "react-router-dom";

const addresses = brouwerijen.breweries
  .map(brouwerij => brouwerij.address + " " + brouwerij.city)
  .join("|");
class LandingPage extends PureComponent {
  state = {
    error: null,
    brouwerijen: null
  };
  huntBeer = async postcode => {
    await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${postcode}&destinations=${addresses}&key=AIzaSyCoPhuanwcuptxhdtQNL7Xn0Osr8uqq-zM`
    )
      .then(res => res.json())
      .then(response => {
        console.log(response);
        if (
          response.status === "OK" &&
          (!response.origin_addresses[0] ||
            !response.rows[0].elements[0].distance)
        ) {
          this.setState({
            error: `Sorry.. no address found at "${postcode}"`,
            brouwerijen: null
          });
        } else if (response.status === "OK") {
          const bieren = [...brouwerijen.breweries];
          const elements = response.rows[0].elements;
          for (let i = 0; i < elements.length; i++) {
            bieren[i].distance = (elements[i].distance.value / 1000).toFixed(2);
            bieren[i].duration = elements[i].duration.text;
            bieren[i].durationInSeconds = elements[i].duration.value;
          }
          this.setState({
            error: null,
            brouwerijen: bieren.sort((a, b) => {
              return a.durationInSeconds - b.durationInSeconds;
            })
          });
        } else
          this.setState({
            error: `sorry, no beer found`
          });
      });
  };

  renderBrouwerij = brouwerij => {
    return (
      <div key={brouwerij.name} className="singleResult">
        <h3>{brouwerij.name}</h3>
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
        </div>
      </div>
    );
  };
  render() {
    const { error, brouwerijen } = this.state;
    console.log(this.state);
    return (
      <React.Fragment>
        <div className="header">
          <h1>The Beer Hunter</h1>
        </div>
        <InputForm onSubmit={this.huntBeer} />
        {/* <Map /> */}
        {/* <Link to="/map">
          <p>Go To Map</p>
        </Link> */}
        <div className="resultsContainer">
          <div className="results">
            {error && <p className="error">{error}</p>}
            {brouwerijen &&
              brouwerijen.map(brouwerij => this.renderBrouwerij(brouwerij))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default LandingPage;
