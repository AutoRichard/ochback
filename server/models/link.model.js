import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    facebook: {
        type: String,
    },
    facebookStatus: {
        type: Boolean,
        default: false
    },
    instagram: {
        type: String
    },
    instagramStatus: {
        type: Boolean,
        default: false
    },
    spotify: {
        type: String
    },
    spotifyStatus: {
        type: Boolean,
        default: false
    },
    youtube: {
        type: String
    },
    youtubeStatus: {
        type: Boolean,
        default: false
    },
    tiktok: {
        type: String
    },
    tiktokStatus: {
        type: Boolean,
        default: false
    },
    snapchat: {
        type: String
    },
    snapchatStatus: {
        type: Boolean,
        default: false
    },
    linkUrlAudio: [
        {
            text: String,
            title: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
        }
    ],
    linkUrlVideo: [
        {
            text: String,
            title: String,
            photo: { data: Buffer, contentType: String },
            created: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
        }
    ],
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model('Link', LinkSchema); 