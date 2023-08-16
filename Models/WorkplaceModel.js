import mongoose from 'mongoose';

const workplaceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Workplace = mongoose.model('Workplace', workplaceSchema);

export default Workplace;
