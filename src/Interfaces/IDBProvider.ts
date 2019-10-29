import { IPStack } from '../models/IPStackResponse';
import { IPStackProvider } from '../providers/IPStackProvider';

/**
 * Interface for DB Providers
 */
export interface IDBProvider<T> {
    get(address: string): Promise<any>;
    connect(): Promise<T>;
    save(item: IPStack.Response, url?: string): Promise<T>;
    update(item: IPStack.Response, url?: string): Promise<T>;
    patch(address: string, itemData: any): Promise<T>;
    delete(address: string): Promise<T>;
}
