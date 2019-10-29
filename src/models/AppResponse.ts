export class AppResponse {
    public static readonly OK: string = 'OK';
    public static readonly FAIL: string = 'FAIL';

    public readonly authtoken: string | undefined;
    public status: string;
    public data: any;

    constructor(status: string = '', data?: any, authtoken?: string) {
        this.status = status;
        this.data = data;
        this.authtoken = authtoken;
    }

    public setStatus(status: string): AppResponse {
        this.status = status;
        return this;
    }

    public setData(data: any): AppResponse {
        this.data = data;
        return this;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}
