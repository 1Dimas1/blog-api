import {Router} from "express";
import {securityDevicesController} from "./security-devices.controller";

const securityDevicesRouter: Router = Router();

securityDevicesRouter.get('/', securityDevicesController.getAllDevices);
securityDevicesRouter.delete('/', securityDevicesController.deleteAllOtherSessions);
securityDevicesRouter.delete('/:deviceId', securityDevicesController.deleteDeviceSession);

export default securityDevicesRouter;