import React from 'react'
import './addLeaveBtn.css';
import { Button, Form, Modal } from 'react-bootstrap';

class AddLeaveModal extends React.Component {

  constructor() {
    super();
    this.state = {
      show: false
    }
  }

  handleModal() {
    this.setState({
      show: !this.state.show
    })
  }

  render() {
    return (
      <div>
        <Button className='floating-btn' onClick={() => { this.handleModal() }}>&#10010;</Button>
        <Modal show={this.state.show} onHide={() => { this.handleModal() }}>
          <Modal.Header>
            Add leave
            <Button className="btn btn-default add-leave" onClick={() => { this.handleModal() }}>&times;</Button>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="addLeaveForm">
                <Form.Control name="empName" type="text" placeholder="Employee Name" />
                <br />
                <Form.Control type="date" name="startDate" placeholder='Start Date' />
                <br />
                <Form.Control type="date" name="endDate" placeholder='End Date' />
                <br />
                <Form.Control type="text" placeholder="Description" />
              </Form.Group>
              <Button className="btn btn-default submitBtn" type="submit" id="addLeaveBtn" onClick={() => { alert('Submitted!') }}>
                Add
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}


export default AddLeaveModal
