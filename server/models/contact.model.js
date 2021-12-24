import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: 'Phone Number is required'
    },
    text: {
        type: String,
        required: 'Message is required'
    },
    email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model('Contact', ContactSchema);