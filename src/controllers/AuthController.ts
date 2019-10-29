import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { AppResponse } from '../models/AppResponse';
import { Express, Response, Request } from 'express-serve-static-core';
import { ParamsChecker } from '../Utility/ParamsChecker';
import { Controller } from './Controller';

export class AuthController extends Controller {
    constructor(private paramsChecker: ParamsChecker) {
        super();
    }

    public login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) this.failResponse('You have to secify email and password', res, 400);
        else if (email.length < 6 || password.length < 6)
            this.failResponse('Login and password must have at least 6 characters', res, 400);
        else if (!this.paramsChecker.isEmail(email)) this.failResponse('You have to specify valid email', res, 400);
        else {
            if (email == process.env.USER_EMAIL && password === process.env.USER_PASSWORD) {
                const token = jwt.sign({ email: email }, process.env.JWT_SECRET + '', {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                res.status(200).send(new AppResponse(AppResponse.OK, undefined, token));
            } else {
                this.failResponse('The email or password is incorrect', res, 401);
            }
        }
    }

    public async isUserLogIn(req: Request, res: Response, next: any) {
        let token = '';
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token || token === '') {
            this.failResponse('Request must be signed by authThoken. Please log in to get access.', res, 401);
        }

        const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET + '')
            .then(decoded => next())
            .catch(error => {
                this.failResponse(error.message, res, 401);
            });
    }
}
