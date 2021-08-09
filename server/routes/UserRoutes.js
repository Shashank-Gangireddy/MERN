import express from 'express';
import { userslist , createNewUser } from '../controllers/UsersController.js';

const router = express.Router();

router.get('/ck', userslist);
router.post('/nu', createNewUser);



export default router;