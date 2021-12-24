import mongoose from 'mongoose';

const InviteSchema = new mongoose.Schema({
    meeting_id: {
        type: mongoose.Schema.ObjectId, ref: 'Meeting'
    },
    user_id: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    owner_id: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    accept: {
        type: Boolean,
        default: false
    },
    created_date: {
        type: String,
        default: Date.now,
    }
});



export default mongoose.model('Invite', InviteSchema); 