import React, { useState } from 'react';
import DatePicker from 'react-date-picker';

function DatePickerHelper() {
  const [value, onChange] = useState(new Date());
  var today = new Date();

  return (
    <div>
      <DatePicker
        onChange={onChange}
        minDate={today}
        value={value}
      />
    </div>
  );
}

export default DatePickerHelper;