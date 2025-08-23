// frontend/src/components/Countdown.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Countdown = ({ targetDate }) => {
  // Logic to calculate and display remaining time
  // For simplicity, this is a placeholder
  return (
    <div className="flex items-center space-x-2 text-red-500 font-bold">
      <span>12:34:56</span>
    </div>
  );
};

Countdown.propTypes = {
  targetDate: PropTypes.instanceOf(Date).isRequired,
};

export default Countdown;