import { IIpGeolocalizationProvider } from "./Interfaces/IIPGeoocalizationProvider";
import { Configuration } from "./models/Configuration";
import { log } from './ConfigLogger'
import { Express, Response, Request } from "express-serve-static-core";
import express from 'express'
import { GeoParamsChecker } from "./Utility/GeoParamsChecker";
import { AppResponse } from "./models/AppResponse";
import { MongoDBProvider } from "./Utility/MongoDBProvider";
import {IDBProvider} from "./Interfaces/IDBProvider"
import { Mongoose } from "mongoose";

export class App{

    private configuration: Configuration;
    private readonly geoParamsChecker: GeoParamsChecker;
    private readonly expressApp: Express;
    private readonly dbProvider: IDBProvider<any>;
    private dbAvailable: boolean;
    private ipGeolocalizationProvider: IIpGeolocalizationProvider;
    
    
    constructor(configuration: Configuration, ipGeolocalizationProvider: IIpGeolocalizationProvider){
        this.configuration = configuration;
        this.ipGeolocalizationProvider = ipGeolocalizationProvider;
        this.expressApp = express();
        this.addMiddleware(this.expressApp);
        this.geoParamsChecker = new GeoParamsChecker(this.configuration.allowIp, this.configuration.allowUrl);
        this.dbProvider = new MongoDBProvider(this.configuration);
        this.dbAvailable = false;
        this.tryDBConnect();
        
        this.prepareRouting()

        this.expressApp.listen(this.configuration.serverPort, () => {
            console.log(`Server is running in http://localhost:${this.configuration.serverPort}`)
        }) 
    }

    private prepareRouting(){
        this.expressApp.route('/')
            .get((req: Request, res: Response) => res.send('IpGeo service available on /ipgeo'));
        this.expressApp.route('/ipgeo')
            .get((req: Request, res: Response) => res.send('API is working good ;).'));
        this.expressApp.route('/ipgeo/:address')
            .get((req: Request, res: Response) => this.methodGetIpGeoAddress(req, res));
        this.expressApp.route('/ipgeo/api')
            .post((req: Request, res: Response) => this.methodPostIpGeoApi(req, res))
    }

    private addMiddleware(expressApp: Express) {
        this.expressApp.use(express.json());
    }

    private tryDBConnect(){
        this.dbProvider.connect()
        .then(() => {
            log.info("connect to DB properly.");
            this.dbAvailable = true;})
        .catch((error: any) => {
            log.error('ERROR', error);
            this.dbAvailable = false;
        })
    }

    private failResponse(errorMessage: string, res: Response, responseCode: number){
        const response = new AppResponse();
        response
            .setStatus(AppResponse.FAIL)
            .setData({errorMessage: errorMessage});

        res
            .status(responseCode)
            .end(response.toString());
    }

    private methodPostIpGeoApi(req: Request, res: Response){

        if(!req.body.address)
        this.failResponse(`Address parameter can't be empty`, res, 400);
        if(!this.geoParamsChecker.isParameterValid(req.body.address))
            this.failResponse('Address you provide is incorrect!!', res, 400);
        
        this.ipGeolocalizationProvider.proceed(req.body.address, true)
            .then((data) => {
                res.send(new AppResponse(AppResponse.OK, data).toString())
            })
            .catch((error) => {
                log.error('ERROR', error);
                this.failResponse(error.message, res, 500);
            })
    }

    private async methodGetIpGeoAddress(req: Request, res: Response){
            
        //TODO this if is unnecessary. Should check this path.
        if(!req.params.address) 
            this.failResponse('You must provide an address to search for!!', res, 400);
        
        if(!this.geoParamsChecker.isParameterValid(req.params.address))
            this.failResponse('Address you provide is incorrect!!', res, 400);
            
        this.ipGeolocalizationProvider.proceed(req.params.address, false)
        .then((data) => {
            res.end(new AppResponse(AppResponse.OK, data).toString())
        })
        .catch((error) => {
            log.error('ERROR', error);
            this.failResponse(error.message, res, 500);
        })
    }
}