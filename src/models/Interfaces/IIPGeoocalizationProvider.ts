import { Configuration } from "../Configuration";
import { IPStack } from './IPStackResponse'

export abstract class IIpGeolocalizationProvider{

    constructor(public readonly configuration: Configuration){};

    public abstract proceed(address: string): Promise<IPStack.Response>;
}