import React, { Component } from "react";
import PropTypes from "prop-types";

export default class FontPicker extends Component {
  constructor(props) {
    super(props);

    // Bind component methods to this context
    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onOptionClick = this.onOptionClick.bind(this);
    this.onRipple = this.onRipple.bind(this);

    this.state = {
      isOptionsVisible: false,
      selectedFont: this.props.value
    };
  }

  componentDidMount() {
    // Check if stylesheet already exists
    for (var i = 0; i < document.styleSheets.length; i++) {
      var styleSheet = document.styleSheets[i];
      var cssRules = styleSheet.rules ? styleSheet.rules : styleSheet.cssRules;

      if (typeof cssRule !== "undefined" && cssRule !== null) {
        for (var j = 0; j < cssRules.length; ++j) {
          if (cssRules[j].selectorText === ".ReactFontPicker") return;
        }
      }
    }

    // Create stylesheet on the fly
    var styles = document.createElement("style");

    styles.innerHTML = `
			.ReactFontPicker_Wrapper {
				position: relative;
				width: 100%;
				height: 30px;
				border-bottom: 1px solid #ddd;
			}
			.ReactFontPicker_Wrapper:hover {
				cursor: pointer;
			}
			.ReactFontPicker_Label {
				position: absolute;
				bottom: 8px;
				font-size: 15px;
				color: #a0a0a0;
			}
			.ReactFontPicker_LabelFloat {
				position: absolute;
				font-size: 11px;
				bottom: 27px;
				color: #888;
				-webkit-transition: .2s all ease-in-out;
				-moz-transition: .2s all ease-in-out;
				-ms-transition: .2s all ease-in-out;
				-o-transition: .2s all ease-in-out;
				transition: .2s all ease-in-out;
			}
			.ReactFontPicker_SelectedOption {
				position: absolute;
				height: 25px;
				line-height: 35px;
				font-size: 15px;
			}
			.ReactFontPicker_Button {
				position: absolute;
				right: 5px;
				top: 12px;
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 5px 6px 0 6px;
				border-color: #dddddd transparent transparent transparent;
			}
			.ReactFontPicker_Button:hover {
				cursor: pointer;
			}
			.ReactFontPicker_Options {
				position: absolute;
				top: -7.5px;
				width: 100%;
				height: auto;
				max-height: 200px;
				overflow-y: scroll;
				padding-bottom: 15px;
				padding-top: 15px;
				float: left;
				background-color: #fff;
				box-shadow: 0px 0px 6px #ddd;
				z-index: 999;
				-webkit-transition: .15s all ease-in-out;
				-moz-transition: .15s all ease-in-out;
				-ms-transition: .15s all ease-in-out;
				-o-transition: .15s all ease-in-out;
				transition: .15s all ease-in-out;
			}
			.ReactFontPicker_OptionsHidden {
				position: absolute;
				top: -7.5px;
				width: 100%;
				height: 0px;
				padding-bottom: 0;
				padding-top: 0;
				background-color: #fff;
				overflow: hidden;
				box-shadow: 0px 0px 6px #ddd;
				-webkit-transition: .15s all ease-in-out;
				-moz-transition: .15s all ease-in-out;
				-ms-transition: .15s all ease-in-out;
				-o-transition: .15s all ease-in-out;
				transition: .15s all ease-in-out;
			}
			.ReactFontPicker_Option {
				display: block;
				width: calc(100% - 20px);
				padding-left: 10px;
				padding-right: 10px;
				height: 30px;
				line-height: 30px;
				float: left;
				-webkit-transition: .1s all ease-in-out;
				-moz-transition: .1s all ease-in-out;
				-ms-transition: .1s all ease-in-out;
				-o-transition: .1s all ease-in-out;
				transition: .1s all ease-in-out;
			}
			.ReactFontPicker_Option:hover {
				background-color: #eee;
			}
			div.ReactFontPicker_Wrapper .ripple {
				position: relative;
				overflow: hidden;
			}
			div.ReactFontPicker_Wrapper .ripple-effect{
				position: absolute;
				border-radius: 50%;
				width: 50px;
				height: 50px;
				background: white;
				animation: ripple-animation 1.8s;
			}
			@keyframes ripple-animation {
				from {
					transform: scale(1);
					opacity: 0.4;
				}
				to {
					transform: scale(100);
					opacity: 0;
				}
			}
			.ReactFontPicker {
				display: block;
			}
		`;
    document.getElementsByTagName("head")[0].appendChild(styles);
  }

  onWrapperClick() {
    this.setState({ isOptionsVisible: !this.state.isOptionsVisible });
  }

  onOptionClick(e, font) {
    e.stopPropagation();

    if (this.state.isOptionsVisible == false) return;

    if (typeof this.props.onChange == "function") this.props.onChange(font);

    this.setState({ isOptionsVisible: false, selectedFont: font });
  }

  onRipple(e) {
    // Material UI ripple effect
    // e.preventDefault();
    e.stopPropagation();

    let target = e.target;

    var div = document.createElement("div"),
      targetOffset = target.getBoundingClientRect(),
      xPos = e.pageX - targetOffset.left,
      yPos = e.pageY - targetOffset.top;

    div.classList.add("ripple-effect");
    div.style.top = parseInt(yPos - targetOffset.height / 2) + "px";
    div.style.left = parseInt(xPos - targetOffset.height) + "px";

    target.appendChild(div);

    setTimeout(function() {
      target.removeChild(div);
    }, 500);
  }

  render() {
    const { label, fonts, previews, activeColor } = this.props;

    // Get select font (value) from props or local state if props not given
    const value = this.props.value || this.state.selectedFont;

    return (
      <div className="ReactFontPicker">
        {/* Wrapper */}
        <div className="ReactFontPicker_Wrapper" onClick={this.onWrapperClick}>
          {/* Floating label text */}
          <div
            className={
              value === ""
                ? "ReactFontPicker_Label"
                : "ReactFontPicker_LabelFloat"
            }
          >
            {label}
          </div>

          {/* Selected option */}
          <div className="ReactFontPicker_SelectedOption">{value}</div>

          {/* Downdown button */}
          <div className="ReactFontPicker_Button" />

          {/* Options list */}
          <div
            className={
              this.state.isOptionsVisible
                ? "ReactFontPicker_Options"
                : "ReactFontPicker_OptionsHidden"
            }
          >
            {fonts.map((n, i) => {
              var style = {};

              if (value == n) style.color = activeColor;

              if (previews) style.fontFamily = n;

              return (
                <div
                  className="ReactFontPicker_Option ripple"
                  style={style}
                  key={i}
                  onMouseDown={e => this.onRipple(e)}
                  onMouseUp={e => this.onOptionClick(e, n)}
                  onClick={e => this.onOptionClick(e, n)}
                >
                  {n}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

FontPicker.propTypes = {
  fonts: PropTypes.array,
  label: PropTypes.string,
  previews: PropTypes.bool,
  activeColor: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

FontPicker.defaultProps = {
  label: "",
  previews: true,
  fonts: [
    "Arial",
    "Arial Narrow",
    "Arial Black",
    "Courier New",
    "Georgia",
    "Lucida Console",
    "Lucida Sans Unicode",
    "Tahoma",
    "Times New Roman",
    "Verdana"
  ],
  activeColor: "#64B5F6",
  value: "",
  onChange: function(font) {
    console.log("FontPicker: " + font);
  }
};
