import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Article is required'
    },
    text: {
        type: String,
        required: 'Article is required'
    },
    mediaLink: {
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    photo: {
        data: Buffer,
        contentType: String
    },
});

export default mongoose.model('News', NewsSchema);