// frontend/src/components/Countdown.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };
    
  return (
        <div className="flex items-center space-x-2 text-red-500 font-bold">
            <span className="text-sm md:text-base">Ends in:</span>
            <div className="flex space-x-1 text-base">
                {timeLeft.hours !== undefined && (
                    <>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-md">{formatTime(timeLeft.hours)}h</span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-md">{formatTime(timeLeft.minutes)}m</span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-md">{formatTime(timeLeft.seconds)}s</span>
                    </>
                )}
            </div>
        </div>
    );
};

Countdown.propTypes = {
    targetDate: PropTypes.instanceOf(Date).isRequired,
};

export default Countdown;