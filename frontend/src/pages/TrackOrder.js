import React from 'react';

const TrackOrder = () => (
  <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="text-4xl font-orbitron font-bold mb-4">Track Order</h1>
    <p className="text-gray-300 mb-6">Enter your order number to track the shipment status.</p>
    <div className="max-w-md mx-auto">
      <input className="cyber-input w-full mb-4" placeholder="Order number (e.g. ORD-001)" />
      <button className="cyber-button w-full">TRACK</button>
    </div>
  </div>
);

export default TrackOrder;
