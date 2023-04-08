import express from 'express';
import { getPosts, createNewPost, deletePostWithId } from '../../controllers';

const router = express.Router();

router.get('/', getPosts);

router.post('/', createNewPost);

router.delete('/delete/:id', deletePostWithId);

export default router;
