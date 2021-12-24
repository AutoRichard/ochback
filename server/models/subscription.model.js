import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    customer_id: {
        type: String
    },
    subscription_id: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    created_date: {
        type: String,
        default: Date.now,
    }
});



export default mongoose.model('Subscription', SubscriptionSchema); 