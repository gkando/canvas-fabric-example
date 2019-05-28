// File Imports
import React, { Component } from 'react';
import FabricCanvas from './components/FabricCanvas';
import { Row, Col, Container, Collapse } from "reactstrap";
import { Tabs, Tab, TabList } from 'react-web-tabs';
import Toolbar from './components/Toolbar';
import LeftPanel from './components/LeftPanel';
import Footer from './components/Footer';
import { fabric } from 'fabric';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      isSnap: false,
      isOverlap: false,
      isGrid: false,
      canvaswidth: 650,
      canvasheight: 375,
      defaultbg: require('./images/main-img.jpg'),
      fontBoldValue: 'normal',
      fontItalicValue: '',
      fontUnderlineValue: '',
      collapse: true,
      leftcolsize: 3,
      rightcolsize: 9,
      footercolsize: 3,
      toggleleft: "0px",
      gridsize: 30
    };
  }
  updateCanvas = (canvas) => {
    this.setState({
      canvas: canvas
    });
    this.setState({
      toggleleft: document.getElementsByClassName('tabpanel')[0].clientWidth + "px"
    });
  }
  updateState = (stateoptions) => {
    this.setState(stateoptions);
  }
  toggleSidebar = () => {
    this.setState(state => ({
      collapse: !state.collapse
    }));
    if (this.state.collapse) {
      this.setState({
        leftcolsize: 1,
        rightcolsize: 11,
        footercolsize: 4
      });
    }
    else {
      this.setState({
        leftcolsize: 3,
        rightcolsize: 9,
        footercolsize: 3
      });
    }
    var self = this;
    setTimeout(function() {
      self.setState({
        toggleleft: document.getElementsByClassName('tabpanel')[0].clientWidth + "px"
      });
    }, 5);
  }
  downloadAsPNG = () => {
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var fileName = month + '' + day + '' + year + '' + hours + '' + minutes + '' + seconds;
    const canvasdata = document.getElementById('main-canvas');
    const canvasDataUrl = canvasdata.toDataURL().replace(/^data:image\/[^;]*/, 'data:application/octet-stream'),
      link = document.createElement('a');
    fileName = fileName + ".png";
    link.setAttribute('href', canvasDataUrl);
    link.setAttribute('crossOrigin', 'anonymous');
    link.setAttribute('target', '_blank');
    link.setAttribute('download', fileName);
    if (document.createEvent) {
      var evtObj = document.createEvent('MouseEvents');
      evtObj.initEvent('click', true, true);
      link.dispatchEvent(evtObj);
    }
    else if (link.click) {
      link.click();
    }
  }
  downloadAsJSON = () => {
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var fileName = month + '' + day + '' + year + '' + hours + '' + minutes + '' + seconds;
    var canvasdata = this.state.canvas.toDatalessJSON();
    var string = JSON.stringify(canvasdata);
    var file = new Blob([string], {
      type: 'application/json'
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  setSnap = () => {
    this.setState({
      isSnap: !this.state.isSnap,
    });
    var offstate = document.querySelectorAll('#snapswitch');
    for (var j = 0; j < offstate.length; j++) {
      offstate[j].checked = this.state.isSnap;
    }
  }
  showhideGrid = () => {
    var isGrid = !this.state.isGrid;
    this.setState({
      isGrid: isGrid,
    });
    if (isGrid) {
      for (var i = 0; i < (650 / this.state.gridsize); i++) {
        this.state.canvas.add(new fabric.Line([i * this.state.gridsize, 0, i * this.state.gridsize, 650], {
          stroke: '#ccc',
          selectable: false
        }));
        this.state.canvas.add(new fabric.Line([0, i * this.state.gridsize, 650, i * this.state.gridsize], {
          stroke: '#ccc',
          selectable: false
        }))
      }
    }
    else {
      this.clearGrid();
    }
    var offstate = document.querySelectorAll('#gridswitch');
    for (var j = 0; j < offstate.length; j++) {
      offstate[j].checked = this.state.isGrid;
    }
    this.state.canvas.renderAll();
  }
  clearGrid = () => {
    var objects = this.state.canvas.getObjects('line');
    for (let i in objects) {
      this.state.canvas.remove(objects[i]);
    }
  }
  setOverlap = () => {
    this.setState({
      isOverlap: !this.state.isOverlap,
    });
    var offoverlap = document.querySelectorAll('#overlapswitch');
    for (var j = 0; j < offoverlap.length; j++) {
      offoverlap[j].checked = this.state.isOverlap;
    }
  }

  render() {
    
    return (

      <Container>
        <Row className="bottomborder">
          <Col xs="3">
            <nav className="navbar navbar-expand-lg header-bar">
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="{null}bs-example-navbar-collapse-1"> <span className="navbar-toggler-icon"></span> </button>
              
              <div className="left-link"><a href="{null}" className="nav-link">ReduxFabric Editor</a></div>
            </nav>
          </Col>
          <Col>          
            <nav className="navbar navbar-expand-lg header-bar">
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="navbar-nav ml-md-auto">
                  <li className="nav-item active download"> <a className="btn btn-primary headerbtn" >UNDO</a> </li>
                  <li className="nav-item active download"> <a className="btn btn-primary headerbtn" >REDO</a> </li> 
                  <li className="nav-item active download"> <a className="btn btn-primary headerbtn" >SETTINGS</a> </li>
                  <li className="nav-item active download"> <a className="btn btn-primary headerbtn" >LOGOUT</a> </li>                   
                  
                </ul>
              </div>
            </nav>
          </Col>
        </Row>
        <Row>
          <Col xs={this.state.leftcolsize} className="tabpanel">
            <Tabs defaultTab="vertical-tab-two" vertical className="vertical-tabs">
            <TabList>
            
            <Tab tabFor="vertical-tab-two" className="lasttab">
            <div className="edit-box1">
            <h1><img src={require('./images/icon-background.png')} alt="" /></h1>
            <span>BACKGROUND</span>
            </div>
            </Tab>
            <Tab tabFor="vertical-tab-three" className="lasttab">
            <div className="edit-box2">
            <h1><img src={require('./images/icon-picture.png')} alt="" /></h1>
            <span>IMAGES</span>
            </div>
            </Tab>
            
            </TabList>
            <Collapse isOpen={this.state.collapse}>
              <LeftPanel canvas={this.state.canvas} />
            </Collapse>
            
            </Tabs>   
          </Col>
          <Col xs={this.state.rightcolsize}>              
            <Row>
              <Col>
                <Toolbar state={this.state} />
              </Col>
            </Row>
            <Row>
              <Col>
                <FabricCanvas state={this.state} updateCanvas={this.updateCanvas} updateState={this.updateState} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={this.state.leftcolsize}></Col>
          <Col xs={this.state.rightcolsize}>           
            <Footer canvas={this.state.canvas} footercolsize={this.state.footercolsize} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;