import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css'

import axios from 'axios';

const OrderSuccess = () => {
  const navigate = useNavigate();
 
  return (
    <div className="order-success">
      <h1>Thank you for your order!</h1>
      <p>Your order will be delivered soon.</p>
      <button type="home" onClick={() => navigate('/myorders')}>Go to Orders</button>
    </div>
  );
};

export default OrderSuccess;
