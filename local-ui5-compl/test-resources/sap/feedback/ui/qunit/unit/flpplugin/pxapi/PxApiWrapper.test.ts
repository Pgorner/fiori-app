import { PxApi } from '@sap-px/pxapi';
import { AppContextData, ConfigIdentifier, TenantInfo } from '@sap-px/pxapi/dist/api/common/Types';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Constants from 'sap/feedback/ui/flpplugin/common/Constants';
import PxApiFactory from 'sap/feedback/ui/flpplugin/pxapi/PxApiFactory';
import PxApiWrapper from 'sap/feedback/ui/flpplugin/pxapi/PxApiWrapper';
import InvitationDialog from 'sap/feedback/ui/flpplugin/ui/InvitationDialog';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	const pluginInfo = {
		id: 'pluginId',
		version: 'pluginVersion'
	};

	QUnit.module('PxApiWrapper unit tests', {});

	QUnit.test('createPxApi - shall create the instance of PxApi', (assert) => {
		const pxApi = PxApiFactory.createPxApi();
		assert.ok(pxApi instanceof PxApi);
	});

	QUnit.test('constructor - shall call the createPxApi of PxApiFactory with pxclient info', (assert) => {
		const createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi');
		(globalThis.sap as any).qtx.info.pxclient = 'existingClientInfo/version';

		const pxApiWrapper = new PxApiWrapper(pluginInfo);

		assert.ok(pxApiWrapper);
		assert.ok(createPxApiStub.called);
		assert.ok((globalThis.sap as any).qtx.info.pxclient, 'existingClientInfo/version pluginId/pluginVersion');

		createPxApiStub.restore();
		(globalThis.sap as any).qtx.info.pxclient = undefined;
	});

	QUnit.test('constructor - shall return default version for pxclient info when local build running', (assert) => {
		const createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi');
		(globalThis.sap as any).qtx.info.pxclient = 'existingClientInfo/version';
		const localPluginInfo = {
			id: 'pluginId',
			version: '1.132.0'
		};

		const pxApiWrapper = new PxApiWrapper(localPluginInfo);

		assert.ok(pxApiWrapper);
		assert.ok(createPxApiStub.called);
		assert.ok((globalThis.sap as any).qtx.info.pxclient, 'existingClientInfo/version pluginId/dev-build');

		createPxApiStub.restore();
		(globalThis.sap as any).qtx.info.pxclient = undefined;
	});

	QUnit.test('constructor - shall return fallback infos for pxclient info when no data provided/found.', (assert) => {
		const createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi');
		(globalThis.sap as any).qtx.info.pxclient = 'existingClientInfo/version';
		const expectedResult = 'existingClientInfo/version ' + Constants.PXCLIENT_INFO_NAME_FALLBACK + '/' + Constants.PXCLIENT_INFO_VERSION_FALLBACK;

		const pxApiWrapper = new PxApiWrapper({ id: '', version: '' });

		assert.ok(pxApiWrapper);
		assert.ok(createPxApiStub.called);
		assert.ok((globalThis.sap as any).qtx.info.pxclient, expectedResult);

		createPxApiStub.restore();
		(globalThis.sap as any).qtx.info.pxclient = undefined;
	});

	QUnit.test('initialize - shall call the initialize of PX-API Library', async (assert) => {
		const tenantInfo = {} as TenantInfo;
		const configIdentifier = {} as ConfigIdentifier;
		const pxApiInstance = new PxApi();
		const pxApiInitializeStub = sinon.stub(pxApiInstance, 'initialize');
		const createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi').returns(pxApiInstance);

		const pxApiWrapper = new PxApiWrapper(pluginInfo);
		await pxApiWrapper.initialize(tenantInfo, configIdentifier);
		assert.ok(pxApiInitializeStub.calledWith(tenantInfo, configIdentifier));

		pxApiInitializeStub.restore();
		createPxApiStub.restore();
	});

	QUnit.test('openSurvey - shall call the openSurvey of PX-API Library', (assert) => {
		const appContextData = {};
		const pxApiInstance = new PxApi();
		const pxApiOpenSurveyStub = sinon.stub(pxApiInstance, 'openSurvey');
		const createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi').returns(pxApiInstance);

		const pxApiWrapper = new PxApiWrapper(pluginInfo);
		pxApiWrapper.openSurvey(appContextData as AppContextData);

		assert.ok(pxApiOpenSurveyStub.calledWith(appContextData));

		pxApiOpenSurveyStub.restore();
		createPxApiStub.restore();
	});

	QUnit.test('updateThemeId - shall set current theme to PX-API Library', (assert) => {
		const pxApiWrapper = new PxApiWrapper(pluginInfo);
		assert.equal(pxApiWrapper.pxApi.currentThemeId, 'none');
		pxApiWrapper.updateThemeId('sap_horizon');

		assert.equal(pxApiWrapper.pxApi.currentThemeId, 'sap_horizon');
	});

	QUnit.test('requestPush - shall invoke the "requestPush" of the PX-API Library', (assert) => {
		const pxApiWrapper = new PxApiWrapper(pluginInfo);
		const requestPushStub = sinon.stub(pxApiWrapper.pxApi, 'requestPush');
		const pushFeedbackRequestData = {
			areaId: '123',
			triggerName: 'myTrigger'
		};

		pxApiWrapper.requestPush(pushFeedbackRequestData);

		assert.ok(requestPushStub.calledWith(pushFeedbackRequestData));

		requestPushStub.restore();
	});

	QUnit.test('set/get invitationDialog - shall set and get the invitationDialog', (assert) => {
		const pxApiWrapper = new PxApiWrapper(pluginInfo);
		const dummyInvitationDialog = new InvitationDialog(sinon.createStubInstance(ResourceBundle));

		pxApiWrapper.invitationDialog = dummyInvitationDialog;

		assert.equal(pxApiWrapper.invitationDialog, dummyInvitationDialog);
	});
};
