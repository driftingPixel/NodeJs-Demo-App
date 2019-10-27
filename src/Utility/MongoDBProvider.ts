import { Configuration } from '../models/Configuration';
import mongoose, { Mongoose } from 'mongoose';
import { IDBProvider } from '../Interfaces/IDBProvider';

export class MongoDBProvider implements IDBProvider<Mongoose>{
    
    constructor(private readonly configuration: Configuration){}

    public connect(): Promise<Mongoose>{
        return mongoose.connect(this.configuration.database, {
            auth: {
              user: this.configuration.dbUser,
              password: this.configuration.dbPassword
            },
            useNewUrlParser: true
        })
    }
    
}