import { Component } from "react";
import "./PopulardesignStyles.css";


class PopulardesignData extends Component {
  render() {
    return (
      <div className={this.props.classname}>
        
        <div className="des-text">
            <h2>{this.props.heading}</h2>
            <p>{this.props.text}</p>
        </div>

        <div className="image">
          <img src={this.props.img1} alt="img" />
          <img src={this.props.img2} alt="img" />
        </div>

      </div>
    );
  }
}

export default PopulardesignData;
