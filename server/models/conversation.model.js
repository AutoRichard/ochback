import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    lastMessage: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false
    },
    sendLast: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    recieveLast: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    deleivered: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        default: Date.now,
    }
});


export default mongoose.model('Conversation', ConversationSchema); 