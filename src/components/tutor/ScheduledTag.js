import React from 'react';

function ScheduledTag({ time }) {
  if (!time) return null;
  return (
    <div className="tutor-rec-scheduled-tag">
      Scheduled for {time}
    </div>
  );
}

export default ScheduledTag;
