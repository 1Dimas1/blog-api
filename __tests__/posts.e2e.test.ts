import {HTTP_CODES, SETTINGS} from "../src/settings";
import {req} from './test.helpers'

describe('/blogs', () => {
    beforeEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(204)
    })

    it('GET posts = []', async () => {

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_CODES.OK_200)

        console.log(res.body)

        expect(res.body.length).toBe(0)
    })
})