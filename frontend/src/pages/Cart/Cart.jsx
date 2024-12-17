import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../components/context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, discount, applyPromoCode } = useContext(StoreContext);
    const [promoCode, setPromoCode] = useState("");
    const [promoStatus, setPromoStatus] = useState("");  // To track promo code success or failure
    const navigate = useNavigate();

    // Function to handle promo code input
    const handlePromoCodeSubmit = () => {
        if (promoCode === 'kavi04') {
            // Apply discount through context function
            applyPromoCode(promoCode);
            setPromoStatus('success');
        } else {
            applyPromoCode(""); // Clear discount if invalid
            setPromoStatus('fail');
        }
    };

    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {food_list.map((item) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={url + '/images/' + item.image} alt="" />
                                    <p>{item.name}</p>
                                    <p>Rs.{item.price}</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p>Rs.{item.price * cartItems[item._id]}</p>
                                    <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                })}
            </div>

            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                        <div className="cart-total-detail">
                            <p>Subtotal</p>
                            <p>Rs.{getTotalCartAmount() + discount}</p> {/* Make sure the discount is applied */}
                        </div>
                        <hr />
                        <div className="cart-total-detail">
                            <p>Delivery Fee</p>
                            <p>Rs.{getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        {discount > 0 && (
                            <div className="cart-total-detail">
                                <p>Promo Discount (50%)</p>
                                <p>- Rs.{discount}</p>
                            </div>
                        )}
                        <hr />
                        <div className="cart-total-detail">
                            <b>Total</b>
                            <b>Rs.{getTotalCartAmount() + 2 - discount}</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>
                <div>
                    <div className="cart-promocode">
                        <div>
                            <p>If you have a promo code, enter it here</p>
                            <div className='cart-promocode-input'>
                                <input
                                    type="text"
                                    placeholder='Promo Code'
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button onClick={handlePromoCodeSubmit}>Submit</button>
                            </div>
                            {/* Show success or failure message below the promo code */}
                            {promoStatus && (
                                <p className={`promo-message ${promoStatus}`}>{promoStatus === 'success' ? 'Promo code applied successfully!' : 'Invalid promo code!'}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
