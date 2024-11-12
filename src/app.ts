import express from 'express'
import {HTTP_CODES} from "./settings";

export const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.status(HTTP_CODES.OK_200).json({version: '1.0'})
})