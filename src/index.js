import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { TextInput } from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue() || ''
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {
    this.setState({ value });
  };

  onChange = e => {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  render() {
    return (
      <TextInput
        width="large"
        type="text"
        id="my-field"
        testId="my-field"
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: "",
      top: "",
      left: ""
    }
  }
  handleCoords = (e) => {
    this.setState({
      top: `${Math.round(e.nativeEvent.offsetY * 100 / e.target.height)}%`,
      left: `${Math.round(e.nativeEvent.offsetX * 100 / e.target.width)}%`
    })
  }
  render() {
    return (
      <div className="point-editor-wrap">
        <input type="file" accept="image/png, image/jpeg" id="image-input" value={this.state.value} onInput={(e) => { this.setState({ imgSrc: e.target.files[0].name }) }} />
        <div id="image-container">
          {this.state.imgSrc ? <img src={this.state.imgSrc} onClick={this.handleCoords} /> : "Choose an image"}
        </div>
        <TextInput type="text" width="medium" value={this.state.top || "Click on image to set Y."} disabled />
        <TextInput type="text" width="medium" value={this.state.left || "Click on image to set X."} disabled />
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
