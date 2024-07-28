import express from 'express';
import { registerUser, loginUser, getAllUsers, getUser, deleteUser, checkUser } from '../controllers/userController.js';
import taskRoutes from './taskRoutes.js';
import multer from 'multer';
import fs from 'fs';
import path from "path";
import { auth } from '../middlewares/auth.js';

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const folder_name = 'storage/';
    await fs.promises.mkdir(folder_name, { recursive: true })
      .catch((error) => {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      });

    cb(null, folder_name);
  },
  filename: function (req, file, cb) {
    const hrTime = process.hrtime();
    const nanotime = hrTime[0] * 1e9 + hrTime[1];
    const filename = nanotime + '_' + file.originalname;
    cb(null, filename);
  }
});

const file_upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Allowed file types
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
router.use("/storage", express.static("storage"))
router.use(taskRoutes);

export default router;
