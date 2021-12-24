import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: 'Article is required'
    },
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
        }
    ],
    likes: [
        {
            liker: Number,
            created: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
        }
    ],
    mediaLink: {
        type: String
    },
    imageExist: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    }
});


export default mongoose.model('Post', PostSchema);