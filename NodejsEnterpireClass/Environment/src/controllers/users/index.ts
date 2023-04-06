import { User } from '../../models';
import { Request, Response } from 'express';
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

export async function getUsers(req: Request, res: Response) {
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
};

export async function updateUser(req: UserRequest, res: Response) {
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
}