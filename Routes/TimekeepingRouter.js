import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { protect, admin } from '../Middleware/AuthMiddleware.js';
import Timekeeping from '../Models/TimekeepingModel.js';
import { uploadFile, deteteFile } from '../utils/googleDriver.js';

const TimekeepingRouter = express.Router();
// Cấu hình Multer để xử lý tệp tải lên
const storage = multer.diskStorage({});
const upload = multer({ storage });

TimekeepingRouter.post(
    '/create',
    protect,
    upload.single('file'),
    asyncHandler(async (req, res) => {
        const { choose_shift, note_title } = req.body;
        const { createFile, getUrl } = await uploadFile({ file: req.file, folderName: 'Tháng_8' });
        if (createFile) {
            const create = await Timekeeping.create({
                choose_shift,
                note_title,
                user: req.user._id,
                file: { idFile: createFile, urlFile: getUrl },
            });
            if (!!create) {
                res.status(201).json({ success: 'Thành công', text: 'Bạn đã chấm công' });
            } else {
                res.status(400);
                throw new Error('Chấm công thất bại, vui lòng thử lại');
            }
        }
    }),
);

TimekeepingRouter.post(
    '/delete',
    // protect,
    asyncHandler(async (req, res) => {
        const { retultDelete } = await deteteFile({ fileId: req.body.fileId });
        res.status(201).json({ retultDelete });
    }),
);

TimekeepingRouter.get(
    '/all_history_user',
    protect,
    asyncHandler(async (req, res) => {
        const pageSize = 30;
        const page = Number(req.query.pageNumber) || 1;

        const count = await Timekeeping.countDocuments({});
        const data = await Timekeeping.find({ user: req.user._id })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ _id: -1 })
            .populate('user', 'name');

        res.json({ data, page, pages: Math.ceil(count / pageSize) });
    }),
);

export default TimekeepingRouter;
