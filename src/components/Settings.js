import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';


const Settings = props => {
  const { show, close, changeHandler, value } = props;
  console.log('props', props)
  return (
    // <Modal
    //   {...props}
    //   size="lg"
    //   aria-labelledby="contained-modal-title-vcenter"
    //   centered
    // >
      <Modal
      isOpen={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      toggle={close}
    >
      <ModalHeader id="contained-modal-title-vcenter" closeButton>
          Modal heading
      </ModalHeader>
      <ModalBody>
        <h4>Centered Modal</h4>
        <Input name="canvaswidth" placeholder="with a placeholder" onChange={changeHandler} value={value} />
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.toggleSettings}>Close</Button>
      </ModalFooter>
      </Modal>

  )
}

export default Settings
