import express, { Request } from 'express';
import { User } from '../../models';
import { handleError, execStrategyActions } from '../../utils';

interface Body {
  name: string;
  email: string;
}

interface Params {
  id?: string;
}

interface UserRequest extends Request<Params> {
  body: Body;
}

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (e) {
    if (e instanceof Error) {
      handleError(res, 500, e.message);
    } else {
      handleError(res, 500, 'Server Error');
    }
  }
});

router.post('/', async (req: UserRequest, res) => {
  try {
    const data = req.body;
    const actions: Common.StrategyActions = [
      [
        !data.email || !data.name,
        () => {
          handleError(res, 400, 'name, email 必填');
        }
      ],
      [
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(data.email),
        () => {
          handleError(res, 400, '信箱格式錯誤!');
        }
      ],
      [
        true,
        async () => {
          const newUser = await User.create({
            name: data.name,
            email: data.email,
            photo:
              'https://images.unsplash.com/photo-1680372669294-570f598ce2e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80'
          });
          res.status(200).json({
            status: 'success',
            data: newUser
          });
        }
      ]
    ];

    execStrategyActions(actions);
  } catch (e) {
    if (e instanceof Error) {
      handleError(res, 500, e.message);
    } else {
      handleError(res, 500, 'Server Error');
    }
  }
});

router.patch('/:id', (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const actions: Common.StrategyActions = [
      [
        id === ':id',
        () => {
          handleError(res, 400, 'id 不正確!');
        }
      ],
      [
        true,
        async () => {
          await User.findByIdAndUpdate(
            { _id: id },
            {
              name: data.name,
              email: data.email
            }
          );
          res.status(200).json({
            status: 'Success'
          });
        }
      ]
    ];
    execStrategyActions(actions);
  } catch (e) {
    handleError(res, 500, 'Server Error');
  }
});

export default router;
