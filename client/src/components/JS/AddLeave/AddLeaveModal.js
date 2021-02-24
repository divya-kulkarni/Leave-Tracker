import React, { useState } from 'react';
import '../../CSS/addLeaveBtn.css';
import { Button, Form, Modal } from 'react-bootstrap';
import DatePicker from 'react-date-picker';

function DatePickerHelper(props) {
  const [value, onChange] = useState(new Date());
  var today = new Date();

  console.log(props.minDate);

  return (
    <div>
      <DatePicker
        onChange = {onChange}
        format = 'dd-MM-yy'
        value = {value}
        minDate = {props.minDate}
      />
    </div>
  );
}

class AddLeaveModal extends React.Component {
  
  constructor() {
    super();
    this.state = {
      show: false,
      startDate: '',
      employee_id: null,
      endDate: ''
    }
    
    this.handleModal = this.handleModal.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    const name= event.target.name;
    this.setState({
      [name] : value
    });
  }

  handleModal() {
    this.setState({
      show: !this.state.show
    })
  }

//   async handleSubmit(event) {
//     event.preventDefault();
//     console.log(this.state);
//     console.log('employee id: ' + this.state.employee_id + '  start date:'+this.state.startDate + ' end date:'+this.state.endDate);
//     const result = await fetch("http://localhost:5000/addLeave",{
//         method:"POST",
//         headers:{ "Content-Type": "application/json" },
//         body:JSON.stringify(this.state)
//     });
//     const data=await result.json();
//     console.log(data);
    
//     alert(data.message);
// }

  render() {
    return (
      <div>
        <Button className='floating-btn' onClick={() => { this.handleModal() }}>&#10010;</Button>
        <Modal className='LeaveModal' show={this.state.show} onHide={() => { this.handleModal() }}>
          <Modal.Header>
            Add Leave To Track Risk
            <Button className="btn btn-default add-leave" onClick={() => { this.handleModal() }}>&times;</Button>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="addLeaveForm">
              <Form.Label>Employee ID</Form.Label>
                <Form.Control name="empName" type="text" onChange={this.handleChange}/>
                <br />
                <Form.Label>Start Date</Form.Label>
                <DatePickerHelper id='startDate' className="start-date" value={this.state.startDate} onChange={this.handleChange} minDate={new Date()} />
                <br />
                <Form.Label>End Date</Form.Label>
                <DatePickerHelper id='endDate' className="end-date" value={this.state.endDate} onChange={this.handleChange} minDate={new Date(this.state.startDate)}/>

              </Form.Group>
              <Button className="btn btn-default submitBtn" type="submit" id="addLeaveBtn">
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
