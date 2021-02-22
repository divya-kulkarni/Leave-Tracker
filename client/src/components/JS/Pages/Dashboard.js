import React from 'react';
import AddLeaveModal from '../AddLeave/AddLeaveModal';

function Dashboard() {
  return (
    <div className='dashboard'>
      <h3>Dashboard</h3>
      <div className='add-leave-btn'>
        <AddLeaveModal />
      </div>
    </div>
  );
}

export default Dashboard;