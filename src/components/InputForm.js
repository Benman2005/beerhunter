import React, { PureComponent } from "react";

class InputForm extends PureComponent {
  state = {
    postcode: ""
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.postcode);
  };
  handleChange = event => {
    this.setState({ postcode: event.target.value });
  };
  
  render() {
    return (
      <div id="inputContainer">
        <form onSubmit={this.handleSubmit} id="form">
          <label>Postcode: </label>
          <input
            id="inputPostcode"
            placeholder="bv: 1072LB"
            onChange={this.handleChange}
            name="postcode"
            value={this.state.postcode || ""}
            // required
          />
          <button type="submit">
            search beer
          </button>
        </form>
      </div>
    );
  }
}

export default InputForm;
