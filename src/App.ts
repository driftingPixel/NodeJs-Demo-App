import { IIpGeolocalizationProvider } from "./models/Interfaces/IIPGeoocalizationProvider";
import { Configuration } from "./models/Configuration";
import { log } from './ConfigLogger'
import { Express, Response, Request } from "express-serve-static-core";
import express from 'express'

export class App{

    private configuration: Configuration;
    private ipGeolocalizationProvider: IIpGeolocalizationProvider;
    private readonly express: Express;
    
    constructor(configuration: Configuration, ipGeolocalizationProvider: IIpGeolocalizationProvider){
        this.configuration = configuration;
        this.ipGeolocalizationProvider = ipGeolocalizationProvider;
        this.express = express();

        this.prepareIpGeoEndpoints(this.express, ipGeolocalizationProvider);
        this.prepareOtherEndpoints(this.express);

        this.express.listen(this.configuration.serverPort, () => {
            console.log(`Server is running in http://localhost:${this.configuration.serverPort}`)
        }) 
    }

    //TODO fix any
    private prepareIpGeoEndpoints(express: Express, ipGeolocalizationProvider:IIpGeolocalizationProvider){

        express.get('/ipgeo/:address', async (req: Request, res: Response) => {

            // TODO check params
            if(!req.params.address)
                res
                .status(400)
                .end('You must provide an address to search for!!');

            ipGeolocalizationProvider.proceed(req.params.address)
            .then((data) => res.end(JSON.stringify(data)))
            .catch((error) => {
                log.error('ERROR', error);
                res.status(500)
                .end(error.message);
            })
        })
    }

    private prepareOtherEndpoints(express: Express){
        express.get('/', (req: Request, res: Response) => {
            res.send('API is working good ;).')
        })
    }
}