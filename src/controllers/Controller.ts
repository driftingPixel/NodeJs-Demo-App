import { AppResponse } from '../models/AppResponse';
import { Express, Response, Request } from 'express-serve-static-core';

export abstract class Controller {
    protected failResponse(errorMessage: string, res: Response, responseCode: number) {
        const response = new AppResponse();
        response.setStatus(AppResponse.FAIL).setData({ errorMessage: errorMessage });
        res.status(responseCode).end(response.toString());
    }
}
