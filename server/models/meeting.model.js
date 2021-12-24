import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    topic: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    start_url: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    join_url: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_date: {
        type: String,
        default: Date.now,
    }
});



export default mongoose.model('Meeting', MeetingSchema); 