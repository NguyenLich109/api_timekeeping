import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        date: {
            type: String,
        },
        sex: {
            type: String,
        },
        key_login: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        cmnd: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        address: {
            type: String,
        },
        image: {
            type: String,
        },
        disable: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', userSchema);
export default User;
