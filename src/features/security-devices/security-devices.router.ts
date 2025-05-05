import {Router} from "express";
import SecurityDevicesController from "./security-devices.controller";
import container from "../../container/inversify.config";

const securityDevicesRouter: Router = Router();

const securityDevicesController: SecurityDevicesController = container.get(SecurityDevicesController);

securityDevicesRouter.get('/', securityDevicesController.getAllDevices.bind(securityDevicesController));
securityDevicesRouter.delete('/', securityDevicesController.deleteAllOtherSessions.bind(securityDevicesController));
securityDevicesRouter.delete('/:deviceId', securityDevicesController.deleteDeviceSession.bind(securityDevicesController));

export default securityDevicesRouter;