import {Router} from 'express';
import {testingController} from "./testing-controller";


const testingRouter = Router();

testingRouter.delete('/all-data', testingController.clearDB);

export default testingRouter;