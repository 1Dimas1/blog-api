import mongoose from 'mongoose';
import {SETTINGS} from "../settings";

const url: string | undefined = SETTINGS.MONGO_URL

if (!url) {
    throw Error('!!! URL has not been found')
}

export const connectToDB = async () => {
    try {
        await mongoose.connect(
            SETTINGS.MONGO_URL!, {
                dbName: SETTINGS.DB_NAME!
            }
        )
        console.log('connected to db')
    } catch (e) {
        console.log('Unable to connected to db')
        console.log(e)
        await mongoose.disconnect()
    }
}