import express from 'express';
import { getUsers, updateUser, createUser } from '../../controllers';

const router = express.Router();

router.get('/', getUsers);

router.post('/', createUser);

router.patch('/:id', updateUser);

export default router;
