import mongoose from 'mongoose';

const JoinSessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    session_id: {
        type: mongoose.Schema.ObjectId, ref: 'Session'
    },
    created_date: {
        type: String,
        default: Date.now,
    }
});



export default mongoose.model('JoinSession', JoinSessionSchema); 