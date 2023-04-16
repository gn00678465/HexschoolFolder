import express from 'express';
import { getAllPosts, createPost } from '../../controllers';
import { isAuth } from '@/utils';

const router = express.Router();

router.get('/', getAllPosts);

router.post('/', isAuth, createPost);

export default router;
