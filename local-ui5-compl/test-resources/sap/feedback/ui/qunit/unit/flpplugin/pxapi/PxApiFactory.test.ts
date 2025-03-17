import { PxApi } from '@sap-px/pxapi';
import PxApiFactory from 'sap/feedback/ui/flpplugin/pxapi/PxApiFactory';

export default () => {
	QUnit.module('PxApiFactory unit tests');

	QUnit.test('createPxApi - shall create the instance of PxApi', (assert) => {
		const pxApi = PxApiFactory.createPxApi();
		assert.ok(pxApi instanceof PxApi);
	});
};
