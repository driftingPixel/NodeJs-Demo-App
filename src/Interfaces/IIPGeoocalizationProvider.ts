import { Configuration } from "../models/Configuration";
import { Dictionary, Request, Response} from "express-serve-static-core";
import { IPStack } from '../Interfaces/IPStackResponse'

export abstract class IIpGeolocalizationProvider{

    constructor(public readonly configuration: Configuration){};

    public abstract proceed(address: string): Promise<IPStack.Response>;
}