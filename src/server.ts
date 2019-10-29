import express from 'express';
import { ConfigurationReader } from './ConfigurationReader';
import { log } from './ConfigLogger';
import { IIpGeolocalizationProvider } from './Interfaces/IIPGeoocalizationProvider';
import { IPStackProvider } from './providers/IPStackProvider';
import { App } from './App';
import dotenv from 'dotenv';

try {
    dotenv.config({ path: './config.env' });
    log.info('Reading configuration');
    const configuration = ConfigurationReader.read('./configuration.json');
    const ipGeolocalizationProvider: IIpGeolocalizationProvider = new IPStackProvider(configuration);
    log.info('Configuration readed properly');

    const app = new App(configuration, ipGeolocalizationProvider);
} catch (error) {
    log.error('ERROR', error);
}
