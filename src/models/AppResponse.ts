export class AppResponse{

    public static readonly OK: string = 'OK';
    public static readonly FAIL: string = 'FAIL';

    public status: string;
    public data: any;

    constructor(status: string = "", data?: any, storedInDB?: any){
        this.status = status;
        this.data = data;
    }

    public setStatus(status: string): AppResponse{
        this.status = status;
        return this;
    }

    public setData(data: any): AppResponse{
        this.data = data;
        return this;
    }

    public toString(): string{
        return JSON.stringify(this);
    }
}