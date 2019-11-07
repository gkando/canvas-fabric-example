import React from 'react';
import { fabric } from 'fabric';
import { SketchPicker } from 'react-color';
import { Row, Col, Container, Form, Input } from "reactstrap";
import { TabPanel } from 'react-web-tabs';
import { client } from 'filestack-react';
import FontPicker from 'font-picker-react';
import Popup from 'reactjs-popup'
import { unique, saveCanvasState } from './Helpers'
import { Draggable } from 'react-drag-and-drop';
//import $ from 'jquery';

class LeftPanel extends React.Component {

  state = {
    displaybgColorPicker: false,
    displaygrad1ColorPicker: false,
    displaygrad2ColorPicker: false,
    canvasScale: 1,
    SCALE_FACTOR: 1.2,
    bgcolArray: [],
    backgroundcolor: '',
    grad1color: 'black',
    grad2color: 'black',
    apiImg:[],
    page: 1,
    searchkey: 'sport',
    displayColorPicker: false,
    activeFontFamily: "Open Sans",
  };
  componentDidMount() {
    var bgcolArray = localStorage.getItem("bgcolors");
    if (bgcolArray) {
      bgcolArray = JSON.parse(bgcolArray);
      this.setState({
        bgcolArray: bgcolArray
      });
    }
    this.pixaybay();
    this.refs.iScroll.addEventListener("scroll", () => {
      if (
        this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=
        this.refs.iScroll.scrollHeight
      ) {
      this.incerment();
      }
    });
  }
  addShape = () => {
    var canvas = this.props.canvas;
    const circle = new fabric.Circle({
      radius: 50,
      left: 10,
      top: 10,
      strokeWidth: '',
      stroke: '',
      fill: '#ff5722'
    });
    canvas.add(circle);
    canvas.renderAll();
  }
  addHeadingtxt = () => {
    var canvas = this.props.canvas;
    var text = new fabric.Textbox('Add Heading', {
      fontFamily: 'arial',
      left: 100,
      top: 100,
      type: 'text',
      fontSize: 36,
      width: 250,
    });
    canvas.add(text);
    canvas.renderAll();
  }
  addSubheadingtxt = () => {
    var canvas = this.props.canvas;
    var text = new fabric.Textbox('Add Subheading', {
      fontFamily: 'arial',
      left: 100,
      top: 100,
      ttype: 'text',
      fontSize: 24,
      width: 200,
    });
    canvas.add(text);
    canvas.renderAll();
  }
  addText = () => {
    console.log('add text')
    var canvas = this.props.canvas;
    var text = new fabric.Textbox('Add text', {
      fontFamily: 'arial',
      left: 100,
      top: 100,
      type: 'text',
      fontSize: 18,
      width: 200,
      fill: 'pink'
    });
    canvas.add(text);
    canvas.renderAll();
  }
  getItemType = () => {
    var canvas = this.props.canvas;
    var activeObject = canvas.getActiveObject();
    console.log('active', activeObject)
}
// setTextColor = () => {
//     var canvas = this.props.canvas;
//     var activeObject = canvas.getActiveObject();
//     console.log('active', activeObject)
//     if (!activeObject) return;
//     if (activeObject.type === 'text') {
//       console.log('ITEM IS TEXT')
//       activeObject.set({fill: 'blue'})
//       saveCanvasState(canvas);
//     }
//     else {
//         return
//     }
// }

// TEXT TOOLS

setTextFont = (fontfamily) => {
  this.setState({
    activeFontFamily: fontfamily
  })
  this.setActiveStyle('fontFamily', fontfamily);
}
setTextBold = () => {
  var fontBoldValue = (this.state.fontBoldValue === "normal") ? "bold" : "normal";
  this.setActiveStyle('fontWeight', fontBoldValue);
  this.state.fontBoldValue = fontBoldValue;
}
setTextItalic = () => {
  var fontItalicValue = (this.state.fontItalicValue === "normal") ? "italic" : "normal";
  this.setActiveStyle('fontStyle', fontItalicValue);
  this.state.fontItalicValue = fontItalicValue;
}
setTextUnderline = () => {
  var fontUnderlineValue = !this.props.state.fontUnderlineValue ? "underline" : false;
  this.setActiveStyle('underline', fontUnderlineValue);
  this.state.fontUnderlineValue = fontUnderlineValue;
}   
setTextColor = (color) => {
  var canvas = this.props.canvas;
  var activeObject = canvas.getActiveObject();
  activeObject.set('fill', color.hex);
  canvas.renderAll();
}

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

