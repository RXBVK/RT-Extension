import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { TextInput, EntryCard } from '@contentful/forma-36-react-components';
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
      value: props.sdk.field.getValue() || '',
      imgSrc: "",
      top: "",
      left: "",
      coords: props.sdk.field.getValue() || ''
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    this.getImage;

    const image = this.props.sdk.entry.fields.image;
    const locales = this.props.sdk.locales.available[0];
    const imageID = image.getValue().sys.id;
    const asset = this.props.sdk.space.getAsset(imageID).then((response) => this.setState({ imgSrc: response.fields.file[locales].url }));
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


  handleCoords = (e) => {
    this.setState({
      top: `${Math.round(e.nativeEvent.offsetY * 100 / e.target.height)}%`,
      left: `${Math.round(e.nativeEvent.offsetX * 100 / e.target.width)}%`
    })
    this.props.sdk.field.setValue(this.state.top + 'x' + this.state.left);
  }

  render() {
    return (
      <div className="point-editor-wrap">
        <div id="image-container">
          {this.state.imgSrc ? <img src={this.state.imgSrc} onClick={this.handleCoords} /> : "Chosen image will be displayed here."}
        </div>
        <TextInput type="text" width="medium" value={this.props.sdk.field.getValue() || "Click on image to set coordinates."} disabled />
      </div>
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
