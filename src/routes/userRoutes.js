import express from 'express';
import { registerUser, loginUser, getAllUsers, getUser, deleteUser, checkUser } from '../controllers/userController.js';
import taskRoutes from './taskRoutes.js';
import multer from 'multer';
import { auth } from '../middlewares/auth.js';
import path from 'path';

const storage = multer.memoryStorage(); // Use memory storage

const file_upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error("File upload only supports the following filetypes - " + filetypes));
  },
});

const router = express.Router();

router.post('/register', file_upload.single('image'), registerUser);
router.post('/checkuser', checkUser);
router.post('/login', loginUser);
router.get('/users', auth, getAllUsers);
router.get('/user', getUser);
router.delete('/DeleteUser', auth, deleteUser);
router.use("/storage", express.static("storage"));
router.use(taskRoutes);

export default router;