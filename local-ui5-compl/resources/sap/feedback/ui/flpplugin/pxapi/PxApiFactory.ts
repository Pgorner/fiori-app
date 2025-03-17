import { PxApi } from '@sap-px/pxapi';

export default class PxApiFactory {
	static createPxApi() {
		return new PxApi();
	}
}
