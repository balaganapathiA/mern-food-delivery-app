import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, discount, applyPromoCode } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    paymentMethod: "stripe", // Default to Stripe
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.map((item, index) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,  // Including the delivery fee
      paymentMethod: data.paymentMethod,
    };

    try {
      let response = await axios.post(url + '/api/order/place', orderData, { headers: { token } });

      if (response.data.success) {
        if (data.paymentMethod === "stripe") {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          setCartItems({}); // Clear the cart
          navigate('/order-success');
        }
      } else {
        alert('Error placing order');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
  {/* Delivery Information Section */}
  <div className="place-order-left">
    <p className="title">Delivery Information</p>
    <div className="multi-fields">
      <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
      <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
    </div>
    <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
    <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
    <div className="multi-fields">
      <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
      <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
    </div>
    <div className="multi-fields">
      <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
      <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
    </div>
    <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
  </div>

  {/* Cart Total Section */}
  <div className="place-order-right">
    <div className="cart-total">
      <h2>Cart Total</h2>
      <div>
        <div className="cart-total-detail">
          <p>Subtotal</p>
          <p>Rs.{getTotalCartAmount()}</p>
        </div>
        <hr />
        <div className="cart-total-detail">
          <p>Delivery Fee</p>
          <p>Rs.{getTotalCartAmount() === 0 ? 0 : 2}</p>
        </div>
        <hr />
        {discount > 0 && (
          <div className="cart-total-detail">
            <p>Promo Discount</p>
            <p>- Rs.{discount}</p>
          </div>
        )}
        <hr />
        <div className="cart-total-detail">
          <b>Total</b>
          <b>Rs.{getTotalCartAmount() + 2 - discount}</b>
        </div>
      </div>
      <div className="payment-method">
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="stripe"
            checked={data.paymentMethod === "stripe"}
            onChange={onChangeHandler}
          />
          Pay with Card (Stripe)
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={data.paymentMethod === "cash"}
            onChange={onChangeHandler}
          />
          Cash on Delivery
        </label>
      </div>
      <button type='submit'>PROCEED TO PAYMENT</button>
    </div>
  </div>
</form>

  );
};

export default PlaceOrder;
