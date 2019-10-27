import express from 'express'
import { ConfigurationReader } from './ConfigurationReader'
import { log } from './ConfigLogger'

try {
    log.info('Reading configuration')
    const configuration = ConfigurationReader.read('./configuration.json')
    log.info('Configuration readed properly')
    console.log('configuration:', configuration)
} catch (error) {
    log.error('ERROR', error)
}

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})
