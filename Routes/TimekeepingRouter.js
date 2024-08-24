import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { protect, admin } from '../Middleware/AuthMiddleware.js';
import Timekeeping from '../Models/TimekeepingModel.js';
import { UpdateFileCloudinary, UploadFileCloudinary } from '../utils/cloudinary.js';

const TimekeepingRouter = express.Router();

const storage = multer.diskStorage({});
const uploads = multer({ storage });

TimekeepingRouter.post(
    '/create',
    protect,
    uploads.single('file'),
    asyncHandler(async (req, res) => {
        const { map, startWorktime, worktime, description, overtime } = req.body;
        const { idFile, urlFile } = await UploadFileCloudinary({
            name_image: req.file.originalname,
            path: req.file.path,
        });
        if (!!urlFile) {
            const create = await Timekeeping.create({
                map,
                startWorktime,
                worktime,
                overtime,
                description,
                user: req.user._id,
                file: { idFile, urlFile },
            });
            if (!!create) {
                res.json(create);
            } else {
                res.status(400);
                throw new Error('Chấm công thất bại, vui lòng thử lại');
            }
        }
    }),
);

TimekeepingRouter.post(
    '/:id/update_image',
    protect,
    uploads.single('file'),
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { id_url } = req.query;
        try {
            const { idFile, urlFile } = await UpdateFileCloudinary({
                name_image: req.file.originalname,
                path: req.file.path,
                idFile: id_url,
            });
            await Timekeeping.updateOne(
                { _id: id },
                {
                    $set: {
                        file: { idFile, urlFile },
                    },
                },
            );
            res.json({ idFile, urlFile });
        } catch (error) {
            res.status(400);
            throw new Error('Cập nhật thất bại, vui lòng thử lại');
        }
    }),
);

TimekeepingRouter.post(
    '/:id/update',
    protect,
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            await Timekeeping.updateOne(
                { _id: id },
                {
                    $set: {
                        ...req.body,
                    },
                },
            );
            res.status(200).json('Bạn đã cập nhật thành công');
        } catch (error) {
            res.status(400);
            throw new Error('Cập nhật thất bại, vui lòng thử lại');
        }
    }),
);

TimekeepingRouter.get(
    '/all_history_user/',
    protect,
    asyncHandler(async (req, res) => {
        try {
            const { data } = req.query;
            const queryConditions = [];
            data.split(',').forEach((date) => {
                const startDate = new Date(`${date}T00:00:00.000Z`);
                const endDate = new Date(`${date}T23:59:59.999Z`);
                queryConditions.push({
                    createdAt: { $gte: startDate, $lt: endDate },
                });
            });

            // Truy vấn MongoDB một lần với tất cả các khoảng thời gian
            const datas = await Timekeeping.find({
                user: req.user._id,
                $or: queryConditions,
            })
                .select('-user')
                .sort({ _id: -1 });

            res.send(datas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
);

export default TimekeepingRouter;
