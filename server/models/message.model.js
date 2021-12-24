import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.ObjectId, ref: 'Conversation'
    },
    to: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    from: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    }
});



export default mongoose.model('Message', MessageSchema); 