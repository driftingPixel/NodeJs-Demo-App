import express, { response } from 'express'
import { ConfigurationReader } from './ConfigurationReader'
import { log } from './ConfigLogger'
import { IIpGeolocalizationProvider } from './Interfaces/IIPGeoocalizationProvider';
import { IPStackProvider } from './providers/IPStackProvider'
import { Configuration } from './models/Configuration'
import request from 'superagent';

try {
    log.info('Reading configuration');
    const configuration = ConfigurationReader.read('./configuration.json');
    const ipGeolocalizationProvider: IIpGeolocalizationProvider = new IPStackProvider(configuration);
    log.info('Configuration readed properly');
    console.log('configuration:', configuration);

    const app = express()
    const PORT = process.env.PORT || 3000

    app.get('/ipgeo/:address', async (req, res) => {
        
        //TODO check params
        if(!req.params.address)
            res
            .status(400)
            .end('you must provide an address to search for');

        ipGeolocalizationProvider.proceed(req.params.address)
        .then((data) => res.end(JSON.stringify(data)))
        .catch((error) => {
            log.error('ERROR', error);
            res.status(500)
            .end(error.message);
        })
       
    })

    app.get('/', (req, res) => {
        res.send('API is working good ;).')
    })
    
    app.listen(PORT, () => {
        console.log(`Server is running in http://localhost:${PORT}`)
    }) 
} catch (error) {
    log.error('ERROR', error);
}