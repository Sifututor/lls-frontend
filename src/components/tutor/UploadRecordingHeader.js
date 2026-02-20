import React from 'react';
import { Link } from 'react-router-dom';

/** Edit Class button icon – white dikhane ke liye CSS me filter: brightness(0) invert(1) */
const EDIT_CLASS_ICON_URL = '/assets/images/icons/059-pencil.svg';

function UploadRecordingHeader({ title, metadata, editLink }) {
  return (
    <div className="tutor-rec-header">
      <div className="tutor-rec-header-left">
        <h1 className="tutor-rec-title">{title}</h1>
        <p className="tutor-rec-metadata">{metadata}</p>
      </div>
      {editLink && (
        <Link to={editLink} className="tutor-rec-btn-edit">
         <img
          src="/assets/images/tutor/tutor-edit.svg"
          alt=""
          className="tutor-rec-btn-edit-icon"
        />

          Edit Class
        </Link>
      )}
    </div>
  );
}

export default UploadRecordingHeader;
