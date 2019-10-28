import { Configuration } from '../models/Configuration';
import mongoose, { Mongoose } from 'mongoose';
import { IDBProvider } from '../Interfaces/IDBProvider';
import { IPStack } from '../Interfaces/IPStackResponse';
import { MongoSchemaFactory } from './MongoSchemaFactory';
import { resolveCname, resolve } from 'dns';

export class MongoDBProvider implements IDBProvider<Mongoose> {
    private readonly GeoLocalizationItem: mongoose.Model<mongoose.Document>;
    constructor(private readonly configuration: Configuration) {
        this.GeoLocalizationItem = MongoSchemaFactory.getGeoLocalizationType();
    }

    public connect(): Promise<Mongoose> {
        return mongoose.connect(this.configuration.database, {
            auth: {
                user: this.configuration.dbUser,
                password: this.configuration.dbPassword,
            },
            useNewUrlParser: true,
        });
    }

    get(address: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.GeoLocalizationItem.findOne({ $or: [{ url: address }, { ip: address }] }).exec((error, item) => {
                if (error) {
                    reject(error);
                }
                if (!item) {
                    resolve(`Item with address: ${address} not exist in db. Usee POST or PUT request to create item`);
                }
                resolve(item);
            });
        });
    }

    public save(item: IPStack.Response, url?: string): Promise<any> {
        return this.GeoLocalizationItem.create({
            ip: item.ip,
            url: url,
            type: item.type,
            continentCode: item.continent_code,
            countryCode: item.country_code,
            regionCode: item.region_code,
            city: item.city,
            zipCode: item.zip,
            latitude: item.latitude,
            longitude: item.longitude,
        });
    }

    update(item: IPStack.Response, url?: string): Promise<any> {
        const objectToSave = {
            ip: item.ip,
            url: url,
            type: item.type,
            continentCode: item.continent_code,
            countryCode: item.country_code,
            regionCode: item.region_code,
            city: item.city,
            zipCode: item.zip,
            latitude: item.latitude,
            longitude: item.longitude,
        };

        return new Promise((resolve, reject) => {
            const ip = item.ip;
            this.GeoLocalizationItem.create({
                ip: item.ip,
                url: url,
                type: item.type,
                continentCode: item.continent_code,
                countryCode: item.country_code,
                regionCode: item.region_code,
                city: item.city,
                zipCode: item.zip,
                latitude: item.latitude,
                longitude: item.longitude,
            })
                .then(item => resolve(`item with ip: ${ip} created`))
                .catch(error => {
                    this.GeoLocalizationItem.update({ ip: item.ip }, objectToSave).exec((error, item) => {
                        if (error) {
                            reject(error);
                        }
                        if (!item) {
                            resolve('Item not found');
                        }
                        resolve(`Item with ip: ${ip} updated`);
                    });
                });
        });
    }

    public delete(address: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.GeoLocalizationItem.findOneAndRemove({ $or: [{ url: address }, { ip: address }] }).exec(
                (error, item) => {
                    if (error) {
                        reject(error);
                    }
                    if (!item) {
                        resolve('Item not found');
                    }
                    resolve('Item deleted');
                }
            );
        });
    }
}
