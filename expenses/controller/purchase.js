const Order = require('../../model/order');
const User = require('../../model/user');
const Razorpay = require('razorpay');

exports.Premium = async (req, res, next) => {
    try {
        console.log(process.env.Key_id);
        const rzp = new Razorpay({
            key_id: process.env.Key_id,
            key_secret: process.env.Key_secret
        });
        const amount = 75 * 100;

        rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error creating order' });
            }

            try {
                const newOrder = new Order({
                    OrderId: order.id,
                    status: 'PENDING',
                    userId: req.user._id // Use the appropriate field for associating users
                });

                await newOrder.save();

                res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error creating order for user' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateTransaction = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ OrderId: order_id });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.PaymentId = payment_id;
        order.status = 'SUCCESSFUL';
        await order.save();

        const user = await User.findById(order.userId); // Use the appropriate field for associating users
        user.ispremium = true;
        await user.save();

        res.status(200).json({ success: true, message: 'Transaction Successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
