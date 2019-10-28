import { IIpGeolocalizationProvider } from "../Interfaces/IIPGeoocalizationProvider";
import { Configuration } from "../models/Configuration";
import { IPStack } from '../Interfaces/IPStackResponse'
import * as superagent from 'superagent';
import { IDBProvider } from "../Interfaces/IDBProvider";
import { MongoDBProvider } from "../Utility/MongoDBProvider";
import { log } from "../ConfigLogger";

export class IPStackProvider extends IIpGeolocalizationProvider{

    private accessKey: string;
    private url: string;
    private dbAvailable: boolean;
    private dbProvider: IDBProvider<any>

    constructor(configuration: Configuration){
        super(configuration);
        this.accessKey = configuration.geoProviderKey;
        this.url = configuration.geoProviderURL;
        this.dbAvailable = false;
        this.dbProvider = new MongoDBProvider(this.configuration);
        this.tryDBConnect();
    }

    public proceed(address: string, saveToDb: boolean): Promise<IPStack.Response | string> {
        return new Promise((resolve, reject) => {
            superagent
            .get(`${this.url}${address}`)
            .query({'access_key': this.accessKey})
            .end((err, data) => {
               if (err) reject(err);
               if (!data.body.type) resolve(`Address: ${address} is not exist!`)
               resolve(data.body as IPStack.Response)
             }); 
        });
    }

    private tryDBConnect(){
        this.dbProvider.connect()
        .then(() => {
            log.info("connect to DB properly.");
            this.dbAvailable = true;})
        .catch((error: any) => {
            log.error('DB Connection error!', error );
            this.dbAvailable = false;
        })
    }

    
}