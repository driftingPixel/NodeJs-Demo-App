import fs from 'fs'
import { Configuration } from './models/Configuration'

export class ConfigurationReader {
    public static read(path: string): Configuration {
        return JSON.parse(fs.readFileSync(path).toString()) as Configuration
    }
}
