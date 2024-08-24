import mongoose from 'mongoose';

const timekeepingSchema = mongoose.Schema(
    {
        map: {
            type: String,
            required: true,
        },
        startWorktime: {
            type: String,
            required: true,
        },
        worktime: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        overtime: {
            type: String,
        },
        file: {
            idFile: { type: String },
            urlFile: { type: String },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        is_done: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const Timekeeping = mongoose.model('Timekeeping', timekeepingSchema);

export default Timekeeping;
