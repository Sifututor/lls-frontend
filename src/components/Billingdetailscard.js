import React from 'react';

function Billingdetailscard({ billingData }) {
  return (
    <div className="subscription-billing-wrapper">
      <h3 className="subscription-billing-heading">Billing Details</h3>

      <div className="subscription-billing-grid">
        <div className="subscription-billing-box">
          <p className="subscription-billing-label">Payment Method</p>
          <div className="subscription-billing-value-row">
            <img src="/assets/images/icons/master-card.svg" alt="Mastercard" className="subscription-card-icon" />
            <span>{billingData.paymentMethod}</span>
          </div>
        </div>

        <div className="subscription-billing-box">
          <p className="subscription-billing-label">Billing Email</p>
          <p className="subscription-billing-value">{billingData.email}</p>
        </div>

        <div className="subscription-billing-box">
          <p className="subscription-billing-label">Billing Cycle</p>
          <p className="subscription-billing-value">{billingData.cycle}</p>
        </div>

        <div className="subscription-billing-box">
          <p className="subscription-billing-label">Next Payment</p>
          <p className="subscription-billing-value">{billingData.nextPayment}</p>
        </div>
      </div>
    </div>
  );
}

export default Billingdetailscard;