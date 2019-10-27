export interface IDBProvider<T>{
    connect():Promise<T>
}