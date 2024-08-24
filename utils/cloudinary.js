import { v2 as cloudinary } from 'cloudinary';

const config = () => {
    return cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        secure: true,
    });
};

const getMonth = () => {
    const month = [
        'Tháng_1',
        'Tháng_2',
        'Tháng_3',
        'Tháng_4',
        'Tháng_5',
        'Tháng_6',
        'Tháng_7',
        'Tháng_8',
        'Tháng_9',
        'Tháng_10',
        'Tháng_11',
        'Tháng_12',
    ];

    const d = new Date();
    return month[d.getMonth()];
};

const UploadFileCloudinary = async ({ name_image, path }) => {
    config();
    // Upload an image
    const month = getMonth();
    const uploadResult = await cloudinary.uploader
        .upload(path, {
            public_id: name_image,
            folder: month,
        })
        .catch((error) => {
            console.log(error);
        });

    return { idFile: uploadResult.public_id || '', urlFile: uploadResult.url || '' };
};

const UpdateFileCloudinary = async ({ name_image, path, idFile }) => {
    config();
    const month = getMonth();
    const updateFile = await cloudinary.uploader
        .destroy(idFile)
        .then(async () => {
            const result = await cloudinary.uploader
                .upload(path, {
                    public_id: name_image,
                    folder: month,
                })
                .catch((err) => {
                    console.log(err);
                });
            return result;
        })
        .catch((error) => {
            console.log(error);
        });
    return { idFile: updateFile.public_id || '', urlFile: updateFile.url || '' };
};

export { UploadFileCloudinary, UpdateFileCloudinary };
