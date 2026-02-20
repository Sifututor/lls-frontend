import React from 'react';

function DownloadableMaterial({ files }) {
  if (!files || !files.length) return null;

  return (
    <div className="tutor-rec-downloads">
      <h3 className="tutor-rec-downloads-title">Downloadable Material</h3>
      <ul className="tutor-rec-downloads-list">
        {files.map((file, i) => (
          <li key={i} className="tutor-rec-download-item">
            <a href={file.url || '#'} className="tutor-rec-download-name" target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
            {file.size && <span className="tutor-rec-download-size">{file.size}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DownloadableMaterial;
