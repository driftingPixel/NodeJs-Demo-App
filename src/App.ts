import { IIpGeolocalizationProvider } from './Interfaces/IIPGeoocalizationProvider';
import { Configuration } from './models/Configuration';
import { log } from './ConfigLogger';
import { Express, Response, Request, NextFunction } from 'express-serve-static-core';
import express from 'express';
import { ParamsChecker } from './Utility/ParamsChecker';
import { AppResponse } from './models/AppResponse';
import { MongoDBProvider } from './Utility/MongoDBProvider';
import { IDBProvider } from './Interfaces/IDBProvider';
import { Mongoose } from 'mongoose';
import request from 'superagent';
import { AuthController } from './controllers/AuthController';

export class App {
    private configuration: Configuration;
    private readonly paramsChecker: ParamsChecker;
    private readonly expressApp: Express;
    private ipGeolocalizationProvider: IIpGeolocalizationProvider;
    private authController: AuthController;

    constructor(configuration: Configuration, ipGeolocalizationProvider: IIpGeolocalizationProvider) {
        this.configuration = configuration;
        this.ipGeolocalizationProvider = ipGeolocalizationProvider;
        this.paramsChecker = new ParamsChecker(this.configuration.allowIp, this.configuration.allowUrl);
        this.authController = new AuthController(this.paramsChecker);
        this.expressApp = express();
        this.addMiddleware(this.expressApp);

        this.prepareRouting();

        this.expressApp.listen(this.configuration.serverPort || 5000, () => {
            console.log(`Server is running in http://localhost:${this.configuration.serverPort}`);
        });
    }

    private prepareRouting() {
        this.expressApp.route('/').get((req: Request, res: Response) => res.send('IpGeo service available on /ipgeo'));
        this.expressApp.route('/login').post((req: Request, res: Response) => this.authController.login(req, res));

        this.expressApp
            .route('/ipgeo')
            .get((req: Request, res: Response) => res.send('API is working good ;).'))
            .post(
                (req: Request, res: Response, next: NextFunction) => this.authController.isUserLogIn(req, res, next),
                (req: Request, res: Response) => this.methodPostIpGeoApi(req, res)
            )
            .put((req: Request, res: Response) => this.methodPutIpGeo(req, res));

        this.expressApp
            .route('/ipgeo/:address')
            .get((req: Request, res: Response) => this.methodGetIpGeoAddress(req, res))
            .delete((req: Request, res: Response) => this.methodDeleteIpGeoAddress(req, res));
        // .put((req: Request, res: Response) => this.methodPutIpGeo(req, res));
    }

    private addMiddleware(expressApp: Express) {
        this.expressApp.use(express.json());
        this.expressApp.use((req: Request, response: Response, next: NextFunction) => {
            log.info(`Headers: ${JSON.stringify(req.headers)}`);

            next();
        });
    }

    private failResponse(errorMessage: string, res: Response, responseCode: number) {
        const response = new AppResponse();
        response.setStatus(AppResponse.FAIL).setData({ errorMessage: errorMessage });
        res.status(responseCode).end(response.toString());
    }

    private methodGetIpGeoAddress(req: Request, res: Response) {
        if (!req.params.address) this.failResponse(`Address parameter can't be empty`, res, 400);
        this.ipGeolocalizationProvider
            .getItem(req.params.address)
            .then(result => res.end(new AppResponse(AppResponse.OK, result).toString()))
            .catch(error => this.failResponse(error.errorMessage, res, 500));
    }

    private methodPostIpGeoApi(req: Request, res: Response) {
        if (!req.body.address) this.failResponse(`Address parameter can't be empty`, res, 400);
        this.proceedLookupRequest(req, res, req.body.address, true);
    }

    private methodPutIpGeo(req: Request, res: Response) {
        if (!req.body.address) this.failResponse(`Address parameter can't be empty`, res, 400);
        this.ipGeolocalizationProvider
            .put(req.body.address)
            .then(result => res.send(new AppResponse(AppResponse.OK, { result: result }).toString()))
            .catch(error => this.failResponse(error.errorMessage, res, 500));
    }

    private methodDeleteIpGeoAddress(req: Request, res: Response) {
        if (!req.params.address) this.failResponse(`Address parameter can't be empty`, res, 400);
        this.ipGeolocalizationProvider
            .delete(req.params.address)
            .then(result => res.send(new AppResponse(AppResponse.OK, { result: result }).toString()))
            .catch(error => this.failResponse(error.errorMessage, res, 500));
    }

    private proceedLookupRequest(req: Request, res: Response, lookUpAddress: string, saveToDB: boolean) {
        if (!this.paramsChecker.isParameterValid(lookUpAddress))
            this.failResponse('Address you provide is incorrect!!', res, 400);

        this.ipGeolocalizationProvider
            .proceed(lookUpAddress, saveToDB)
            .then(data => {
                res.send(new AppResponse(AppResponse.OK, data).toString());
            })
            .catch(error => {
                log.error('ERROR', error);
                this.failResponse(error.message, res, 500);
            });
    }
}