  deleteCanvasBg = () => {
    var canvas = this.props.canvas;
    canvas.backgroundColor = '';
    canvas.renderAll();
    //if (!lcanvas) lcanvas = canvas;
    var objects = canvas.getObjects().filter(function(o) {
      return o.bg === true;
    });
    for (var i = 0; i < objects.length; i++) {
      canvas.remove(objects[i]);
    }
    canvas.bgsrc = "";
    canvas.bgcolor = "";
  }
  setCanvasFill = (bgcolor) => {
    var canvas = this.props.canvas;
    this.deleteCanvasBg();
    canvas.backgroundColor = bgcolor.hex;
    canvas.renderAll();
    this.setState({
      backgroundColor: bgcolor.hex
    });
    saveCanvasState(canvas);
  }
  dynamicBGcolors = (bgcol) => {
    var bgcolArray = this.state.bgcolArray;
    bgcolArray.push(bgcol);
    bgcolArray = unique(bgcolArray);
    console.log(bgcolArray);
    this.setState({
      bgcolArray: bgcolArray
    });
    this.setState({
      backgroundcolor: bgcol
    });
    localStorage.setItem('bgcolors', JSON.stringify(bgcolArray));
  }
  showUploadPopup = () => {
    const options = {
      accept: 'image/*',
      //fromSources: ['local_file_system'],
      maxSize: 1024 * 1024,
      maxFiles: 1,
      onFileUploadFinished: this.setcanvasBG
    }
    const filestack = client.init('A3wr3EiC8RUKJhe0FwIGfz', options);
    const picker = filestack.picker(options);
    picker.open();
  }
  uploadIcon = () => {
    const options = {
      accept: 'image/svg+xml',
      //fromSources: ['local_file_system'],
      maxSize: 1024 * 1024,
      maxFiles: 1,
      onFileUploadFinished: this.addSVG
    }
    const filestack = client.init('A3wr3EiC8RUKJhe0FwIGfz', options);
    const picker = filestack.picker(options);
    picker.open();
  }
  handleUploadError = (e) => {
    console.log(e);
  }
  addSVG = (result) => {
    var canvas = this.props.canvas;
    var svg = result;
    fabric.loadSVGFromURL(svg, (objects) => {
      var loadedObject = fabric.util.groupSVGElements(objects);
        loadedObject.set({
          scaleX: 1,
          scaleY: 1,
          opacity: 1
        });
          loadedObject.src = svg;
          canvas.add(loadedObject);
          loadedObject.scaleToWidth(200);
          loadedObject.hasRotatingPoint = true;
          saveCanvasState(canvas);
          canvas.renderAll();
      });
    }
  setcanvasBG = (result) => {
    var canvas = this.props.canvas;
    var bgsrc = result;
    if (result && result.url) bgsrc = result.url;
    if (bgsrc) {
      this.deleteCanvasBg();
      fabric.Image.fromURL(bgsrc, (bg) => {
        var canvasAspect = canvas.width / canvas.height;
        var imgAspect = bg.width / bg.height;
        var scaleFactor;
        if (canvasAspect >= imgAspect) {
          scaleFactor = canvas.width / bg.width * 1;
        }
        else {
          scaleFactor = canvas.height / bg.height * 1;
        }
        bg.set({
          originX: 'center',
          originY: 'center',
          opacity: 1,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          hasCorners: false,
          left: canvas.width / 2,
          top: canvas.height / 2,
          scaleX: scaleFactor,
          scaleY: scaleFactor,
          strokeWidth: 0
        });
        canvas.add(bg);
        canvas.sendToBack(bg);
        bg.bg = true;
        canvas.bgsrc = bgsrc;
        saveCanvasState(canvas);
      });
    }
  }
  grad1colorOpen = () => {
    this.setState({
      displaygrad1ColorPicker: !this.state.displaygrad1ColorPicker
    })
  };
  grad1colorClose = () => {
    this.setState({
      displaygrad1ColorPicker: false
    })
    this.dynamicBGcolors(this.state.backgroundColor);
    this.setGradientBGcolor(this.state.grad1color, this.state.grad2color, 'vertical');
  };
  grad2colorOpen = () => {
    this.setState({
      displaygrad2ColorPicker: !this.state.displaygrad2ColorPicker
    })
  };
  grad2colorClose = () => {
    this.setState({
      displaygrad2ColorPicker: false
    })
    this.setGradientBGcolor(this.state.grad1color, this.state.grad2color, 'vertical');
  };
  bgcolorOpen = () => {
    this.setState({
      displaybgColorPicker: !this.state.displaybgColorPicker
    })
  };
  bgcolorClose = () => {
    this.setState({
      displaybgColorPicker: false
    })
    this.dynamicBGcolors(this.state.backgroundColor);
  };
  setVerticalgradient = (color) => {
    this.setGradientBGcolor(this.state.grad1color, this.state.grad2color, 'vertical');
  }
  setRadialgradient = (color) => {
    this.setGradientBGcolor(this.state.grad1color, this.state.grad2color, 'radial');
  }
  setGradient1BGcolor = (color) => {
    this.setState({
      grad1color: color.hex
    });
  }
  setGradient2BGcolor = (color) => {
    this.setState({
      grad2color: color.hex
    });
  }
  setGradientBGcolor = (colone, coltwo, type) => {
    if (!colone || !coltwo) return;
    this.deleteCanvasBg();
    var canvas = this.props.canvas;
    if (type === 'vertical') {
      var verticalgrad = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0,
          y1: canvas.height / 4,
          x2: 0,
          y2: canvas.height / 2 + canvas.height / 4,
        },
        colorStops: [{
          color: colone,
          offset: 0,
        }, {
          color: coltwo,
          offset: 1,
        }]
      });
      canvas.backgroundColor = verticalgrad;
      canvas.renderAll();
    }
    if (type === 'radial') {
      var radialgrad = new fabric.Gradient({
        type: 'radial',
        coords: {
          r1: canvas.width / 2,
          r2: canvas.width / 4,
          x1: (canvas.width / 2) - 1,
          y1: (canvas.height / 2) - 1,
          x2: canvas.width / 2,
          y2: canvas.height / 2,
        },
        colorStops: [{
          color: colone,
          offset: 0,
        }, {
          color: coltwo,
          offset: 1,
        }]
      });
      canvas.backgroundColor = radialgrad;
      canvas.renderAll();
    }
    if (type === 'horizontal') {
      var horizontalgrad = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: canvas.width / 4,
          y1: 0,
          x2: canvas.width / 2 + canvas.width / 4,
          y2: 0,
        },
        colorStops: [{
          color: colone,
          offset: 0,
        }, {
          color: coltwo,
          offset: 1,
        }]
      });
      canvas.backgroundColor = horizontalgrad;
      canvas.renderAll();
    }
    saveCanvasState(canvas);
  }
  setBGcolor = (color) => {
    this.deleteCanvasBg();
    var canvas = this.props.canvas;
    canvas.backgroundColor = color;
    canvas.renderAll();
    this.setState({
      backgroundColor: color
    });
    saveCanvasState(canvas);
  }
  refreshCanvas = (canvas) => {
    canvas.renderAll(canvas);
    saveCanvasState(canvas);
  }
  applyBGPattern = (result) => {
    this.deleteCanvasBg();
    var canvas = this.props.canvas;
    canvas.setBackgroundColor({
      source: result
    }, this.refreshCanvas.bind(this, canvas));
  }
  pixaybay = () =>
  {
    fetch("https://pixabay.com/api/?key=11095386-871fd43c33a92700d9bffb82d&q="+this.state.searchkey+"&image_type=photo&pretty=true&page="+this.state.page+"&per_page=24&safesearch=true")
    .then(res => res.json())
    .then(
       (result) => {
            this.setState({
                apiImg: result.hits
            });
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error
            });
        }
    )
  }
  addImage = (result) =>
  {
        var canvas = this.props.canvas;
        fabric.Image.fromURL(result, (image) => {
            image.set({
                left: 100,
                top: 100,
                padding: 10,
                cornersize: 10,
                scaleX: 1,
                scaleY: 1
            });
            canvas.add(image);
            image.scaleToWidth(200);
            saveCanvasState(canvas);
            
        },{
          crossOrigin: 'anonymous'
        });
  }
  searchImage = (e) =>
  {
    if (e.key === 'Enter') {
      e.preventDefault(); // Let's stop this event.
      e.stopPropagation(); // Really this time.
      this.setState({
        searchkey: e.target.value
      },() => {
        this.pixaybay();
      });
    }
  }
  incerment = () =>
  {
    this.setState({
        page: this.state.page + 1
    },() => {
        this.pixaybay();
    });
  }
  render() {
      const styles = {
        grad1color: {
          width: '36px',
          height: '36px',
          padding: '5px',
          borderRadius: '2px',
          background: `${ this.state.grad1color }`,
        },
        grad2color: {
          width: '36px',
          height: '36px',
          padding: '5px',
          borderRadius: '2px',
          background: `${ this.state.grad2color }`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      };
      return (
       <div className="leftpanelcontent">
        
        <TabPanel tabId="vertical-tab-two">
          <Container className="text-editer">
            <Row>
              <Col>                              
                <p className="btn btn-primary" onClick = {this.showUploadPopup}>Upload BG</p>
              </Col>
              <Col>
                <p className="btn btn-primary" onClick = {this.deleteCanvasBg}>Remove BG</p>
              </Col>
            </Row>
            <Row>
              <Col>
               <div className="solid-colors">
               <p>Solid Colors</p>
               <span className="solidcol1 solidcolor" onClick={() => this.setBGcolor('#d0021b')}></span>
               <span className="solidcol2 solidcolor" onClick={() => this.setBGcolor('#f5a623')}></span>
               <span className="solidcol3 solidcolor" onClick={() => this.setBGcolor('#f8e71c')}></span>
               <span className="solidcol4 solidcolor" onClick={() => this.setBGcolor('#8b572a')}></span> 
               <span className="solidcol5 solidcolor" onClick={() => this.setBGcolor('#b8e986')}></span> 
               <span className="solidcol6 solidcolor" onClick={() => this.setBGcolor('#417505')}></span> 
               <span className="solidcol7 solidcolor" onClick={() => this.setBGcolor('#bd10e0')}></span> 
               <span className="solidcol8 solidcolor" onClick={() => this.setBGcolor('#4a90e2')}></span> 
               <span className="solidcol9 solidcolor" onClick={() => this.setBGcolor('#50e3ca')}></span> 
               <span className="solidcol10 solidcolor" onClick={() => this.setBGcolor('#000000')}></span> 
               <span className="solidcol11 solidcolor" onClick={() => this.setBGcolor('#ffffff')}></span>
               {this.state.bgcolArray.map((colorval, index) => {
               return (
               <span key={index} style={{background: colorval}} className="solidcolor" onClick={() => this.setBGcolor(colorval)}></span>
               )
               })}
               <span className="addcolor solidcolor"  onClick={ this.bgcolorOpen }>+</span>
               { this.state.displaybgColorPicker ? 
               <div style={ styles.popover }>
                  <div style={ styles.cover } onClick={ this.bgcolorClose }/>
                     <SketchPicker color={ this.state.backgroundColor } onChangeComplete={ this.setCanvasFill }/>
                  </div>
                  : null 
                  }
               </div>
              </Col>
            </Row>
            <Row>
              <Col>                  
               <div className="gradients-colors">
                 <p>Gradients</p>
                 <span className="grdcol1 grdcolor" onClick={() => this.setGradientBGcolor('#62ff00','yellow','vertical')}></span>
                 <span className="grdcol2 grdcolor" onClick={() => this.setGradientBGcolor('red','yellow','horizontal')}></span> 
                 <span className="grdcol3 grdcolor" onClick={() => this.setGradientBGcolor('#ff9900','#39d4cd','horizontal')}></span>
                 <span className="grdcol4 grdcolor" onClick={() => this.setGradientBGcolor('rgba(255,0,0,0)','rgba(255,0,0,1)','horizontal')}></span>
                 <span className="grdcol1 grdcolor" onClick={() => this.setGradientBGcolor('#62ff00','yellow','vertical')}></span>          
                  <Popup trigger={<span className="addcolor grdcolor">+</span> } position="top right" closeOnDocumentClick>
                    <div className="gradcolorsection">
                    <div style={ styles.swatch } onClick={ this.grad1colorOpen }>
                    <div style={ styles.grad1color } />
                    </div>
                    { this.state.displaygrad1ColorPicker ? 
                    <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.grad1colorClose }/>
                    <SketchPicker color={ this.state.grad1color } onChangeComplete={ this.setGradient1BGcolor }/>
                    </div>
                    : null 
                    }
                    <div style={ styles.swatch } onClick={ this.grad2colorOpen }>
                    <div style={ styles.grad2color } />
                    </div>
                    { this.state.displaygrad2ColorPicker ? 
                    <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.grad2colorClose }/>
                      <SketchPicker color={ this.state.grad2color } onChangeComplete={ this.setGradient2BGcolor }/>
                    </div>
                    : null 
                    }
                    <div className="grdsection">
                      <div className="grdoptions">
                         <div className="verticalgradient" title="Vertical" onClick={ this.setVerticalgradient }>
                         </div>
                      </div>
                      <div className="grdoptions">
                         <div className="radialgradient" title="Radial" onClick={ this.setRadialgradient }>
                         </div>
                      </div>
                    </div>
                    </div>
                  </Popup>
                 </div>
              </Col>
            </Row>
            <Row>
              <Col>                  
                 <div className="patterns">
                    <p>Patterns</p>
                    <Draggable type="bgpattern" data={require('../images/img/pattern1.jpg')}><span className="pattern1" onClick={() => this.applyBGPattern(require('../images/img/pattern1.jpg'))}></span></Draggable>
                    <Draggable type="bgpattern" data={require('../images/img/pattern2.jpg')}><span className="pattern2" onClick={() => this.applyBGPattern(require('../images/img/pattern2.jpg'))}></span></Draggable>
                    <Draggable type="bgpattern" data={require('../images/img/pattern3.jpg')}><span className="pattern3" onClick={() => this.applyBGPattern(require('../images/img/pattern3.jpg'))}></span></Draggable>
                    <Draggable type="bgpattern" data={require('../images/img/pattern4.jpg')}><span className="pattern4" onClick={() => this.applyBGPattern(require('../images/img/pattern4.jpg'))}></span></Draggable>
                    <Draggable type="bgpattern" data={require('../images/img/pattern5.jpg')}><span className="pattern5" onClick={() => this.applyBGPattern(require('../images/img/pattern5.jpg'))}></span></Draggable>
                    <Draggable type="bgpattern" data={require('../images/img/pattern6.jpg')}><span className="pattern6" onClick={() => this.applyBGPattern(require('../images/img/pattern6.jpg'))}></span></Draggable>
                    <Draggable type="bgpattern" data={require('../images/img/pattern7.jpg')}><span className="pattern7" onClick={() => this.applyBGPattern(require('../images/img/pattern7.jpg'))}></span></Draggable>
                    <Draggable type="bgpattern" data={require('../images/img/pattern8.jpg')}><span className="pattern8" onClick={() => this.applyBGPattern(require('../images/img/pattern8.jpg'))}></span></Draggable>
                    <Draggable type="bgpattern" data={require('../images/img/pattern9.jpg')}><span className="pattern9" onClick={() => this.applyBGPattern(require('../images/img/pattern9.jpg'))}></span></Draggable>
                 </div>
              </Col>
            </Row>
          </Container>
        </TabPanel>
        <TabPanel tabId="vertical-tab-three">
          <Container className="text-editer">
            <Row>
              <Col>
                 <div className="pixabaysection">
                    <p>Images</p>
                     <Form>
                      <Input type="text" onKeyPress={(event) => this.searchImage(event)}  placeholder="Search Images" />
                     </Form>
                     <div ref="iScroll" className="scroller" id="scroll-1">
                     {
                        this.state.apiImg.map((img, index) => {
                         return (
                         <span key={index} onClick={() => this.addImage(img.largeImageURL)} ><Draggable type="image" data={img.largeImageURL}><img  className="pixabay" src={img.largeImageURL}  alt ="" /></Draggable></span> 
                         )
                       })
                     }
                     </div>
                 </div>
              </Col>
            </Row>
          </Container>
        </TabPanel>
        <TabPanel tabId="vertical-tab-four">
          <Container className="text-editer">
            <Row>
              <Col>
                 <div className="pixabaysection">
                    <p>Text</p>
                     <div ref="iScroll" className="scroller" id="scroll-1">
                     <span onClick={() => this.addText()} > Add </span>
                     <span onClick={this.pickerOpen} > Color </span>
                     </div>
                 </div>
              </Col>
            </Row>
          </Container>
        </TabPanel>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.pickerClose }/>
          <SketchPicker onChangeComplete={ this.setTextColor } />
        </div> : null }
       </div>
      );
    }
}

export default LeftPanel;