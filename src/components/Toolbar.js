import React from 'react';
import ReactDOM from 'react-dom';
import { fabric } from 'fabric';
//import { SketchPicker } from 'react-color';
//import FontPicker from 'font-picker-react';
//import Popup from 'reactjs-popup'
import { getOffset, saveCanvasState } from './Helpers'
//import { Row, Col, Container, Collapse } from "reactstrap";
import { Row, Col, Container} from "reactstrap";

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
        
        return (

        <Container>
           <Row className="iconbar">
              <Col xs="10">
             
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