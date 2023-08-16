import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { protect, admin } from '../Middleware/AuthMiddleware.js';
import generateToken from '../utils/generateToken.js';
import User from './../Models/UserModel.js';
import { uploadFile, deteteFile } from '../utils/googleDriver.js';

const userRouter = express.Router();
// Cấu hình Multer để xử lý tệp tải lên
const storage = multer.diskStorage({});
const upload = multer({ storage });

// LOGIN
userRouter.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { key_login } = req.body;
        const user = await User.findOne({ key_login });
        if (user) {
            res.json({
                _id: user._id,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Mã đăng nhập không chính xác');
        }
    }),
);

// REGISTER
userRouter.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name, key_login, phone } = req.body;

        const userExists = await User.findOne({ key_login });

        if (userExists) {
            res.status(400);
            throw new Error('Tài khoản đã tồn tài');
        }

        const user = await User.create({
            name,
            key_login,
            phone,
        });

        if (user) {
            res.status(201).json({ success: 'Thành công', text: 'Đăng ký tài khoản thành công' });
        } else {
            res.status(400);
            throw new Error('Đăng ký tài khoản thất bại');
        }
    }),
);

// GET USER
userRouter.get(
    '/user',
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                sex: user.sex,
                key_login: user.key_login,
                date: user.date,
                phone: user.phone,
                cmnd: user.cmnd,
                isAdmin: user.isAdmin,
                address: user.address,
                image: user.image,
                disable: user.disable,
                createdAt: user.createdAt,
            });
        } else {
            res.status(400);
            throw new Error('Không tìm thấy tài khoản');
        }
    }),
);

export default userRouter;
