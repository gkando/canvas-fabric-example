import React from 'react';
import ReactDOM from 'react-dom';
import { fabric } from 'fabric';
import { SketchPicker } from 'react-color';
import FontPicker from 'font-picker-react';
import Popup from 'reactjs-popup'
import { getOffset, saveCanvasState } from './Helpers'
import { Row, Col, Container, Collapse } from "reactstrap";

class Toolbar extends React.Component {

    state = {
        value: '6',
        opacityval: '1',
        strokeval: '1',
        blurval: '1',
        glowcolor: '',
        offsetX: '1',
        offsetY: '1',
        activeFontFamily: "Open Sans",
        savestateaction: true,
        displayColorPicker: false,
        displaystrokeColorPicker: false,
        displayglowColorPicker: false,
        collapse: false,
        glowcollapse: false,
        styles: {
            position: 'absolute',
            display: 'none',
        },
    };
    componentDidMount() {}
    componentWillReceiveProps = (newprops) => {
        var canvas = this.props.state.canvas;
        if (canvas) {
            var activeObject = canvas.getActiveObject();
            var left = getOffset('main-canvas').left;
            var top = getOffset('main-canvas').top;
            if (activeObject) {
                this.setState({
                    styles: {
                        top: activeObject.top + top - 50,
                        left: activeObject.left + left + activeObject.width * activeObject.scaleX / 2 + 10,
                        position: 'fixed',
                        display: 'block',
                        zIndex: 1000
                    }
                })
            }
            else {
                this.setState({
                    styles: {
                        display: 'none',
                    }
                })
            }
        }
    }
    setStyle = (styleName, value, o) => {
        if (o.setSelectionStyles && o.isEditing) {
            var style = {};
            style[styleName] = value;
            o.setSelectionStyles(style);
        }
        else {
            o.set(styleName, value);
        }
        o.setCoords();
    }
    setActiveStyle = (styleName, value) => {
        var canvas = this.props.state.canvas;
        var activeObject = canvas.getActiveObject();
        var self = this;
        if (!activeObject) return;
        if (activeObject.type === 'activeSelection') {
            activeObject.forEachObject(function(o) {                

                if(o.paths && o.paths.length > 0) {
                    for (var i = 0; i < o.paths.length; i++) {
                        var co = o.paths[i];
                        self.setStyle(styleName, value, co);
                    }
                }

                self.setStyle(styleName, value, o);
            });
        }
        else {
            if(activeObject.paths && activeObject.paths.length > 0) {
                for (var i = 0; i < activeObject.paths.length; i++) {
                    var o = activeObject.paths[i];
                    self.setStyle(styleName, value, o);
                }
            }
            self.setStyle(styleName, value, activeObject);
        }
        canvas.renderAll();
        saveCanvasState(canvas);
    }    
    setTextFont = (fontfamily) => {
        this.setState({
          activeFontFamily: fontfamily
        })
        this.setActiveStyle('fontFamily', fontfamily);
    }
    setTextBold = () => {
        var fontBoldValue = (this.props.state.fontBoldValue === "normal") ? "bold" : "normal";
        this.setActiveStyle('fontWeight', fontBoldValue);
        this.props.state.fontBoldValue = fontBoldValue;
    }
    setTextItalic = () => {
        var fontItalicValue = (this.props.state.fontItalicValue === "normal") ? "italic" : "normal";
        this.setActiveStyle('fontStyle', fontItalicValue);
        this.props.state.fontItalicValue = fontItalicValue;
    }
    setTextUnderline = () => {
        var fontUnderlineValue = !this.props.state.fontUnderlineValue ? "underline" : false;
        this.setActiveStyle('underline', fontUnderlineValue);
        this.props.state.fontUnderlineValue = fontUnderlineValue;
    }    
    setActiveProp = (name, value) => {
        var canvas = this.props.state.canvas;
        var activeObject = canvas.getActiveObject();
        if(!activeObject) return;
        if (activeObject.type === 'activeSelection') {
            activeObject.forEachObject(function(object) {
                object.set(name, value).setCoords();
            });
        }
        else if (activeObject) {
            activeObject.set(name, value).setCoords();
        }
        canvas.renderAll();
        saveCanvasState(canvas);
    }
    alignObjectLeft = (value) => {
        this.setActiveProp('textAlign', 'left');
    }
    alignObjectCenter = () => {
        this.setActiveProp('textAlign', 'center');
    }
    alignObjectRight = () => {
        this.setActiveProp('textAlign', 'right');
    }
    clearCanvas = () => {
        var canvas = this.props.state.canvas;
        canvas.clear();
    }
    deleteItem = () => {
        var canvas = this.props.state.canvas;
        var activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        if (activeObject.type === 'activeSelection') {
            activeObject.forEachObject(function(object) {
                canvas.remove(object);
            });
        }
        else {
            canvas.remove(activeObject);
        }
    }
    setColor = (color) => {
        this.changeObjectColor(color.hex);
        ReactDOM.findDOMNode(this.refs.textcolor).style.background = color.hex;
    };
    pickerOpen = () => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        })
    };
    pickerClose = () => {
        this.setState({
            displayColorPicker: false
        })
    };
    strokepickerOpen = () => {
        this.setState({
            displaystrokeColorPicker: !this.state.displaystrokeColorPicker
        })
    };
    strokepickerClose = () => {
        this.setState({
            displaystrokeColorPicker: false
        })
    };
    glowpickerOpen = () => {
        this.setState({
            displayglowColorPicker: !this.state.displayglowColorPicker
        })
    };
    glowpickerClose = () => {
        this.setState({
            displayglowColorPicker: false
        })
    };
    setStroke = (color) => {
        this.setActiveStyle('stroke', color.hex);
        ReactDOM.findDOMNode(this.refs.textstrokecol).style.background = color.hex;
    };
    changeObjectColor = (hex) => {
        this.setActiveStyle('fill', hex);
    }
    fontSize = (event) => {
        this.setState({
            value: event.target.value
        });
        this.setActiveStyle('fontSize', event.target.value);
    }
    clone = () => {
        var canvas = this.props.state.canvas;
        var activeObject = canvas.getActiveObject();
        if(!activeObject) return false;
        if (activeObject.type === 'activeSelection') {
            activeObject.forEachObject((object) => {
                this.cloneSelObject(object);
            });
        }
        else {
            this.cloneSelObject(activeObject);
        }
    }
    cloneSelObject = (actobj) => {
        var canvas = this.props.state.canvas;
        canvas.discardActiveObject();
        if (fabric.util.getKlass(actobj.type).async) {
            var clone = fabric.util.object.clone(actobj);
            clone.set({
                left: actobj.left + 50,
                top: actobj.top + 50
            });
            canvas.add(clone);
            saveCanvasState(canvas);
        }
        else {
            var clones = fabric.util.object.clone(actobj);
            canvas.add(clones.set({
                left: actobj.left + 50,
                top: actobj.top + 50
            }));
            saveCanvasState(canvas);
        }
        canvas.requestRenderAll();
    }
    setOpacity = (event) => {
        this.setState({
            opacityval: event.target.value
        });
        this.setActiveStyle('opacity', event.target.value / 100);
    }
     setStrokeval = (event) => {
       console.log(event.target.value);
        this.setState({
            strokeval: event.target.value
        });
        this.setActiveStyle('strokeWidth', event.target.value * 1);
    }
     outlinetoggle = () => {
    this.setState({
            collapse: !this.state.collapse
        })
  }
  setGlow = (color) => {
       ReactDOM.findDOMNode(this.refs.textglowcol).style.background = color.hex;
        this.setState({
            glowcolor:  color.hex
        });
       var canvas = this.props.state.canvas;
       var activeObject = canvas.getActiveObject();
       activeObject.setShadow({
         color: color.hex,
         blur: 1,
         offsetX: 1,
         offsetY: 1
          
      });
       canvas.renderAll();
              
    }
    setglowblur = (event) => {
        this.setState({
            blurval: event.target.value
        });
         var canvas = this.props.state.canvas;
         var activeObject = canvas.getActiveObject();
         activeObject.setShadow({
         blur: event.target.value,
         color: this.state.glowcolor,
         offsetX: this.state.offsetX,
         offsetY: this.state.offsetY,
          
      });
       canvas.renderAll();
    }
     setglowoffsetX = (event) => {
        this.setState({
            offsetX: event.target.value
        });
         var canvas = this.props.state.canvas;
         var activeObject = canvas.getActiveObject();
         activeObject.setShadow({
         blur: this.state.blurval,
         color: this.state.glowcolor,
         offsetX: event.target.value,
         offsetY: ''
          
      });
       canvas.renderAll();
    }
     setglowoffsetY = (event) => {
        this.setState({
            offsetY: event.target.value
        });
         var canvas = this.props.state.canvas;
         var activeObject = canvas.getActiveObject();
         activeObject.setShadow({
         blur: this.state.blurval,
         color: this.state.glowcolor,
         offsetX: this.state.offsetX,
         offsetY: event.target.value

          
      });
       canvas.renderAll();
    }
   glowtoggle = () => {
        this.setState({
            glowcollapse: !this.state.glowcollapse
        })
    }
    bringForward = () => 
    {
      var canvas = this.props.state.canvas;
      var activeObject = canvas.getActiveObject();
      var grpobjs = canvas.getActiveObjects();
        if (grpobjs) {
            grpobjs.forEach((object) => {
                canvas.bringForward(object);
                canvas.renderAll();
                saveCanvasState(canvas);
            });
        } else {
            canvas.bringForward(activeObject);
            canvas.renderAll();
            saveCanvasState(canvas);
    
        }
    }
    sendBackward = () =>
    {
      var canvas = this.props.state.canvas;
      var activeObject = canvas.getActiveObject();
      var grpobjs = canvas.getActiveObjects();
        if (grpobjs) {
            grpobjs.forEach((object) => {
                canvas.sendBackwards(object);
                canvas.renderAll();
                 saveCanvasState(canvas);
            });
        } else {
            canvas.sendBackwards(activeObject);
            canvas.renderAll();
            saveCanvasState(canvas);
        }
    }


    render() {
        const popover = {
            position: 'absolute',
            zIndex: '2',
            top: '65px',
            left: '400px',
        }
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
        const strokepopover = {
            position: 'absolute',
            zIndex: '2',
            top: '150px',
            left: '250px',
        }
        const strokecover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
         const glowpopover = {
            position: 'absolute',
            zIndex: '2',
            top: '150px',
            left: '250px',
        }
        const glowcover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
        
        return (

        <Container>
           <Row className="iconbar">
              <Col xs="10">
              <a title="Font Family">
                 <div>
                    <FontPicker
                       apiKey="AIzaSyCOyeDUsAnL-jnWudXBKNNma9cXmXsT4tM"
                       activeFontFamily={this.state.activeFontFamily}
                       limit="150"
                       onChange={nextFont =>
                    this.setTextFont(nextFont.family)
                    }
                    />
                 </div>
              </a>
              <a title="Font Size" className="fontsize">
                 <div className="select-container">
                    <span className="select-arrow fa fa-chevron-down"></span>
                    <select onChange={this.fontSize} value={this.state.value}>
                       <option>6</option>
                       <option>8</option>
                       <option>10</option>
                       <option>12</option>
                       <option>14</option>
                       <option>16</option>
                       <option>18</option>
                       <option>21</option>
                       <option>24</option>
                       <option>28</option>
                       <option>32</option>
                       <option>36</option>
                       <option>42</option>
                       <option>48</option>
                       <option>56</option>
                       <option>64</option>
                       <option>72</option>
                       <option>80</option>
                       <option>88</option>
                       <option>96</option>
                       <option>104</option>
                       <option>120</option>
                       <option>144</option>
                    </select>
                 </div>
              </a>
              <a>
                 <div className="colrsec" onClick={this.pickerOpen}>
                    <div ref="textcolor" className="primcol">
                    </div>
                    <div className="seccol">
                       <img className="arrowimg" src={require('../images/down-arrow.png')} alt="" />
                    </div>
                 </div>
              </a>
              { 
              this.state.displayColorPicker ? 
              <div style={ popover }>
              <div style={ cover } onClick={ this.pickerClose }/>
                 <SketchPicker color={ this.state.background } onChangeComplete={ this.setColor }/>
              </div>
              : null 
              } 
              <a title="Bold" onClick={this.setTextBold}>
              <img className="arrow" src={require('../images/bold.png')} alt="" />
              </a>
              <a title="Italic" onClick={this.setTextItalic}>
              <img className="arrow" src={require('../images/italic.png')} alt="" />
              </a>
              <a title="Underline" onClick={this.setTextUnderline}>
              <img className="arrow" src={require('../images/underline.png')} alt="" />
              </a>
              <a title="Left" onClick={this.alignObjectLeft}>
              <img className="arrow" src={require('../images/align-to-left.png')} alt="" />
              </a>
              <a title="Center" onClick={this.alignObjectCenter}>
              <img className="arrow" src={require('../images/center-paragraph.png')} alt="" />
              </a>
              <a title="Right" onClick={this.alignObjectRight}>
              <img className="arrow" src={require('../images/align-to-right.png')} alt="" />
              </a>
               <a title="Send Back" onClick={this.sendBackward}>
              <img className="arrow" src={require('../images/send-backward.svg')} alt="" />
              </a>
               <a title="Bring Forward" onClick={this.bringForward}>
              <img className="arrow" src={require('../images/bring-forward.svg')} alt="" />
              </a>
              <a title="Effects">
                 <Popup className="popupcontent"
                 trigger={
                 <p className="dubliopt">Effects</p>
                 }
                 position="bottom left"
                 closeOnDocumentClick
                 >
                 <span>
                    <div className="effects">
                    <div className="opacity">Opacity</div>
                    <input type="range" className="slider opacityslider" max="100" min="0" step="5" onChange={this.setOpacity} value={this.state.opacityval} />100%
                    <hr />
                    <div className="effsection">
                       <div  className="opacity2">Outline</div>
                       <div  className="opacity3"> 
                          <input type="checkbox" id="switch" />
                          <label htmlFor="switch"  onClick={this.outlinetoggle}>Toggle</label>
                       </div>
                    </div>
                    <Collapse isOpen={this.state.collapse} className="strokesection">
                    <div className="effsection">
                       <div  className="opacity2">Color</div>
                       <div  className="opacity4">
                          <div className="opacity5" onClick={this.strokepickerOpen}>
                             <div ref="textstrokecol" className="primcol">
                             </div>
                             <div className="seccol">
                                <img className="arrowimg" src={require('../images/down-arrow.png')} alt="" />
                             </div>
                          </div>
                          { 
                          this.state.displaystrokeColorPicker ? 
                          <div style={ strokepopover }>
                             <div style={ strokecover } onClick={ this.strokepickerClose }/>
                                <SketchPicker color={ this.state.background } onChangeComplete={ this.setStroke }/>
                             </div>
                             : null 
                             } 
                          </div>
                       </div>
                    <div className="effsection">
                          <div  className="opacity2">Width</div>
                          <div  className="opacity3"> 
                             <input type="range" className="slider" max="5" min="1" step="1" onChange={this.setStrokeval} value={this.state.strokeval} />5%
                          </div>
                       </div>
                       </Collapse>
                    <hr className="bord" />
                    <div className="effsection glow">
                       <div  className="opacity2">Glow</div>
                       <div  className="opacity3"> 
                          <input type="checkbox" id="switch1" />
                          <label htmlFor="switch1" onClick={this.glowtoggle}>Toggle</label>
                       </div>
                    </div>
                    <Collapse isOpen={this.state.glowcollapse} className="glowsection">
                    <div className="effsection">
                       <div  className="opacity2">Color</div>
                       <div  className="opacity4">
                          <div className="opacity5" onClick={this.glowpickerOpen}>
                             <div ref="textglowcol" className="primcol">
                             </div>
                             <div className="seccol">
                                <img className="arrowimg" src={require('../images/down-arrow.png')} alt="" />
                             </div>
                          </div>
                          { 
                          this.state.displayglowColorPicker ? 
                          <div style={ glowpopover }>
                             <div style={ glowcover } onClick={ this.glowpickerClose }/>
                                <SketchPicker color={ this.state.background } onChangeComplete={ this.setGlow }/>
                             </div>
                             : null 
                             } 
                          </div>
                       </div>
                       <div className="effsection">
                          <div  className="opacity2">offsetX</div>
                          <div  className="opacity3"> 
                             <input type="range" className="slider" max="10" min="1" step="1" onChange={this.setglowoffsetX} value={this.state.offsetX} />10%
                          </div>
                       </div>
                        <div className="effsection">
                          <div  className="opacity2">offsetY</div>
                          <div  className="opacity3"> 
                             <input type="range" className="slider" max="10" min="1" step="1" onChange={this.setglowoffsetY} value={this.state.offsetY} />10%
                          </div>
                       </div>
                       <div className="effsection">
                          <div  className="opacity2">Blur</div>
                          <div  className="opacity3"> 
                             <input type="range" className="slider" max="10" min="1" step="1" onChange={this.setglowblur} value={this.state.blurval} />10%
                          </div>
                       </div>
                        </Collapse>
                    </div>
                 </span>
                 </Popup>                      
              </a>
              </Col>
              <Col xs="2">
              <a title="Delete" onClick={this.deleteItem} className="rightbar">
              <img className="arrow" src={require('../images/delete.png')} alt="" />
              </a>
              <a title="Duplicate" onClick={this.clone} className="rightbar">
                 <p className="dubliopt">Duplicate</p>
              </a>
              </Col>
           </Row>
        </Container>  
        );
    }
}

export default Toolbar;