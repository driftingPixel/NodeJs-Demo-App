import { IPStack } from './IPStackResponse';
import { IPStackProvider } from '../providers/IPStackProvider';

export interface IDBProvider<T> {
    get(address: string): Promise<any>;
    connect(): Promise<T>;
    save(item: IPStack.Response, url?: string): Promise<T>;
    update(item: IPStack.Response, url?: string): Promise<T>;
    delete(address: string): Promise<T>;
}
