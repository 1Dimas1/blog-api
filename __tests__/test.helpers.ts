import {app} from "../src/app";
import {agent} from "supertest";
import {SETTINGS} from "../src/settings";

export const req = agent(app)

export const getValidCredentials = () => {
    const credentials = `${SETTINGS.CREDENTIALS.LOGIN}:${SETTINGS.CREDENTIALS.PASSWORD}`
    const base64credentials = Buffer.from(credentials).toString('base64')
    const validAuthValue = `Basic ${base64credentials}`
    return validAuthValue;
}

export const createString = (length: number) => {
    let s = ''
    for (let x = 1; x <= length; x++) {
        s += x % 10
    }
    return s
}
