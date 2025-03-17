import Component from 'sap/feedback/ui/flpplugin/Component';
import ControllerFactory from 'sap/feedback/ui/flpplugin/controller/ControllerFactory';
import InitController from 'sap/feedback/ui/flpplugin/controller/InitController';
import PluginController from 'sap/feedback/ui/flpplugin/controller/PluginController';
import PxApiWrapper from 'sap/feedback/ui/flpplugin/pxapi/PxApiWrapper';
import ControlFactory from 'sap/feedback/ui/flpplugin/ui/ControlFactory';
import InvitationDialog from 'sap/feedback/ui/flpplugin/ui/InvitationDialog';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	const qualtricsInternalUri = 'https://someQualtricsUri.tld';
	const tenantId = 'foo';
	const tenantRole = 'bar';
	const configIdentifier = {
		configUrl: 'somepxconfigUrl',
		unitId: 'SomeUnitId',
		environment: 'test'
	};
	const platformType = 'QUnit';
	const productName = 'UnitTest';

	QUnit.module('Component unit tests', {});

	QUnit.test('init - shall start with old FLP settings (complete)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				qualtricsInternalUri: qualtricsInternalUri,
				tenantId: tenantId,
				tenantRole: tenantRole,
				platformType: platformType,
				productName: productName
			}
		});
		const pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true)),
			pxApiWrapper: pxApiWrapperStub
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);

		const component = new Component();
		await component.init();

		assert.ok(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();

		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('init - shall start with old FLP settings (component data is undefined)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns(undefined as any);
		const runInitProcessStub = sinon.stub(Component.prototype, 'runInitProcess' as any).returns(true);

		const component = new Component();
		await component.init();

		assert.notOk(runInitProcessStub.called);

		getComponentDataStub.restore();
		runInitProcessStub.restore();
	});

	QUnit.test('init - shall start with old FLP settings (complete but pxApiWrapper is not undefined)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				qualtricsInternalUri: qualtricsInternalUri,
				tenantId: tenantId,
				tenantRole: tenantRole,
				platformType: platformType,
				productName: productName
			}
		});
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true)),
			pxApiWrapper: undefined
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);

		const component = new Component();
		await component.init();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('init - shall start with old FLP settings (incomplete, no qualtricsInternalUri)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				tenantId: tenantId,
				tenantRole: tenantRole,
				platformType: platformType,
				productName: productName
			}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		await component.init();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
		createInitControllerStub.restore();
	});

	QUnit.test('init - shall start with old FLP settings (complete but init is not successful)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				qualtricsInternalUri: qualtricsInternalUri,
				tenantId: tenantId,
				tenantRole: tenantRole,
				platformType: platformType,
				productName: productName
			}
		});
		const pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(false)),
			pxApiWrapper: pxApiWrapperStub
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);

		const component = new Component();
		await component.init();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('init - shall start with old FLP settings (incomplete, no tenantId)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				qualtricsInternalUri: qualtricsInternalUri,
				tenantRole: tenantRole,
				platformType: platformType,
				productName: productName
			}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		await component.init();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('init - shall start with new FLP settings (complete)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				configUrl: configIdentifier.configUrl,
				unitId: configIdentifier.unitId,
				environment: configIdentifier.environment,
				tenantId: tenantId,
				tenantRole: tenantRole
			}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true)),
			pxApiWrapper: pxApiWrapperStub
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		await component.init();
		assert.ok(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('init - shall not init with new FLP settings (incomplete, no configUrl)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				unitId: configIdentifier.unitId,
				environment: configIdentifier.environment,
				tenantId: tenantId,
				tenantRole: tenantRole
			}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		await component.init();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('init - shall not init with new FLP settings (incomplete, no unitId)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				configUrl: configIdentifier.configUrl,
				environment: configIdentifier.environment,
				tenantId: tenantId,
				tenantRole: tenantRole
			}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		await component.init();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('init - shall not init with new FLP settings (incomplete, no environment)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {
				configUrl: configIdentifier.configUrl,
				unitId: configIdentifier.unitId,
				tenantId: tenantId,
				tenantRole: tenantRole
			}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		await component.init();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('init - shall not init with old properties (load not called)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('url', qualtricsInternalUri);
		component.setProperty('tenantId', tenantId);
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);
		await component.init();
		assert.notOk(initPluginControllerStub.called);

		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('load - shall init with old properties (complete)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const pluginController = {
			initPlugin: sinon.stub().returns(Promise.resolve(true))
		} as unknown as PluginController;
		const createPluginControllerStub = sinon.stub(ControllerFactory, 'createPluginController').returns(pluginController);
		const pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true)),
			pxApiWrapper: pxApiWrapperStub
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('url', qualtricsInternalUri);
		component.setProperty('tenantId', tenantId);
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);
		await component.load();

		assert.ok(createPluginControllerStub.called);

		getComponentDataStub.restore();
		createPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('load - shall not init with old properties (incomplete, url)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('tenantId', tenantId);
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);
		await component.load();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('load - shall not init with old properties (incomplete, tenantId)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('url', qualtricsInternalUri);
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);
		await component.load();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('load - shall init with new properties (complete)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true)),
			pxApiWrapper: pxApiWrapperStub
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('configIdentifier', configIdentifier);
		component.setProperty('tenantId', tenantId);
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);

		await component.load();
		assert.ok(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('load - shall not init with new properties (incomplete, configIdentifier)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('tenantId', tenantId);
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);
		await component.load();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('load - shall not init with new properties (incomplete, tenantId)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('configIdentifier', configIdentifier);
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);
		await component.load();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('load - shall init with new properties (complete with configJson)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true)),
			pxApiWrapper: pxApiWrapperStub
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('configJson', {});
		component.setProperty('tenantId', tenantId);
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);

		await component.load();
		assert.ok(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});

	QUnit.test('load - shall not init with new properties (incomplete with configJson, no tenantId)', async (assert) => {
		const getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
			config: {}
		});
		const initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController' as any).returns(true);
		const initController = {
			init: sinon.stub().returns(Promise.resolve(true))
		} as unknown as InitController;
		const createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
		const invitationDialog = {
			surveyInvitationDialogShowCallback: sinon.stub()
		} as unknown as InvitationDialog;
		const createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);

		const component = new Component();
		component.setProperty('configJson', {});
		component.setProperty('tenantRole', tenantRole);
		component.setProperty('productName', productName);
		component.setProperty('platformType', platformType);
		await component.load();
		assert.notOk(initPluginControllerStub.called);
		getComponentDataStub.restore();
		initPluginControllerStub.restore();
		createInitControllerStub.restore();
		createSurveyInvitationDialogStub.restore();
	});
};
