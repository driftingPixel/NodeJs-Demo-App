import { IIpGeolocalizationProvider } from "./models/Interfaces/IIPGeoocalizationProvider";
import { Configuration } from "./models/Configuration";
import { log } from './ConfigLogger'
import { Express, Response, Request } from "express-serve-static-core";
import express from 'express'
import { GeoParamsChecker } from "./Utility/GeoParamsChecker";
import { AppResponse } from "./models/AppResponse";

export class App{

    private configuration: Configuration;
    private readonly geoParamsChecker: GeoParamsChecker;
    private readonly express: Express;
    
    constructor(configuration: Configuration, ipGeolocalizationProvider: IIpGeolocalizationProvider){
        this.configuration = configuration;
        this.express = express();
        this.geoParamsChecker = new GeoParamsChecker(this.configuration.allowIp, this.configuration.allowUrl);

        this.prepareIpGeoEndpoints(this.express, ipGeolocalizationProvider);
        this.prepareOtherEndpoints(this.express);

        this.express.listen(this.configuration.serverPort, () => {
            console.log(`Server is running in http://localhost:${this.configuration.serverPort}`)
        }) 
    }

    private prepareIpGeoEndpoints(express: Express, ipGeolocalizationProvider:IIpGeolocalizationProvider){

        express.get('/ipgeo/:address', async (req: Request, res: Response) => {
            const response = new AppResponse();

            if(!req.params.address){
                response
                .setStatus(AppResponse.FAIL)
                .setData({errorMessage: 'You must provide an address to search for!!'});

                res
                .status(400)
                .end(response.toString());
            }
            
            if(!this.geoParamsChecker.isParameterValid(req.params.address)){
                response
                .setStatus(AppResponse.FAIL)
                .setData({errorMessage: 'Address you provide is incorrect!!'});

                res
                .status(400)
                .end(response.toString());
            }

            ipGeolocalizationProvider.proceed(req.params.address)
            .then((data) => {
                res.end(new AppResponse(AppResponse.OK, data).toString())
            })
            .catch((error) => {
                log.error('ERROR', error);
                response
                    .setStatus(AppResponse.FAIL)
                    .setData({errorMessage: error.message});
                
                res.status(500)
                    .end(response.toString());
            })
        })
    }

    private prepareOtherEndpoints(express: Express){
        express.get('/', (req: Request, res: Response) => {
            res.send('API is working good ;).')
        })
    }
}