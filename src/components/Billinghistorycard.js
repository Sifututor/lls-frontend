import React from 'react';

function Billinghistorycard({ historyData, onDownloadReceipt, onDownloadAll }) {
  return (
    <div className="subscription-history-wrapper">
      <div className="subscription-history-header">
        <h3 className="subscription-history-heading">Billing History</h3>
        <button className="subscription-btn-download-all" onClick={onDownloadAll}>
          Download All
        </button>
      </div>

      <div className="subscription-history-table">
        <table className="subscription-table">
          <thead>
            <tr>
              <th>Payment Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.description}</td>
                <td>{item.amount}</td>
                <td>
                  <span className="subscription-status-badge subscription-status-paid">
                    {item.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="subscription-btn-download-receipt"
                    onClick={() => onDownloadReceipt(item.id)}
                  >
                    Download Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Billinghistorycard;