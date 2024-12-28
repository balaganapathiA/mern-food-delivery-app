import userModel from './../models/userModel.js';

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Fetch user data and initialize cartData if missing
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let cartData = userData.cartData || {};

        // Update cartData
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        // Save the updated cartData
        await userModel.findByIdAndUpdate(userId, { $set: { cartData } });
        res.json({ success: true, message: 'Item added to cart' });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Fetch user data and initialize cartData if missing
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let cartData = userData.cartData || {};

        // Update cartData
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] <= 0) {
                delete cartData[itemId];
            }
        }

        // Save the updated cartData
        await userModel.findByIdAndUpdate(userId, { $set: { cartData } });
        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



export const getCart = async (req, res) => {
    try {
        const userId = req.user?.id; // Assuming user ID is decoded from JWT

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized - User ID missing" });
        }

        console.log("User ID from JWT:", userId);

        let cart = await Cart.findOne({ userId });
        console.log("Cart Query Result:", cart);

        if (!cart) {
            // Optionally create an empty cart if none exists
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }

        res.status(200).json({ success: true, cartData: cart.items });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



export { addToCart, removeFromCart };
