import React from 'react';
import '../../CSS/addLeaveBtn.css';
import { Button, Form, Modal } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { isWithinInterval, addDays } from 'date-fns';

class AddLeaveModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      startDate: '',
      employee_id: null,
      endDate: '',
      endDateToggle: true
    }

    this.handleModal = this.handleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.tileToDisable = this.tileToDisable.bind(this);

  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  handleModal() {
    this.setState({
      show: !this.state.show
    })
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    console.log('employee id: ' + this.state.employee_id + '  start date:' + this.state.startDate + ' end date:' + this.state.endDate);
    const result = await fetch("http://localhost:5000/addLeave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    });
    const data = await result.json();
    console.log(data);
    this.setState({ show: false });
    this.props.refresh();
    //console.log(this.props);
  }

  tileToDisable(date) {
    var flag = false;
    this.props.leaves.forEach(ele => {
      if (isWithinInterval(date.date, { start: new Date(ele.start_date), end: addDays(new Date(ele.start_date), ele.count - 1) }))
        flag = true;
    });
    return flag;
  }

  render() {
    return (
      <div>
        <Button className='floating-btn' onClick={() => { this.handleModal() }}>
          &#10010;
        </Button>
        <Modal className='LeaveModal' show={this.state.show} onHide={() => { this.handleModal() }}>
          <Modal.Header>
            Add Leave To Track Risk
            <Button className="btn btn-default add-leave" 
            onClick={() => { this.handleModal() }}>&times;</Button>
          </Modal.Header>
          <Modal.Body>
            <Form className='leave-form' onSubmit={this.handleSubmit}>
              <Form.Group controlId="addLeaveForm">
                {/* <Form.Label>Employee ID</Form.Label> */}
                <Form.Control name="employee_id" type="text" 
                onChange={this.handleChange} placeholder='Employee ID' />
                <br />
                <div className='datePicker'>
                  <Form.Label>Start Date</Form.Label>
                  <br />
                  <DatePicker name='startdate' className="start-date" 
                  value={this.state.startDate} onChange={value => this.setState({ startDate: value, endDateToggle: false })} 
                  minDate={new Date()} tileDisabled={this.tileToDisable} 
                    format='d/MM/y'
                  />
                  <br /><br />
                  <Form.Label>End Date</Form.Label>
                  <br />
                  <DatePicker name='enddate' className="end-date" 
                  value={this.state.endDate} onChange={value => this.setState({ endDate: value })} 
                  minDate={addDays(new Date(this.state.startDate),1)} tileDisabled={this.tileToDisable} 
                  format='d/MM/y' disabled={this.state.endDateToggle}
                  />
                  <br /><br />
                </div>
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
