import { AppResponse } from '../models/AppResponse';
import { Express, Response, Request } from 'express-serve-static-core';

/**
 * Base class for all Controllers
 */
export abstract class Controller {
    /**
     * Mathed for send response when action fails.
     * @param errorMessage
     * @param res
     * @param responseCode
     */
    protected failResponse(errorMessage: string, res: Response, responseCode: number) {
        const response = new AppResponse();
        response.setStatus(AppResponse.FAIL).setData({ errorMessage: errorMessage });
        res.status(responseCode).end(response.toString());
    }
}
