import { Configuration } from '../models/Configuration';
import { IPStack } from './IPStackResponse';

export abstract class IIpGeolocalizationProvider {
    constructor(public readonly configuration: Configuration) {}

    public abstract proceed(lookupAddress: string, saveToDb?: boolean): Promise<IPStack.Response | string>;
    public abstract delete(address: string): Promise<any>;
    public abstract put(address: string): Promise<any>;
    public abstract getItem(address: string): Promise<any>;
}
