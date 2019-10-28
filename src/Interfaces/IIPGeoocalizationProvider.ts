import { Configuration } from "../models/Configuration";
import { IPStack } from './IPStackResponse'

export abstract class IIpGeolocalizationProvider{

    constructor(public readonly configuration: Configuration){};

    public abstract proceed(address: string, saveTodb: boolean): Promise<IPStack.Response | string>;
}