export interface Configuration {
    readonly serverPort: number;
    readonly geoProviderKey: string,
    readonly geoProviderURL: string,
    readonly database: string,
    readonly dbUser: string,
    readonly dbPassword: string,
    readonly allowIp: boolean,
    readonly allowUrl: boolean
}
