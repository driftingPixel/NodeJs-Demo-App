import mongoose from 'mongoose';

export class MongoSchemaFactory {
    private static GEOLOCALIZATION_ITEM_SCHEMA = new mongoose.Schema({
        ip: {
            type: String,
            required: [true, 'Address must have ip!!'],
            unique: [true, 'IP must be unique!!'],
        },
        url: {
            type: String,
            unique: [true, 'URL must be unique!!'],
        },
        type: {
            type: String,
            required: [true, 'Address must have a type!!'],
        },
        continentCode: String,
        countryCode: String,
        regionCode: String,
        city: String,
        zipCode: String,
        latitude: Number,
        longitude: Number,
    });

    public static getGeoLocalizationSchema() {
        return MongoSchemaFactory.GEOLOCALIZATION_ITEM_SCHEMA;
    }

    public static getGeoLocalizationType() {
        return mongoose.model('GeoLocalizationItem', MongoSchemaFactory.getGeoLocalizationSchema());
    }
}
