import { IIpGeolocalizationProvider } from "./Interfaces/IIPGeoocalizationProvider";
import { Configuration } from "./models/Configuration";
import { log } from './ConfigLogger'
import { Express, Response, Request } from "express-serve-static-core";
import express from 'express'
import { GeoParamsChecker } from "./Utility/GeoParamsChecker";
import { AppResponse } from "./models/AppResponse";
import { MongoDBProvider } from "./Utility/MongoDBProvider";
import {IDBProvider} from "./Interfaces/IDBProvider"

export class App{

    private configuration: Configuration;
    private readonly geoParamsChecker: GeoParamsChecker;
    private readonly express: Express;
    private readonly dbProvider: IDBProvider<any>;
    private dbAvailable: boolean;
    
    
    constructor(configuration: Configuration, ipGeolocalizationProvider: IIpGeolocalizationProvider){
        this.configuration = configuration;
        this.express = express();
        this.geoParamsChecker = new GeoParamsChecker(this.configuration.allowIp, this.configuration.allowUrl);
        this.dbProvider = new MongoDBProvider(this.configuration);
        this.dbAvailable = false;
        this.tryDBConnect();
        
        this.prepareGetIpGeoEndpoints(this.express, ipGeolocalizationProvider);
        this.prepareOtherEndpoints(this.express);

        this.express.listen(this.configuration.serverPort, () => {
            console.log(`Server is running in http://localhost:${this.configuration.serverPort}`)
        }) 
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

    private prepareGetIpGeoEndpoints(express: Express, ipGeolocalizationProvider:IIpGeolocalizationProvider){

        express.get('/ipgeo/:address', async (req: Request, res: Response) => {
            
            //TODO this if is unnecessary. Should check this path.
            if(!req.params.address) 
                this.failResponse('You must provide an address to search for!!', res, 400);
            
            if(!this.geoParamsChecker.isParameterValid(req.params.address))
                this.failResponse('Address you provide is incorrect!!', res, 400);
                
            ipGeolocalizationProvider.proceed(req.params.address)
            .then((data) => {
                res.end(new AppResponse(AppResponse.OK, data).toString())
            })
            .catch((error) => {
                log.error('ERROR', error);
                this.failResponse(error.message, res, 500);
            })
        })
    }

    private prepareOtherEndpoints(express: Express){
        express.get('/', (req: Request, res: Response) => {
            res.send('API is working good ;).')
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
}