import { IIpGeolocalizationProvider } from "../models/Interfaces/IIPGeoocalizationProvider";
import { Configuration } from "../models/Configuration";
import { IPStack } from '../models/Interfaces/IPStackResponse'
import * as superagent from 'superagent';

export class IPStackProvider extends IIpGeolocalizationProvider{

    private accessKey: string;
    private url: string;

    constructor(configuration: Configuration){
        super(configuration);
        this.accessKey = configuration.geoProviderKey;
        this.url = configuration.geoProviderURL;
    }

    public proceed(address: string): Promise<IPStack.Response> {
        return new Promise((resolve, reject) => {
            superagent
            .get(`${this.url}${address}`)
            .query({'access_key': this.accessKey})
            .end((err, data) => {
               if (err) reject(err);
               resolve(data.body as IPStack.Response)
             }); 
        });
    }
}