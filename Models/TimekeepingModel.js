import mongoose from 'mongoose';

const timekeepingSchema = mongoose.Schema(
    {
        choose_shift: {
            type: String,
            required: true,
        },
        note_title: {
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
    },
    {
        timestamps: true,
    },
);

const Timekeeping = mongoose.model('Timekeeping', timekeepingSchema);

export default Timekeeping;
