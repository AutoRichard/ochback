import mongoose from 'mongoose';

const InstructorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    pricing: {
        type: Number,
        default: 0
    },
    profession: {
        type: String,
        trim: true,
        required: 'Profession is required'
    },
    about: {
        type: String,
        trim: true,
        required: 'About is required'
    },
    photo: {
        data: Buffer,
        contentType: String
    }, 
    event: [
        {
            title: String,
            link: String,
            start: { type: Date, default: Date.now },
            end: { type: Date, default: Date.now },
            user: { type: mongoose.Schema.ObjectId, ref: 'User' },
            hours: { type: Number, default: 0 },
            amount: { type: Number, default: 0 },
            booked: { type: Boolean, default: false },
            password: String,
            meeting_number: String
        }
    ],
    created_date: {
        type: String,
        default: Date.now,
    }
});



export default mongoose.model('Instructor', InstructorSchema); 