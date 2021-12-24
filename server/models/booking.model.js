import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    meeting_id: {
        type: mongoose.Schema.ObjectId, ref: 'Meeting'
    },
    user_id: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    hour: {
        type: Number,
        required: true
    },
    owner_id: {        
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    created_date: {
        type: String,
        default: Date.now,
    }
});



export default mongoose.model('Booking', BookingSchema); 