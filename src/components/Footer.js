import React from 'react';
import { Row, Col, Container } from "reactstrap";
import { initCenteringGuidelines } from './Helpers'


class Footer extends React.Component {

    state = {
      savestateaction: true,
      canvasScale: 1,
      SCALE_FACTOR: 1.2,
    };
    componentDidMount() {
      this.initKeyboardEvents();
    }
    undo = () => {
      var canvas = this.props.canvas;
      canvas.stateaction = false;
      var index = canvas.index;
      var state = canvas.state;
      if (index > 0) {
        index -= 1;
        this.removeObjects();
        canvas.loadFromJSON(state[index], function() {
          canvas.renderAll();
          canvas.stateaction = true;
          canvas.index = index;
        });
      }
      else {
        canvas.stateaction = true;
      }
    }
    redo = () => {
      var canvas = this.props.canvas;
      var index = canvas.index;
      var state = canvas.state;
      console.log(index);
      canvas.stateaction = false;
      if (index < state.length - 1) {
        this.removeObjects();
        canvas.loadFromJSON(state[index + 1], function() {
          canvas.renderAll();
          canvas.stateaction = true;
          index += 1;
          canvas.index = index;
        });
      }
      else {
        canvas.stateaction = true;
      }
    }
    removeObjects = () => {
      var canvas = this.props.canvas;
      var activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      if (activeObject.type === 'activeSelection') {
        activeObject.forEachObject((object) => {
          canvas.remove(object);
        });
      }
      else {
        canvas.remove(activeObject);
      }
    }
    zoomIn = () => {
      var canvas = this.props.canvas;

this.setState({canvasScale: this.state.canvasScale * this.state.SCALE_FACTOR}, function () {
    console.log(this.state.canvasScale);
});

      canvas.setHeight(canvas.getHeight() * this.state.SCALE_FACTOR);
      canvas.setWidth(canvas.getWidth() * this.state.SCALE_FACTOR);
      var objects = canvas.getObjects();
      for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
        var tempScaleX = scaleX * this.state.SCALE_FACTOR;
        var tempScaleY = scaleY * this.state.SCALE_FACTOR;
        var tempLeft = left * this.state.SCALE_FACTOR;
        var tempTop = top * this.state.SCALE_FACTOR;
        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;
        objects[i].setCoords();
      }
      canvas.renderAll();
      initCenteringGuidelines(canvas);
    }
    // Zoom Out
    zoomOut = () => {
      var canvas = this.props.canvas;
      this.setState({
        canvasScale: this.state.canvasScale / this.state.SCALE_FACTOR
      });
      canvas.setHeight(canvas.getHeight() * (1 / this.state.SCALE_FACTOR));
      canvas.setWidth(canvas.getWidth() * (1 / this.state.SCALE_FACTOR));
      var objects = canvas.getObjects();
      for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
        var tempScaleX = scaleX * (1 / this.state.SCALE_FACTOR);
        var tempScaleY = scaleY * (1 / this.state.SCALE_FACTOR);
        var tempLeft = left * (1 / this.state.SCALE_FACTOR);
        var tempTop = top * (1 / this.state.SCALE_FACTOR);
        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;
        objects[i].setCoords();
      }
      canvas.renderAll();
      initCenteringGuidelines(canvas);
    }
    resetState = () => {
      var canvas = this.props.canvas;
      canvas.state = [];
      canvas.index = 0;
    }
    zoomToPercent = (event) => {
      var canvas = this.props.canvas;
      var percentage = Number(event.target.value) / 100;
      canvas.setHeight(canvas.getHeight() * (percentage / this.state.canvasScale));
      canvas.setWidth(canvas.getWidth() * (percentage / this.state.canvasScale));
      var objects = canvas.getObjects();
      for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
        var tempScaleX = scaleX * (percentage / this.state.canvasScale);
        var tempScaleY = scaleY * (percentage / this.state.canvasScale);
        var tempLeft = left * (percentage / this.state.canvasScale);
        var tempTop = top * (percentage / this.state.canvasScale);
        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;
        objects[i].setCoords();
      } 
      this.setState({
        canvasScale: percentage
      });
      canvas.renderAll();
    }
    removeObject = () => {
      var canvas = this.props.canvas;
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
    grpungrpItems() {
      var canvas = this.props.canvas;
      var actObj = canvas.getActiveObject();
      if (!actObj) {
        return false;
      }
      if (actObj.type === 'group') {
        actObj.toActiveSelection();
      } else if (actObj.type === 'activeSelection') {
        actObj.toGroup();
      }
      canvas.renderAll();
    }
    initKeyboardEvents = () => {
      let self = this;
      document.onkeyup = function(e) {
        e.preventDefault(); // Let's stop this event.
        e.stopPropagation(); // Really this time.
        if (e.which === 46) {
          self.removeObject();
        }
        if (e.ctrlKey && e.which === 90) {
          self.undo();
        }
        if (e.ctrlKey && e.which === 89) {
          self.redo();
        }
        if (e.which === 71) {
          //group / ungroup items
          self.grpungrpItems();
        }
      };
    }    

    render() {
        
        return (
            <Container className="footer">
              <Row>
                <Col xs={this.props.footercolsize}>
                  <div title="Undo" className="undoicon" onClick={this.undo}>
                      <div className="first">
                          <img className="undo" src={require('../images/undo.png')} alt="" />
                      </div>
                      <div className="second">
                         Undo
                      </div>
                  </div>
                  <div className="divider">|
                  </div>
                  <div title="Redo"  className="redoicon" onClick={this.redo}>
                       <div className="first">
                          <img className="redo" src={require('../images/redo.png')} alt="" />
                      </div>
                      <div className="second">
                         Redo
                      </div>
                  </div>
                </Col>
                <Col xs="3">
                  <div className="canvassize">
                  { 
                    this.props.canvas ? 
                    <span>{parseInt(this.props.canvas.width, 10)} x {parseInt(this.props.canvas.height, 10)} px</span>
                    : 
                    <span>640 x 360 px</span>
                  }
                  </div>
                </Col>
                <Col xs={this.props.footercolsize}>
                  <div className="plus" title="Zoom In" onClick = {this.zoomIn}>+
                  </div>
                  <div className="zoomval">
                    <div className="select-container">
                      <span className="select-arrow fa fa-chevron-down"></span>
                      <select className="zoom" onChange={this.zoomToPercent} value={this.state.canvasScale * 100}>
                        <option value="25">25%</option>
                        <option value="50">50%</option>
                        <option value="75">75%</option>
                        <option value="100">100%</option>
                      </select>
                    </div>
                  </div>
                  <div className="minus" title="Zoom Out" onClick = {this.zoomOut}>-
                  </div>
                </Col>
              </Row>
            </Container>
        
        );
    }
}

export default Footer;