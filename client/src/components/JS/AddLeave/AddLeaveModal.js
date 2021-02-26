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
      endDate: '',
      endDateToggle: true
    }

    this.handleModal = this.handleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.tileToDisable = this.tileToDisable.bind(this);

  }


  handleModal() {
    this.setState({
      show: !this.state.show
    })
  }

  async handleSubmit(event) {
    event.preventDefault();
    const body ={
      startDate:this.state.startDate,
      endDate:this.state.endDate,
      employee_id:this.props.emp_id};

    const result = await fetch("http://localhost:5000/addLeave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await result.json();
    this.setState({ show: false });
    this.props.refresh();
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
