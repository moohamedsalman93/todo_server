import express from 'express';
import { registerUser, loginUser, getAllUsers, getUser, deleteUser, checkUser } from '../controllers/userController.js';
import taskRoutes from './taskRoutes.js';
import { auth } from '../middlewares/auth.js';



const router = express.Router();

router.post('/register', registerUser);
router.post('/checkuser', checkUser);
router.post('/login', loginUser);
router.get('/users', auth, getAllUsers);
router.get('/user', getUser);
router.delete('/DeleteUser', auth, deleteUser);
router.use("/storage", express.static("storage"));
router.use(taskRoutes);

export default router;