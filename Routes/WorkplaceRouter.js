import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../Middleware/AuthMiddleware.js';
import Workplace from './../Models/WorkplaceModel.js';

const WorkplaceRouter = express.Router();
// REGISTER
WorkplaceRouter.post(
    '/create',
    protect,
    asyncHandler(async (req, res) => {
        const { name } = req.body;

        const find = await Workplace.findOne({ name });

        if (!!find) {
            res.status(400);
            throw new Error('Khu vực này bạn đã thêm rồi');
        }

        const save = await Workplace.create({
            name,
        });

        if (save) {
            res.status(201).json({ success: 'Thành công', text: 'Đã tạo thành công' });
        } else {
            res.status(400);
            throw new Error('Đăng ký tài khoản thất bại');
        }
    }),
);

WorkplaceRouter.get(
    '/all',
    protect,
    asyncHandler(async (req, res) => {
        const getAll = await Workplace.find({}).sort({ _id: -1 });
        res.status(201).json(getAll);
    }),
);

export default WorkplaceRouter;
