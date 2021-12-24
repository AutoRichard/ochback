import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    pricing: {
        type: Number,
        default: 0
    },
    start: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number,
        default: 0
    },
    limit: {
        type: Number,
        default: 0
    },
    join: {
        type: Number,
        default: 0
    },
    feature: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    link: {
        type: String,
        trim: true,
    },
    created_date: {
        type: String,
        default: Date.now,
    }
});



export default mongoose.model('Session', SessionSchema); 