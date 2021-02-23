import React from 'react'
import '../../CSS/addLeaveBtn.css';
import { Button, Form, Modal } from 'react-bootstrap';
import DatePickerHelper from './DatePickerHelper';

class AddLeaveModal extends React.Component {
  
  constructor() {
    super();
    this.state = {
      show: false,
      startDate: new Date()
    }
    console.log(this.state.startDate);
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
            Add Leave To Track Risk
            <Button className="btn btn-default add-leave" onClick={() => { this.handleModal() }}>&times;</Button>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="addLeaveForm">
                <Form.Control name="empName" type="text" placeholder="Employee ID" />
                <br />
                
                {/* <Form.Control type="date" onChange={() => {this.handleDate.bind(this)}} min={this.state.startDate} name="start-date" />
                <br />
                <Form.Control type="date" name="endDate" /> */}
                
                <DatePickerHelper id='startState' className="start-date"/>
                <br />
                <DatePickerHelper id='endDate' className="end-date"/>

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
