// receipts/ReceiptSelector.jsx
// Drop-in replacement for the old <ReceiptPreview order={order} /> call.
// Automatically selects the correct template based on order.fund.fundType
import React from 'react';
import GatewayReceipt from './GatewayReceipt';
import CleanReceipt   from './CleanReceipt';
import BankReceipt    from './BankReceipt';

const ReceiptSelector = ({ order }) => {
  const fundType = order?.fund?.fundType;

  switch (fundType) {
    case 'clean':   return <CleanReceipt   order={order} />;
    case 'bank':    return <BankReceipt    order={order} />;
    case 'gateway':
    default:        return <GatewayReceipt order={order} />;
  }
};

export default ReceiptSelector;