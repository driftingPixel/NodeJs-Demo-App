export interface Configuration {
    readonly serverPort: number;
    readonly geoProviderKey: string,
    readonly geoProviderURL: string,
    readonly allowIp: boolean,
    readonly allowUrl: boolean
}
